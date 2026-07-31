-- ====================================================================
-- Ticha AI — Past Paper Database Schema (Supabase / Postgres)
-- Clean, Idempotent, and Fully Executable Script
-- ====================================================================

-- 1. Enable required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Clean up any pre-existing conflicting tables to avoid FK column mismatch errors
DROP TABLE IF EXISTS public.download_events CASCADE;
DROP TABLE IF EXISTS public.papers CASCADE;
DROP TABLE IF EXISTS public.subjects CASCADE;
DROP TABLE IF EXISTS public.educational_levels CASCADE;
DROP TABLE IF EXISTS public.api_clients CASCADE;

-- 2. Educational Levels Table
CREATE TABLE public.educational_levels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE CHECK (code IN ('O/L', 'A/L', 'UNIVERSITY')),
  name TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Subjects Table
CREATE TABLE public.subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  level_id UUID NOT NULL REFERENCES public.educational_levels(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_subject_code_per_level UNIQUE (level_id, code)
);

-- 4. Past Papers Table
CREATE TABLE public.papers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  level_id UUID NOT NULL REFERENCES public.educational_levels(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  year INT NOT NULL CHECK (year >= 1990 AND year <= 2100),
  exam_session TEXT, -- e.g. 'June', 'November', 'First Semester', 'Second Semester'
  description TEXT,
  file_path TEXT NOT NULL, -- Path inside Supabase Storage bucket 'past-papers'
  file_size BIGINT NOT NULL DEFAULT 0, -- Bytes
  file_type TEXT NOT NULL DEFAULT 'application/pdf',
  downloads_count INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  fts TSVECTOR GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'B')
  ) STORED,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. API Clients Table (Growth / Multi-app tiering)
CREATE TABLE public.api_clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  api_key_hash TEXT NOT NULL UNIQUE,
  tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'pro', 'enterprise')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Download Events Table (Analytics)
CREATE TABLE public.download_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  paper_id UUID NOT NULL REFERENCES public.papers(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.api_clients(id) ON DELETE SET NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Indexes for Query Performance & Full-Text Search
CREATE INDEX idx_papers_subject_year ON public.papers(subject_id, year DESC);
CREATE INDEX idx_papers_level ON public.papers(level_id);
CREATE INDEX idx_papers_is_active ON public.papers(is_active);
CREATE INDEX idx_papers_fts ON public.papers USING GIN(fts);
CREATE INDEX idx_subjects_level_active ON public.subjects(level_id, is_active);
CREATE INDEX idx_download_events_paper_id ON public.download_events(paper_id);
CREATE INDEX idx_api_clients_key_hash ON public.api_clients(api_key_hash);

-- 8. Row Level Security (RLS) Policies
ALTER TABLE public.educational_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.download_events ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "Public levels viewable by all" ON public.educational_levels FOR SELECT USING (true);
CREATE POLICY "Public subjects viewable by all" ON public.subjects FOR SELECT USING (true);
CREATE POLICY "Active papers viewable by all" ON public.papers FOR SELECT USING (is_active = true);

CREATE POLICY "Service role full access levels" ON public.educational_levels FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access subjects" ON public.subjects FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access papers" ON public.papers FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access api_clients" ON public.api_clients FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access download_events" ON public.download_events FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 9. Storage Bucket Configuration (Supabase Storage)
INSERT INTO storage.buckets (id, name, public)
VALUES ('past-papers', 'past-papers', false)
ON CONFLICT (id) DO NOTHING;

-- 10. Seed Data
DO $$
DECLARE
  ol_id UUID;
  al_id UUID;
  uni_id UUID;
  math_ol_id UUID;
  eng_ol_id UUID;
  phys_al_id UUID;
  chem_al_id UUID;
  cs_uni_id UUID;
BEGIN
  -- Seed Educational Levels safely
  INSERT INTO public.educational_levels (code, name, sort_order)
  VALUES 
    ('O/L', 'Ordinary Level (GCE O-Level)', 1),
    ('A/L', 'Advanced Level (GCE A-Level)', 2),
    ('UNIVERSITY', 'University Undergraduate Studies', 3)
  ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, sort_order = EXCLUDED.sort_order;

  -- Query individual level UUIDs
  SELECT id INTO ol_id FROM public.educational_levels WHERE code = 'O/L';
  SELECT id INTO al_id FROM public.educational_levels WHERE code = 'A/L';
  SELECT id INTO uni_id FROM public.educational_levels WHERE code = 'UNIVERSITY';

  -- Seed Subjects
  IF ol_id IS NOT NULL THEN
    INSERT INTO public.subjects (level_id, name, code, is_active)
    VALUES
      (ol_id, 'Mathematics', 'MATH-OL', true),
      (ol_id, 'English Language', 'ENG-OL', true),
      (ol_id, 'Physics', 'PHYS-OL', true)
    ON CONFLICT (level_id, code) DO NOTHING;
  END IF;

  IF al_id IS NOT NULL THEN
    INSERT INTO public.subjects (level_id, name, code, is_active)
    VALUES
      (al_id, 'Physics', 'PHYS-AL', true),
      (al_id, 'Chemistry', 'CHEM-AL', true),
      (al_id, 'Pure Mathematics', 'PMATH-AL', true)
    ON CONFLICT (level_id, code) DO NOTHING;
  END IF;

  IF uni_id IS NOT NULL THEN
    INSERT INTO public.subjects (level_id, name, code, is_active)
    VALUES
      (uni_id, 'Data Structures & Algorithms', 'CS-201', true),
      (uni_id, 'Database Management Systems', 'CS-302', true)
    ON CONFLICT (level_id, code) DO NOTHING;
  END IF;

  -- Get Subject IDs
  SELECT id INTO math_ol_id FROM public.subjects WHERE code = 'MATH-OL';
  SELECT id INTO eng_ol_id FROM public.subjects WHERE code = 'ENG-OL';
  SELECT id INTO phys_al_id FROM public.subjects WHERE code = 'PHYS-AL';
  SELECT id INTO chem_al_id FROM public.subjects WHERE code = 'CHEM-AL';
  SELECT id INTO cs_uni_id FROM public.subjects WHERE code = 'CS-201';

  -- Seed Past Papers
  IF math_ol_id IS NOT NULL AND ol_id IS NOT NULL THEN
    INSERT INTO public.papers (subject_id, level_id, title, year, exam_session, description, file_path, file_size, file_type, downloads_count, is_active)
    VALUES
      (math_ol_id, ol_id, 'GCE O-Level Mathematics Paper 1', 2023, 'June', 'Official GCE Ordinary Level Mathematics Paper 1 with detailed solution key.', 'ol/math/2023_june_paper1.pdf', 2450000, 'application/pdf', 124, true),
      (math_ol_id, ol_id, 'GCE O-Level Mathematics Paper 2', 2023, 'June', 'Official GCE Ordinary Level Mathematics Paper 2 comprehensive problem solving.', 'ol/math/2023_june_paper2.pdf', 3120000, 'application/pdf', 98, true),
      (math_ol_id, ol_id, 'GCE O-Level Mathematics Paper 1', 2022, 'November', 'November session past paper for GCE O-Level Mathematics.', 'ol/math/2022_nov_paper1.pdf', 2180000, 'application/pdf', 210, true)
    ON CONFLICT DO NOTHING;
  END IF;

  IF phys_al_id IS NOT NULL AND al_id IS NOT NULL THEN
    INSERT INTO public.papers (subject_id, level_id, title, year, exam_session, description, file_path, file_size, file_type, downloads_count, is_active)
    VALUES
      (phys_al_id, al_id, 'GCE A-Level Physics Paper 1 (MCQ & Structured)', 2023, 'June', 'Advanced Level Physics Paper 1 covering Mechanics and Electromagnetism.', 'al/physics/2023_june_paper1.pdf', 4150000, 'application/pdf', 342, true),
      (phys_al_id, al_id, 'GCE A-Level Physics Paper 2 (Essay & Practical)', 2023, 'June', 'Advanced Level Physics Paper 2 with experimental analysis.', 'al/physics/2023_june_paper2.pdf', 3890000, 'application/pdf', 280, true)
    ON CONFLICT DO NOTHING;
  END IF;

  IF cs_uni_id IS NOT NULL AND uni_id IS NOT NULL THEN
    INSERT INTO public.papers (subject_id, level_id, title, year, exam_session, description, file_path, file_size, file_type, downloads_count, is_active)
    VALUES
      (cs_uni_id, uni_id, 'CS-201 Data Structures Midterm Exam', 2023, 'First Semester', 'University midterm paper covering trees, graphs, sorting, and Big-O analysis.', 'uni/cs/cs201_2023_midterm.pdf', 1850000, 'application/pdf', 65, true)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Seed Sample API Client (SHA-256 hash of 'ticha_demo_key_12345')
  INSERT INTO public.api_clients (name, api_key_hash, tier, is_active)
  VALUES
    ('Demo Partner App', '8f89e4ec3057e937d2fa955f26dbdf33b5c7774e1d6832db4abefcbb19ad3724', 'pro', true)
  ON CONFLICT (api_key_hash) DO NOTHING;

END $$;
