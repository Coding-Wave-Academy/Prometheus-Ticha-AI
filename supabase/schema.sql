-- ─── Supabase Database Schema & RLS Policies for Ticha AI ──────────────────────
-- Clean, Idempotent, and Fully Executable Script

-- Enable required Postgres extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 1. PROFILES TABLE (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  education_level TEXT CHECK (education_level IN ('ol', 'al', 'university')),
  goal TEXT,
  struggles JSONB DEFAULT '[]'::jsonb,
  streak_count INT NOT NULL DEFAULT 0,
  freezes_remaining INT NOT NULL DEFAULT 2,
  last_active_date DATE,
  points INT NOT NULL DEFAULT 0,
  region TEXT DEFAULT 'Littoral',
  school_name TEXT,
  profile_completed BOOLEAN NOT NULL DEFAULT false,
  preferred_language TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies (Drop before create for idempotency)
DROP POLICY IF EXISTS "Public profiles are viewable by authenticated users" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON public.profiles;

-- Strict student privacy: Users can only read and delete their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- No DELETE policy: deleting and re-inserting a profile would bypass the
-- server-owned streak fields. Account deletion cascades from auth.users.

-- Trigger to automatically create a profile entry when a new user signs up (Email or OAuth)
-- Uses SECURITY DEFINER with fixed search_path to prevent privilege escalation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    full_name,
    avatar_url,
    goal,
    education_level,
    struggles,
    preferred_language
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'Student'),
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'goal',
    NEW.raw_user_meta_data->>'education_level',
    COALESCE(NEW.raw_user_meta_data->'struggles', '["Physics", "Pure Mathematics", "ICT"]'::jsonb),
    COALESCE(NEW.raw_user_meta_data->>'preferred_language', 'en')
  )
  ON CONFLICT (id) DO UPDATE SET
    goal = COALESCE(EXCLUDED.goal, public.profiles.goal),
    education_level = COALESCE(EXCLUDED.education_level, public.profiles.education_level),
    struggles = COALESCE(EXCLUDED.struggles, public.profiles.struggles),
    preferred_language = COALESCE(EXCLUDED.preferred_language, public.profiles.preferred_language);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 2. COURSES TAXONOMY TABLES
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  education_level TEXT CHECK (education_level IN ('ol', 'al', 'university')),
  description TEXT NOT NULL,
  thumbnail_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  order_index INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content_type TEXT CHECK (content_type IN ('text', 'video', 'interactive')),
  content_body TEXT,
  video_url TEXT,
  duration INT DEFAULT 5,
  order_index INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.quizzes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  questions_json JSONB NOT NULL DEFAULT '[]'::jsonb
);

-- Enable RLS on Course tables (Public Read)
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Courses read-only for public" ON public.courses;
DROP POLICY IF EXISTS "Modules read-only for public" ON public.modules;
DROP POLICY IF EXISTS "Lessons read-only for public" ON public.lessons;
DROP POLICY IF EXISTS "Quizzes read-only for public" ON public.quizzes;

CREATE POLICY "Courses read-only for public" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Modules read-only for public" ON public.modules FOR SELECT USING (true);
CREATE POLICY "Lessons read-only for public" ON public.lessons FOR SELECT USING (true);
CREATE POLICY "Quizzes read-only for public" ON public.quizzes FOR SELECT USING (true);


-- 3. USER PROGRESS TABLE
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('completed', 'in_progress')) DEFAULT 'in_progress',
  score INT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can insert/update their own progress" ON public.user_progress;

CREATE POLICY "Users can view their own progress"
  ON public.user_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert/update their own progress"
  ON public.user_progress FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);


-- 4. SECOND BRAIN RAG VECTOR EMBEDDINGS TABLE
CREATE TABLE IF NOT EXISTS public.knowledge_embeddings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject TEXT NOT NULL,
  topic TEXT NOT NULL,
  content_chunk TEXT NOT NULL,
  embedding vector(768), -- Dimension for Gemini/text-embedding-004
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.knowledge_embeddings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Knowledge embeddings viewable by authenticated users" ON public.knowledge_embeddings;

CREATE POLICY "Knowledge embeddings viewable by authenticated users"
  ON public.knowledge_embeddings FOR SELECT
  TO authenticated
  USING (true);


-- 4b. CORRECTED RAG — KNOWLEDGE DOCUMENTS (Source-of-truth Markdown files)
CREATE TABLE IF NOT EXISTS public.knowledge_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  topic TEXT,
  education_level TEXT DEFAULT 'al' CHECK (education_level IN ('ol', 'al', 'university')),
  source_type TEXT NOT NULL DEFAULT 'pdf' CHECK (source_type IN ('pdf', 'image', 'docx', 'txt', 'manual')),
  source_filename TEXT,
  markdown_content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  chunk_count INT NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'processing' CHECK (status IN ('processing', 'ready', 'error')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.knowledge_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Knowledge documents viewable by authenticated" ON public.knowledge_documents;
DROP POLICY IF EXISTS "Knowledge documents writable by service_role" ON public.knowledge_documents;

CREATE POLICY "Knowledge documents viewable by authenticated"
  ON public.knowledge_documents FOR SELECT
  TO authenticated
  USING (status = 'ready');

CREATE POLICY "Knowledge documents writable by service_role"
  ON public.knowledge_documents FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);


-- 4c. CORRECTED RAG — KNOWLEDGE CHUNKS (Vector-indexed semantic pieces)
CREATE TABLE IF NOT EXISTS public.knowledge_chunks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID NOT NULL REFERENCES public.knowledge_documents(id) ON DELETE CASCADE,
  chunk_index INT NOT NULL,
  content TEXT NOT NULL,
  subject TEXT NOT NULL,
  topic TEXT,
  education_level TEXT DEFAULT 'al',
  embedding vector(768),
  token_count INT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.knowledge_chunks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Knowledge chunks viewable by authenticated" ON public.knowledge_chunks;
DROP POLICY IF EXISTS "Knowledge chunks writable by service_role" ON public.knowledge_chunks;

CREATE POLICY "Knowledge chunks viewable by authenticated"
  ON public.knowledge_chunks FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Knowledge chunks writable by service_role"
  ON public.knowledge_chunks FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- HNSW index for fast cosine similarity search
CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_embedding
  ON public.knowledge_chunks USING hnsw (embedding vector_cosine_ops);

-- Composite index for filtered vector search
CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_subject_level
  ON public.knowledge_chunks (subject, education_level);

CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_document
  ON public.knowledge_chunks (document_id);

-- RPC: Semantic search with optional subject/level filtering
CREATE OR REPLACE FUNCTION match_knowledge_chunks(
  query_embedding vector(768),
  match_count INT DEFAULT 5,
  filter_subject TEXT DEFAULT NULL,
  filter_level TEXT DEFAULT NULL,
  similarity_threshold FLOAT DEFAULT 0.5
)
RETURNS TABLE (
  id UUID,
  document_id UUID,
  content TEXT,
  subject TEXT,
  topic TEXT,
  similarity FLOAT,
  metadata JSONB
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT
    kc.id,
    kc.document_id,
    kc.content,
    kc.subject,
    kc.topic,
    (1 - (kc.embedding <=> query_embedding))::FLOAT AS similarity,
    kc.metadata
  FROM public.knowledge_chunks kc
  WHERE
    (filter_subject IS NULL OR kc.subject = filter_subject)
    AND (filter_level IS NULL OR kc.education_level = filter_level)
    AND (1 - (kc.embedding <=> query_embedding)) > similarity_threshold
  ORDER BY kc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;


-- 5. AI TUTOR SESSIONS & MESSAGES
CREATE TABLE IF NOT EXISTS public.tutor_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  topic TEXT,
  education_level TEXT,
  performance_score FLOAT NOT NULL DEFAULT 0.5,
  total_messages INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.tutor_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own tutor sessions" ON public.tutor_sessions;
DROP POLICY IF EXISTS "Users can create their own tutor sessions" ON public.tutor_sessions;
DROP POLICY IF EXISTS "Users can update their own tutor sessions" ON public.tutor_sessions;

CREATE POLICY "Users can view their own tutor sessions"
  ON public.tutor_sessions FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can create their own tutor sessions"
  ON public.tutor_sessions FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their own tutor sessions"
  ON public.tutor_sessions FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE TABLE IF NOT EXISTS public.tutor_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES public.tutor_sessions(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('user', 'assistant', 'system')) NOT NULL,
  content TEXT NOT NULL,
  content_type TEXT CHECK (content_type IN ('text', 'micro_lesson', 'exercise', 'feedback', 'image')) DEFAULT 'text',
  is_correct BOOLEAN,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.tutor_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view messages in their sessions" ON public.tutor_messages;
DROP POLICY IF EXISTS "Users can insert messages in their sessions" ON public.tutor_messages;

CREATE POLICY "Users can view messages in their sessions"
  ON public.tutor_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.tutor_sessions ts
      WHERE ts.id = session_id AND ts.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Users can insert messages in their sessions"
  ON public.tutor_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.tutor_sessions ts
      WHERE ts.id = session_id AND ts.user_id = (select auth.uid())
    )
  );


-- 6. PAST PAPER API TABLES & INDEXES
DROP TABLE IF EXISTS public.download_events CASCADE;
DROP TABLE IF EXISTS public.papers CASCADE;
DROP TABLE IF EXISTS public.subjects CASCADE;
DROP TABLE IF EXISTS public.educational_levels CASCADE;
DROP TABLE IF EXISTS public.api_clients CASCADE;

CREATE TABLE public.educational_levels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE CHECK (code IN ('O/L', 'A/L', 'UNIVERSITY')),
  name TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  level_id UUID NOT NULL REFERENCES public.educational_levels(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_subject_code_per_level UNIQUE (level_id, code)
);

CREATE TABLE public.papers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  level_id UUID NOT NULL REFERENCES public.educational_levels(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  year INT NOT NULL CHECK (year >= 1990 AND year <= 2100),
  exam_session TEXT,
  description TEXT,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL DEFAULT 0,
  file_type TEXT NOT NULL DEFAULT 'application/pdf',
  downloads_count INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  fts TSVECTOR GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'B')
  ) STORED,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.api_clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  api_key_hash TEXT NOT NULL UNIQUE,
  tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'pro', 'enterprise')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.download_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  paper_id UUID NOT NULL REFERENCES public.papers(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.api_clients(id) ON DELETE SET NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_papers_subject_year ON public.papers(subject_id, year DESC);
CREATE INDEX idx_papers_level ON public.papers(level_id);
CREATE INDEX idx_papers_is_active ON public.papers(is_active);
CREATE INDEX idx_papers_fts ON public.papers USING GIN(fts);
CREATE INDEX idx_subjects_level_active ON public.subjects(level_id, is_active);
CREATE INDEX idx_download_events_paper_id ON public.download_events(paper_id);
CREATE INDEX idx_api_clients_key_hash ON public.api_clients(api_key_hash);

ALTER TABLE public.educational_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.download_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public levels viewable by all" ON public.educational_levels FOR SELECT USING (true);
CREATE POLICY "Public subjects viewable by all" ON public.subjects FOR SELECT USING (true);
CREATE POLICY "Active papers viewable by all" ON public.papers FOR SELECT USING (is_active = true);

CREATE POLICY "Service role full access levels" ON public.educational_levels FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access subjects" ON public.subjects FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access papers" ON public.papers FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access api_clients" ON public.api_clients FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access download_events" ON public.download_events FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 7. STORAGE BUCKETS
INSERT INTO storage.buckets (id, name, public)
VALUES ('past-papers', 'past-papers', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage policies for user avatars
DROP POLICY IF EXISTS "Public Avatar Access" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;

CREATE POLICY "Public Avatar Access"
ON storage.objects FOR SELECT
TO anon, authenticated
USING ( bucket_id = 'avatars' );

CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text );

CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text )
WITH CHECK ( bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text );


-- ════════════════════════════════════════════════════════════════════════════
-- 8. STREAKS (server-owned). Same content as supabase/migrations/20261109_01
--    and 20261109_02; existing projects run those files instead.
-- ════════════════════════════════════════════════════════════════════════════
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
