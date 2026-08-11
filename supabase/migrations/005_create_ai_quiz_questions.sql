-- ============================================================
-- Migration: 005_create_ai_quiz_questions.sql
-- Description: Creates public.ai_quiz_questions table to store individual
--              quiz questions (Image->Word, Word->Image, Cloze Sentence).
-- Reversible & Safe: Uses CREATE TABLE IF NOT EXISTS.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.ai_quiz_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID NOT NULL REFERENCES public.ai_quizzes(id) ON DELETE CASCADE,
    question_type TEXT NOT NULL CONSTRAINT check_question_type CHECK (
        question_type IN (
            'IMAGE_TO_WORD', 'WORD_TO_IMAGE', 'SENTENCE_COMPLETION',
            'image_to_word', 'word_to_image', 'cloze_sentence'
        )
    ),
    question_text TEXT NULL,
    question_data JSONB NULL,
    options JSONB NULL,
    correct_answer TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table Comments
COMMENT ON TABLE public.ai_quiz_questions IS 'Individual quiz questions belonging to a quiz session';
COMMENT ON COLUMN public.ai_quiz_questions.id IS 'Unique identifier for the quiz question';
COMMENT ON COLUMN public.ai_quiz_questions.quiz_id IS 'Foreign key referencing public.ai_quizzes(id)';
COMMENT ON COLUMN public.ai_quiz_questions.question_type IS 'Type of quiz question (IMAGE_TO_WORD, WORD_TO_IMAGE, SENTENCE_COMPLETION)';
COMMENT ON COLUMN public.ai_quiz_questions.question_text IS 'Displayed prompt or question text';
COMMENT ON COLUMN public.ai_quiz_questions.question_data IS 'JSON payload containing images or prompt parameters';
COMMENT ON COLUMN public.ai_quiz_questions.options IS 'JSON array of multiple choice options';
COMMENT ON COLUMN public.ai_quiz_questions.correct_answer IS 'Correct answer text or key';
COMMENT ON COLUMN public.ai_quiz_questions.created_at IS 'Timestamp when the question was created';
