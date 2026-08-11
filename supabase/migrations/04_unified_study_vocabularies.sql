-- Migration 04: Unified Multilingual Concept Vocabularies Table
-- Consolidates all supported languages into a single row per concept for 0.001s ultra-fast query performance.

CREATE TABLE IF NOT EXISTS public.study_vocabularies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  concept_code VARCHAR(100) UNIQUE NOT NULL,
  category VARCHAR(50) NOT NULL DEFAULT 'daily',
  
  -- Words across supported languages (12 Major Languages)
  word_ko TEXT, -- Korean
  word_en TEXT, -- English
  word_tl TEXT, -- Tagalog / Filipino
  word_ja TEXT, -- Japanese
  word_zh TEXT, -- Chinese
  word_vi TEXT, -- Vietnamese
  word_es TEXT, -- Spanish
  word_fr TEXT, -- French
  word_de TEXT, -- German
  word_th TEXT, -- Thai
  word_id TEXT, -- Indonesian
  word_ru TEXT, -- Russian

  -- Phonetics (Romanized Pronunciation Guides)
  phonetic_ko TEXT,
  phonetic_en TEXT,
  phonetic_tl TEXT,
  phonetic_ja TEXT,
  phonetic_zh TEXT,
  phonetic_vi TEXT,
  phonetic_es TEXT,

  -- Practical Everyday Example Sentences across supported languages
  example_ko TEXT,
  example_en TEXT,
  example_tl TEXT,
  example_ja TEXT,
  example_zh TEXT,
  example_vi TEXT,
  example_es TEXT,
  example_fr TEXT,
  example_de TEXT,
  example_th TEXT,
  example_id TEXT,
  example_ru TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS and Full Read/Write Policies for Seeding & Querying
ALTER TABLE public.study_vocabularies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read on study_vocabularies" ON public.study_vocabularies;
DROP POLICY IF EXISTS "Allow public all on study_vocabularies" ON public.study_vocabularies;
CREATE POLICY "Allow public all on study_vocabularies" ON public.study_vocabularies FOR ALL USING (true) WITH CHECK (true);
