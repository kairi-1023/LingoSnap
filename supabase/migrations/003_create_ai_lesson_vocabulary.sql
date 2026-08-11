-- ============================================================
-- Migration: 003_create_ai_lesson_vocabulary.sql
-- Description: Creates public.ai_lesson_vocabulary junction table
--              linking ai_lessons with study_vocabularies. Includes
--              display ordering and optional JSONB bounding_box.
-- Reversible & Safe: Uses CREATE TABLE IF NOT EXISTS.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.ai_lesson_vocabulary (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID NOT NULL REFERENCES public.ai_lessons(id) ON DELETE CASCADE,
    vocabulary_id UUID NOT NULL REFERENCES public.study_vocabularies(id) ON DELETE CASCADE,
    display_order INT NOT NULL DEFAULT 0,
    bounding_box JSONB NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT ai_lesson_vocab_unique UNIQUE (lesson_id, vocabulary_id)
);

-- Table Comments
COMMENT ON TABLE public.ai_lesson_vocabulary IS 'Junction table mapping vocabulary items to specific AI lessons';
COMMENT ON COLUMN public.ai_lesson_vocabulary.lesson_id IS 'Foreign key referencing public.ai_lessons(id)';
COMMENT ON COLUMN public.ai_lesson_vocabulary.vocabulary_id IS 'Foreign key referencing public.study_vocabularies(id)';
COMMENT ON COLUMN public.ai_lesson_vocabulary.display_order IS 'Sequence order of vocabulary display within the lesson';
COMMENT ON COLUMN public.ai_lesson_vocabulary.bounding_box IS 'Optional JSON object {x, y, width, height} for visual object hotspots';
COMMENT ON COLUMN public.ai_lesson_vocabulary.created_at IS 'Timestamp when the mapping was created';
