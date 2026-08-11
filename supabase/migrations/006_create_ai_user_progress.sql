-- ============================================================
-- Migration: 006_create_ai_user_progress.sql
-- Description: Creates public.ai_user_progress table to track user
--              lesson completions, streak, scores, and study timestamps.
-- Reversible & Safe: Uses CREATE TABLE IF NOT EXISTS.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.ai_user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES public.ai_lessons(id) ON DELETE CASCADE,
    completed_count INT NOT NULL DEFAULT 0,
    quiz_score INT NOT NULL DEFAULT 0,
    current_streak INT NOT NULL DEFAULT 0,
    last_studied_at TIMESTAMPTZ NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT ai_user_progress_user_lesson_unique UNIQUE (user_id, lesson_id)
);

-- Table Comments
COMMENT ON TABLE public.ai_user_progress IS 'Tracks user lesson study progress, streak, and performance metrics';
COMMENT ON COLUMN public.ai_user_progress.user_id IS 'Foreign key referencing public.users(id)';
COMMENT ON COLUMN public.ai_user_progress.lesson_id IS 'Foreign key referencing public.ai_lessons(id) (optional for global user summary)';
COMMENT ON COLUMN public.ai_user_progress.completed_count IS 'Number of times this lesson was completed by the user';
COMMENT ON COLUMN public.ai_user_progress.quiz_score IS 'Highest or recent quiz score for the lesson';
COMMENT ON COLUMN public.ai_user_progress.current_streak IS 'Active daily study streak count';
COMMENT ON COLUMN public.ai_user_progress.last_studied_at IS 'Timestamp of the user''s most recent study session';
COMMENT ON COLUMN public.ai_user_progress.updated_at IS 'Timestamp when progress record was last updated';
COMMENT ON COLUMN public.ai_user_progress.created_at IS 'Timestamp when progress record was created';
