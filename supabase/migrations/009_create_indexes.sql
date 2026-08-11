-- ============================================================
-- Migration: 009_create_indexes.sql
-- Description: Creates performance optimization indexes for vocabulary lookups,
--              user lesson fetching, quiz question querying, and SRS retrieval.
-- Reversible & Safe: Uses CREATE INDEX IF NOT EXISTS.
-- ============================================================

-- 1. Vocabulary Indexes
CREATE INDEX IF NOT EXISTS idx_study_vocabularies_word_en ON public.study_vocabularies(word_en);
CREATE INDEX IF NOT EXISTS idx_study_vocabularies_concept_code ON public.study_vocabularies(concept_code);
CREATE INDEX IF NOT EXISTS idx_study_vocabularies_cat_diff ON public.study_vocabularies(category, difficulty_level);

-- 2. AI Lessons Indexes
CREATE INDEX IF NOT EXISTS idx_ai_lessons_user_id ON public.ai_lessons(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_lessons_created_at ON public.ai_lessons(created_at DESC);

-- 3. Lesson Vocabulary Junction Indexes
CREATE INDEX IF NOT EXISTS idx_ai_lesson_vocab_lesson_id ON public.ai_lesson_vocabulary(lesson_id);
CREATE INDEX IF NOT EXISTS idx_ai_lesson_vocab_vocabulary_id ON public.ai_lesson_vocabulary(vocabulary_id);

-- 4. Quiz Indexes
CREATE INDEX IF NOT EXISTS idx_ai_quizzes_lesson_user ON public.ai_quizzes(lesson_id, user_id);
CREATE INDEX IF NOT EXISTS idx_ai_quizzes_user_id ON public.ai_quizzes(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_quiz_questions_quiz_id ON public.ai_quiz_questions(quiz_id);

-- 5. User Progress Indexes
CREATE INDEX IF NOT EXISTS idx_ai_user_progress_user_id ON public.ai_user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_user_progress_user_lesson ON public.ai_user_progress(user_id, lesson_id);

-- 6. SRS Review Items Indexes
CREATE INDEX IF NOT EXISTS idx_ai_review_items_user_next ON public.ai_review_items(user_id, next_review_at);
CREATE INDEX IF NOT EXISTS idx_ai_review_items_user_vocab ON public.ai_review_items(user_id, vocabulary_id);

-- Index Comments
COMMENT ON INDEX idx_study_vocabularies_word_en IS 'Accelerates text-based vocabulary lookups by English word';
COMMENT ON INDEX idx_ai_lessons_user_id IS 'Accelerates retrieving lessons belonging to a specific user';
COMMENT ON INDEX idx_ai_review_items_user_next IS 'Optimizes SRS review queue queries filtering due items by user and date';
