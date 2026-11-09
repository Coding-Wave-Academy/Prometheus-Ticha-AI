-- ════════════════════════════════════════════════════════════════════════════
-- Streaks, part 1 of 2 (additive; safe to run while the current app is live)
--
-- Rules (Africa/Douala calendar days):
--   • One claim per day moves the streak by +1.
--   • A missed day uses a freeze. With no freeze left, the streak resets to 0
--     (the next claim starts a new streak at 1).
--   • Freezes refill to 2 every Monday.
--   • A claim may be for today or yesterday (yesterday = studied offline and
--     synced the next day). Older days cannot be claimed.
--
-- State lives on `profiles`:
--   streak_count       current streak
--   freezes_remaining  0..2
--   streak_anchor      latest day covered by an active or frozen day
--   freezes_refilled_on Monday of the week freezes were last refilled
--   last_active_date   latest day actually studied
-- and one row per covered day in `streak_days`.
--
-- Run part 2 (20261109_02_lock_profile_columns.sql) after the app version that
-- calls these functions is deployed.
-- ════════════════════════════════════════════════════════════════════════════

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS streak_anchor DATE,
  ADD COLUMN IF NOT EXISTS freezes_refilled_on DATE;

-- New students start at 0; the first claim makes it 1.
ALTER TABLE public.profiles ALTER COLUMN streak_count SET DEFAULT 0;

-- Existing streaks continue from the last day each student was active.
UPDATE public.profiles
SET streak_anchor = last_active_date
WHERE streak_anchor IS NULL AND last_active_date IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.streak_days (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  day DATE NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('active', 'frozen')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, day)
);

ALTER TABLE public.streak_days ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own streak days" ON public.streak_days;
CREATE POLICY "Users can view their own streak days"
  ON public.streak_days FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- Only the functions below write streak_days.
REVOKE INSERT, UPDATE, DELETE ON public.streak_days FROM anon, authenticated;
GRANT SELECT ON public.streak_days TO authenticated;


-- ─── Internal: today's date in Cameroon ─────────────────────────────────────
CREATE OR REPLACE FUNCTION public._streak_today()
RETURNS DATE
LANGUAGE sql
STABLE
SET search_path = public, pg_temp
AS $$
  SELECT (now() AT TIME ZONE 'Africa/Douala')::date;
$$;


-- ─── Internal: apply Monday refill and close out days that can no longer be
-- claimed. The caller must hold the profile row lock. Idempotent.
CREATE OR REPLACE FUNCTION public._streak_reconcile(p_user UUID, p_today DATE)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_monday DATE := p_today - (EXTRACT(ISODOW FROM p_today)::int - 1);
  v_profile public.profiles%ROWTYPE;
  v_missed INT;
BEGIN
  SELECT * INTO v_profile FROM public.profiles WHERE id = p_user;
  IF NOT FOUND THEN
    RETURN;
  END IF;

  -- 1. Weekly refill.
  IF v_profile.freezes_refilled_on IS NULL OR v_profile.freezes_refilled_on < v_monday THEN
    UPDATE public.profiles
    SET freezes_remaining = 2, freezes_refilled_on = v_monday
    WHERE id = p_user;
    v_profile.freezes_remaining := 2;
  END IF;

  -- 2. Days before yesterday with no activity are definitely missed
  --    (yesterday stays open for an offline claim).
  IF v_profile.streak_count > 0 AND v_profile.streak_anchor IS NOT NULL THEN
    v_missed := (p_today - 1) - v_profile.streak_anchor - 1;
    IF v_missed > 0 THEN
      IF v_profile.freezes_remaining >= v_missed THEN
        INSERT INTO public.streak_days (user_id, day, kind)
        SELECT p_user, d::date, 'frozen'
        FROM generate_series(v_profile.streak_anchor + 1, p_today - 2, INTERVAL '1 day') AS d
        ON CONFLICT (user_id, day) DO NOTHING;

        UPDATE public.profiles
        SET freezes_remaining = freezes_remaining - v_missed,
            streak_anchor = p_today - 2
        WHERE id = p_user;
      ELSE
        -- Day by day, the remaining freezes cover the first missed days and
        -- the next missed day breaks the streak. Applying that here gives
        -- the same result whether or not the student opened the app during
        -- the gap.
        IF v_profile.freezes_remaining > 0 THEN
          INSERT INTO public.streak_days (user_id, day, kind)
          SELECT p_user, d::date, 'frozen'
          FROM generate_series(
            v_profile.streak_anchor + 1,
            v_profile.streak_anchor + v_profile.freezes_remaining,
            INTERVAL '1 day'
          ) AS d
          ON CONFLICT (user_id, day) DO NOTHING;
        END IF;

        UPDATE public.profiles
        SET streak_count = 0, freezes_remaining = 0
        WHERE id = p_user;
      END IF;
    END IF;
  END IF;
END;
$$;


-- ─── Internal: state returned to the app ────────────────────────────────────
CREATE OR REPLACE FUNCTION public._streak_state(p_user UUID, p_today DATE, p_was_reset BOOLEAN)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_profile public.profiles%ROWTYPE;
  v_week_start DATE := p_today - EXTRACT(DOW FROM p_today)::int; -- Sunday
BEGIN
  SELECT * INTO v_profile FROM public.profiles WHERE id = p_user;
  RETURN jsonb_build_object(
    'streak_count', COALESCE(v_profile.streak_count, 0),
    'freezes_remaining', COALESCE(v_profile.freezes_remaining, 0),
    'last_active_date', v_profile.last_active_date,
    'today', p_today,
    'claimed_today', EXISTS (
      SELECT 1 FROM public.streak_days
      WHERE user_id = p_user AND day = p_today AND kind = 'active'
    ),
    'was_reset', p_was_reset,
    'week', COALESCE((
      SELECT jsonb_agg(jsonb_build_object('day', day, 'kind', kind) ORDER BY day)
      FROM public.streak_days
      WHERE user_id = p_user AND day BETWEEN v_week_start AND v_week_start + 6
    ), '[]'::jsonb)
  );
END;
$$;


-- ─── Internal: sync (testable with a fixed date) ────────────────────────────
CREATE OR REPLACE FUNCTION public._streak_sync(p_user UUID, p_today DATE)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_before INT;
  v_after INT;
BEGIN
  SELECT streak_count INTO v_before FROM public.profiles WHERE id = p_user FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'profile not found' USING ERRCODE = 'P0002';
  END IF;

  PERFORM public._streak_reconcile(p_user, p_today);

  SELECT streak_count INTO v_after FROM public.profiles WHERE id = p_user;
  RETURN public._streak_state(p_user, p_today, v_before > 0 AND v_after = 0);
END;
$$;


-- ─── Internal: claim (testable with a fixed date) ───────────────────────────
CREATE OR REPLACE FUNCTION public._streak_claim(p_user UUID, p_day DATE, p_today DATE)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_day DATE := COALESCE(p_day, p_today);
  v_profile public.profiles%ROWTYPE;
  v_missed INT;
  v_was_reset BOOLEAN := false;
BEGIN
  IF v_day NOT IN (p_today, p_today - 1) THEN
    RAISE EXCEPTION 'streak can only be claimed for today or yesterday'
      USING ERRCODE = '22023';
  END IF;

  -- Serialises concurrent claims from the same student.
  PERFORM 1 FROM public.profiles WHERE id = p_user FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'profile not found' USING ERRCODE = 'P0002';
  END IF;

  PERFORM public._streak_reconcile(p_user, p_today);
  SELECT * INTO v_profile FROM public.profiles WHERE id = p_user;

  -- Already covered for this day: the count doesn't change. If a freeze was
  -- spent on it (the offline claim arrived after a later claim), give the
  -- freeze back, since the student did study that day.
  IF EXISTS (SELECT 1 FROM public.streak_days WHERE user_id = p_user AND day = v_day) THEN
    WITH upgraded AS (
      UPDATE public.streak_days SET kind = 'active'
      WHERE user_id = p_user AND day = v_day AND kind = 'frozen'
      RETURNING 1
    )
    UPDATE public.profiles
    SET freezes_remaining = LEAST(2, freezes_remaining + (SELECT COUNT(*) FROM upgraded)),
        last_active_date = GREATEST(COALESCE(last_active_date, v_day), v_day)
    WHERE id = p_user;
    RETURN public._streak_state(p_user, p_today, false);
  END IF;

  IF v_profile.streak_count = 0 OR v_profile.streak_anchor IS NULL THEN
    -- First claim, or first claim after a reset.
    UPDATE public.profiles
    SET streak_count = 1, streak_anchor = v_day
    WHERE id = p_user;
  ELSIF v_day <= v_profile.streak_anchor THEN
    -- A late claim for a day already inside the streak (e.g. yesterday's
    -- offline claim arriving after today's): record it, count unchanged.
    NULL;
  ELSE
    v_missed := v_day - v_profile.streak_anchor - 1;
    IF v_missed = 0 THEN
      UPDATE public.profiles
      SET streak_count = streak_count + 1, streak_anchor = v_day
      WHERE id = p_user;
    ELSIF v_profile.freezes_remaining >= v_missed THEN
      INSERT INTO public.streak_days (user_id, day, kind)
      SELECT p_user, d::date, 'frozen'
      FROM generate_series(v_profile.streak_anchor + 1, v_day - 1, INTERVAL '1 day') AS d
      ON CONFLICT (user_id, day) DO NOTHING;

      UPDATE public.profiles
      SET streak_count = streak_count + 1,
          freezes_remaining = freezes_remaining - v_missed,
          streak_anchor = v_day
      WHERE id = p_user;
    ELSE
      -- Not enough freezes: the streak breaks; today is day 1 of a new one.
      UPDATE public.profiles
      SET streak_count = 1, streak_anchor = v_day
      WHERE id = p_user;
      v_was_reset := true;
    END IF;
  END IF;

  INSERT INTO public.streak_days (user_id, day, kind) VALUES (p_user, v_day, 'active');
  UPDATE public.profiles
  SET last_active_date = GREATEST(COALESCE(last_active_date, v_day), v_day),
      updated_at = NOW()
  WHERE id = p_user;

  RETURN public._streak_state(p_user, p_today, v_was_reset);
END;
$$;


-- ─── Public API (called by the app as the signed-in student) ────────────────

-- Applies the Monday refill and any freeze/reset for missed days, then returns
-- the current streak state. Call on app open.
CREATE OR REPLACE FUNCTION public.sync_streak()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_user UUID := auth.uid();
BEGIN
  IF v_user IS NULL THEN
    RAISE EXCEPTION 'not authenticated' USING ERRCODE = '42501';
  END IF;
  RETURN public._streak_sync(v_user, public._streak_today());
END;
$$;

-- Records study activity for today (default) or yesterday (offline sync).
CREATE OR REPLACE FUNCTION public.claim_daily_streak(p_day DATE DEFAULT NULL)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_user UUID := auth.uid();
BEGIN
  IF v_user IS NULL THEN
    RAISE EXCEPTION 'not authenticated' USING ERRCODE = '42501';
  END IF;
  RETURN public._streak_claim(v_user, p_day, public._streak_today());
END;
$$;

-- Internal functions take a user id, so clients must never call them.
REVOKE ALL ON FUNCTION public._streak_today() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public._streak_reconcile(UUID, DATE) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public._streak_state(UUID, DATE, BOOLEAN) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public._streak_sync(UUID, DATE) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public._streak_claim(UUID, DATE, DATE) FROM PUBLIC, anon, authenticated;

REVOKE ALL ON FUNCTION public.sync_streak() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.claim_daily_streak(DATE) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.sync_streak() TO authenticated;
GRANT EXECUTE ON FUNCTION public.claim_daily_streak(DATE) TO authenticated;
