-- ============================================================
-- Migration: 004_create_ai_quizzes.sql
-- Description: Creates public.ai_quizzes table to store quiz session
--              attempts generated for lessons by users.
-- Reversible & Safe: Uses CREATE TABLE IF NOT EXISTS.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.ai_quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID NOT NULL REFERENCES public.ai_lessons(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    score INT NOT NULL DEFAULT 0,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table Comments
COMMENT ON TABLE public.ai_quizzes IS 'Quiz sessions linked to specific lessons and users';
COMMENT ON COLUMN public.ai_quizzes.id IS 'Unique identifier for the quiz session';
COMMENT ON COLUMN public.ai_quizzes.lesson_id IS 'Foreign key referencing public.ai_lessons(id)';
COMMENT ON COLUMN public.ai_quizzes.user_id IS 'Foreign key referencing public.users(id)';
COMMENT ON COLUMN public.ai_quizzes.score IS 'Total score achieved in the quiz session';
COMMENT ON COLUMN public.ai_quizzes.completed IS 'Flag indicating if the quiz session has been finished';
COMMENT ON COLUMN public.ai_quizzes.created_at IS 'Timestamp when the quiz session was created';
