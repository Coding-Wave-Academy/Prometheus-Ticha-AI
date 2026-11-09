-- ════════════════════════════════════════════════════════════════════════════
-- Streaks, part 2 of 2: profile columns that only the server may change
--
-- Run AFTER the app version that uses sync_streak() / claim_daily_streak()
-- is deployed. An older app version still open in a tab will get a
-- permission error when it claims a streak, and works again on reload.
--
-- RLS still decides WHICH ROW a student may touch (their own). These column
-- privileges decide WHICH FIELDS. points, streak_count, freezes_remaining,
-- last_active_date, streak_anchor and freezes_refilled_on are written only by
-- SECURITY DEFINER functions (claim_daily_streak, sync_streak, handle_new_user).
-- ════════════════════════════════════════════════════════════════════════════

REVOKE INSERT, UPDATE ON public.profiles FROM anon, authenticated;

GRANT UPDATE (
  full_name,
  avatar_url,
  education_level,
  goal,
  struggles,
  region,
  school_name,
  profile_completed,
  preferred_language,
  updated_at
) ON public.profiles TO authenticated;

GRANT INSERT (
  id,
  full_name,
  avatar_url,
  education_level,
  goal,
  struggles,
  region,
  school_name,
  profile_completed,
  preferred_language,
  updated_at
) ON public.profiles TO authenticated;

-- Deleting the profile and inserting a fresh one would bypass the rules above.
-- Account deletion removes auth.users, which cascades to profiles.
DROP POLICY IF EXISTS "Users can delete their own profile" ON public.profiles;
REVOKE DELETE ON public.profiles FROM anon, authenticated;
