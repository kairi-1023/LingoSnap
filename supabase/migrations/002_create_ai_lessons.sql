-- ============================================================
-- Migration: 002_create_ai_lessons.sql
-- Description: Creates public.ai_lessons table to store visual learning
--              sessions. Supports global template lessons (user_id IS NULL)
--              and user-customized lessons.
-- Reversible & Safe: Uses CREATE TABLE IF NOT EXISTS.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.ai_lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NULL,
    image_url TEXT NULL,
    ai_caption TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ NULL
);

-- Table Comments
COMMENT ON TABLE public.ai_lessons IS 'Stores contextual visual learning sessions and lesson metadata';
COMMENT ON COLUMN public.ai_lessons.id IS 'Unique identifier for the lesson';
COMMENT ON COLUMN public.ai_lessons.user_id IS 'Owner user ID; NULL indicates system-provided global lesson';
COMMENT ON COLUMN public.ai_lessons.title IS 'Title of the lesson (e.g. Daily Actions, Dining, Travel)';
COMMENT ON COLUMN public.ai_lessons.description IS 'Detailed description of the lesson theme';
COMMENT ON COLUMN public.ai_lessons.image_url IS 'Primary situation image URL representing the lesson theme';
COMMENT ON COLUMN public.ai_lessons.ai_caption IS 'AI-generated contextual explanation or description';
COMMENT ON COLUMN public.ai_lessons.created_at IS 'Timestamp when the lesson was created';
COMMENT ON COLUMN public.ai_lessons.completed_at IS 'Timestamp when the lesson was completed by the user';
