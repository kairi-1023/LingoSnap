-- ============================================================
-- Migration 041: Drop study_vocabularies.display_order Column
-- Removes static display_order column for simpler DB schema design
-- ============================================================

ALTER TABLE public.study_vocabularies DROP COLUMN IF EXISTS display_order;

NOTIFY pgrst, 'reload schema';
