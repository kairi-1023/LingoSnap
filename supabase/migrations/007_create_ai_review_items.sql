-- ============================================================
-- Migration: 007_create_ai_review_items.sql
-- Description: Creates public.ai_review_items table to store Spaced
--              Repetition System (SRS) review schedules per vocabulary item.
-- Reversible & Safe: Uses CREATE TABLE IF NOT EXISTS.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.ai_review_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    vocabulary_id UUID NOT NULL REFERENCES public.study_vocabularies(id) ON DELETE CASCADE,
    srs_stage INT NOT NULL DEFAULT 1,
    next_review_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '1 day'),
    last_reviewed_at TIMESTAMPTZ NULL DEFAULT NOW(),
    correct_count INT NOT NULL DEFAULT 0,
    wrong_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT ai_review_items_user_vocab_unique UNIQUE (user_id, vocabulary_id)
);

-- Table Comments
COMMENT ON TABLE public.ai_review_items IS 'Spaced Repetition System (SRS) review items and repetition stages';
COMMENT ON COLUMN public.ai_review_items.id IS 'Unique identifier for the review item';
COMMENT ON COLUMN public.ai_review_items.user_id IS 'Foreign key referencing public.users(id)';
COMMENT ON COLUMN public.ai_review_items.vocabulary_id IS 'Foreign key referencing public.study_vocabularies(id)';
COMMENT ON COLUMN public.ai_review_items.srs_stage IS 'Current SRS interval stage (e.g. 1=1d, 2=3d, 3=7d, 4=14d, 5=30d)';
COMMENT ON COLUMN public.ai_review_items.next_review_at IS 'Scheduled timestamp for the next SRS review session';
COMMENT ON COLUMN public.ai_review_items.last_reviewed_at IS 'Timestamp when the vocabulary item was last reviewed';
COMMENT ON COLUMN public.ai_review_items.correct_count IS 'Cumulative number of correct answers for this word';
COMMENT ON COLUMN public.ai_review_items.wrong_count IS 'Cumulative number of incorrect answers for this word';
COMMENT ON COLUMN public.ai_review_items.created_at IS 'Timestamp when the SRS review item was initialized';
