-- Migration: 11_trim_study_vocabularies_6_languages.sql
-- Description: Trims study_vocabularies table to support the 6 primary app languages (ko, en, tl, ja, zh, es)
-- Removes unused language columns (vi, fr, de, th, id, ru) for ultra-clean schema.

-- 1. Optional: Truncate existing data (Clear all old 12-language rows)
TRUNCATE TABLE public.study_vocabularies;

-- 2. Drop unused language word columns
ALTER TABLE public.study_vocabularies
  DROP COLUMN IF EXISTS word_vi,
  DROP COLUMN IF EXISTS word_fr,
  DROP COLUMN IF EXISTS word_de,
  DROP COLUMN IF EXISTS word_th,
  DROP COLUMN IF EXISTS word_id,
  DROP COLUMN IF EXISTS word_ru;

-- 3. Drop unused language phonetic columns
ALTER TABLE public.study_vocabularies
  DROP COLUMN IF EXISTS phonetic_vi;

-- 4. Drop unused language example columns
ALTER TABLE public.study_vocabularies
  DROP COLUMN IF EXISTS example_vi,
  DROP COLUMN IF EXISTS example_fr,
  DROP COLUMN IF EXISTS example_de,
  DROP COLUMN IF EXISTS example_th,
  DROP COLUMN IF EXISTS example_id,
  DROP COLUMN IF EXISTS example_ru;
