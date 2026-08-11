-- Migration: 16_recreate_study_vocabularies_clean_schema.sql
-- Description: Recreates study_vocabularies table schema to 100% match generated_vocabularies.sql and MVP 6 languages

DROP TABLE IF EXISTS public.study_vocabularies CASCADE;

CREATE TABLE public.study_vocabularies (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  concept_code VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL DEFAULT 'daily',
  difficulty_level VARCHAR(10) NOT NULL DEFAULT 'A1',

  -- 6 Primary Target Languages Words (en, ko, tl, th, vi, ja)
  word_en TEXT NULL,
  word_ko TEXT NULL,
  word_tl TEXT NULL,
  word_th TEXT NULL,
  word_vi TEXT NULL,
  word_ja TEXT NULL,

  -- Conversational Example Sentences
  example_en TEXT NULL,
  example_ko TEXT NULL,
  example_tl TEXT NULL,
  example_th TEXT NULL,
  example_vi TEXT NULL,
  example_ja TEXT NULL,

  -- Phonetic Pronunciation Guides
  phonetic_en TEXT NULL,
  phonetic_ko TEXT NULL,
  phonetic_tl TEXT NULL,
  phonetic_th TEXT NULL,
  phonetic_vi TEXT NULL,
  phonetic_ja TEXT NULL,

  created_at TIMESTAMPTZ NULL DEFAULT NOW(),
  CONSTRAINT study_vocabularies_pkey PRIMARY KEY (id),
  CONSTRAINT study_vocabularies_concept_code_key UNIQUE (concept_code)
) TABLESPACE pg_default;

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_study_vocabularies_cat_level ON public.study_vocabularies USING btree (category, difficulty_level);
CREATE INDEX IF NOT EXISTS idx_study_vocabularies_concept ON public.study_vocabularies USING btree (concept_code);

-- Enable Row Level Security (RLS)
ALTER TABLE public.study_vocabularies ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public all on study_vocabularies" ON public.study_vocabularies;
CREATE POLICY "Allow public all on study_vocabularies" ON public.study_vocabularies FOR ALL USING (true) WITH CHECK (true);
