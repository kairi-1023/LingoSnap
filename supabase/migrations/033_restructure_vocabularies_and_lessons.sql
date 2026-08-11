-- Migration 033: Drop foreign table study_vocabularies and recreate as a regular internal PostgreSQL table with 1:N relationship with ai_lessons

-- 1. Drop existing Foreign Table / Table and old objects
DROP FOREIGN TABLE IF EXISTS public.study_vocabularies CASCADE;
DROP TABLE IF EXISTS public.study_vocabularies CASCADE;
DROP TABLE IF EXISTS public.ai_lesson_vocabulary CASCADE;
DROP FUNCTION IF EXISTS public.get_lesson_vocabularies(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.get_lesson_vocabularies(TEXT) CASCADE;

-- 2. Create regular internal PostgreSQL table study_vocabularies
CREATE TABLE public.study_vocabularies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES public.ai_lessons(id) ON DELETE SET NULL,
  concept_code VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL DEFAULT 'daily',
  difficulty_level VARCHAR(10) NOT NULL DEFAULT 'A1',
  display_order INT DEFAULT 0,
  
  -- Multilingual word vocabularies
  word_en TEXT,
  word_ko TEXT,
  word_tl TEXT,
  word_th TEXT,
  word_vi TEXT,
  word_ja TEXT,

  -- Multilingual example sentences
  example_en TEXT,
  example_ko TEXT,
  example_tl TEXT,
  example_th TEXT,
  example_vi TEXT,
  example_ja TEXT,

  -- Multilingual phonetics
  phonetic_en TEXT,
  phonetic_ko TEXT,
  phonetic_tl TEXT,
  phonetic_th TEXT,
  phonetic_vi TEXT,
  phonetic_ja TEXT,

  -- Media URLs (Storage / Direct CDN)
  image_url TEXT,
  image_source VARCHAR(50) DEFAULT 'manual',
  image_prompt TEXT,
  tts_audio_url TEXT,

  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT study_vocabularies_concept_code_key UNIQUE (concept_code)
);

-- 3. Indexes for fast querying
CREATE INDEX idx_study_vocabularies_lesson_id ON public.study_vocabularies(lesson_id);
CREATE INDEX idx_study_vocabularies_category ON public.study_vocabularies(category);

-- 4. Enable RLS and grant permissions
ALTER TABLE public.study_vocabularies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public study_vocabularies read access" ON public.study_vocabularies;
CREATE POLICY "Public study_vocabularies read access"
  ON public.study_vocabularies FOR SELECT
  TO authenticated, anon
  USING (true);

DROP POLICY IF EXISTS "Public ai_lessons read access" ON public.ai_lessons;
CREATE POLICY "Public ai_lessons read access"
  ON public.ai_lessons FOR SELECT
  TO authenticated, anon
  USING (true);
