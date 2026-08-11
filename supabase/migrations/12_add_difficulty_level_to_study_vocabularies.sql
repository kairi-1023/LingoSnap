-- Migration: 12_add_difficulty_level_to_study_vocabularies.sql
-- Description: Adds difficulty_level column (CEFR standards: A1, A2, B1, B2, C1) to study_vocabularies table

ALTER TABLE public.study_vocabularies
  ADD COLUMN IF NOT EXISTS difficulty_level VARCHAR(10) DEFAULT 'A1';
