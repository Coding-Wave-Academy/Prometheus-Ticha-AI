-- ─── Supabase Database Schema & RLS Policies for Ticha AI ──────────────────────

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
  streak_count INT NOT NULL DEFAULT 1,
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

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Trigger to automatically create a profile entry when a new user signs up (Email or OAuth)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'Student'),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
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
CREATE POLICY "Knowledge embeddings viewable by authenticated users"
  ON public.knowledge_embeddings FOR SELECT
  TO authenticated
  USING (true);


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
CREATE TABLE IF NOT EXISTS public.educational_levels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE CHECK (code IN ('O/L', 'A/L', 'UNIVERSITY')),
  name TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  level_id UUID NOT NULL REFERENCES public.educational_levels(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_subject_code_per_level UNIQUE (level_id, code)
);

CREATE TABLE IF NOT EXISTS public.papers (
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

CREATE TABLE IF NOT EXISTS public.api_clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  api_key_hash TEXT NOT NULL UNIQUE,
  tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'pro', 'enterprise')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.download_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  paper_id UUID NOT NULL REFERENCES public.papers(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.api_clients(id) ON DELETE SET NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_papers_subject_year ON public.papers(subject_id, year DESC);
CREATE INDEX IF NOT EXISTS idx_papers_level ON public.papers(level_id);
CREATE INDEX IF NOT EXISTS idx_papers_is_active ON public.papers(is_active);
CREATE INDEX IF NOT EXISTS idx_papers_fts ON public.papers USING GIN(fts);
CREATE INDEX IF NOT EXISTS idx_subjects_level_active ON public.subjects(level_id, is_active);
CREATE INDEX IF NOT EXISTS idx_download_events_paper_id ON public.download_events(paper_id);
CREATE INDEX IF NOT EXISTS idx_api_clients_key_hash ON public.api_clients(api_key_hash);

ALTER TABLE public.educational_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.download_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public levels viewable by all" ON public.educational_levels FOR SELECT USING (true);
CREATE POLICY "Public subjects viewable by all" ON public.subjects FOR SELECT USING (true);
CREATE POLICY "Active papers viewable by all" ON public.papers FOR SELECT USING (is_active = true);

