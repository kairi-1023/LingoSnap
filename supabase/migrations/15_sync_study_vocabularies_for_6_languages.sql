-- Migration: 15_sync_study_vocabularies_for_6_languages.sql
-- Description: Synchronizes study_vocabularies table schema to support the final 6 MVP languages (en, ko, tl, th, vi, ja)

ALTER TABLE public.study_vocabularies
  ADD COLUMN IF NOT EXISTS difficulty_level VARCHAR(10) DEFAULT 'A1',
  ADD COLUMN IF NOT EXISTS word_en TEXT,
  ADD COLUMN IF NOT EXISTS word_ko TEXT,
  ADD COLUMN IF NOT EXISTS word_tl TEXT,
  ADD COLUMN IF NOT EXISTS word_th TEXT,
  ADD COLUMN IF NOT EXISTS word_vi TEXT,
  ADD COLUMN IF NOT EXISTS word_ja TEXT,
  ADD COLUMN IF NOT EXISTS example_en TEXT,
  ADD COLUMN IF NOT EXISTS example_ko TEXT,
  ADD COLUMN IF NOT EXISTS example_tl TEXT,
  ADD COLUMN IF NOT EXISTS example_th TEXT,
  ADD COLUMN IF NOT EXISTS example_vi TEXT,
  ADD COLUMN IF NOT EXISTS example_ja TEXT,
  ADD COLUMN IF NOT EXISTS phonetic_th TEXT,
  ADD COLUMN IF NOT EXISTS phonetic_ja TEXT,
  ADD COLUMN IF NOT EXISTS phonetic_tl TEXT,
  ADD COLUMN IF NOT EXISTS phonetic_vi TEXT,
  ADD COLUMN IF NOT EXISTS phonetic_ko TEXT;

-- Drop obsolete non-MVP languages if present
ALTER TABLE public.study_vocabularies
  DROP COLUMN IF EXISTS word_zh,
  DROP COLUMN IF EXISTS word_es,
  DROP COLUMN IF EXISTS word_fr,
  DROP COLUMN IF EXISTS word_de,
  DROP COLUMN IF EXISTS word_id,
  DROP COLUMN IF EXISTS word_ru,
  DROP COLUMN IF EXISTS example_zh,
  DROP COLUMN IF EXISTS example_es,
  DROP COLUMN IF EXISTS example_fr,
  DROP COLUMN IF EXISTS example_de,
  DROP COLUMN IF EXISTS example_id,
  DROP COLUMN IF EXISTS example_ru,
  DROP COLUMN IF EXISTS phonetic_zh,
  DROP COLUMN IF EXISTS phonetic_es;
