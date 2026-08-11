-- ============================================================
-- Migration: 010_create_rls_policies.sql
-- Description: Enables Row Level Security (RLS) on all newly created AI tables
--              and sets granular 1:1 user isolation access control policies.
-- Reversible & Safe: Uses DROP POLICY IF EXISTS before CREATE POLICY.
-- ============================================================

-- Enable Row Level Security (RLS) on AI tables
ALTER TABLE public.ai_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_lesson_vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_review_items ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------
-- 1. Policies for public.ai_lessons
-- ------------------------------------------------------------
-- Allow users to view system global template lessons (user_id IS NULL) or their own custom lessons
DROP POLICY IF EXISTS "Users can view own or template lessons" ON public.ai_lessons;
CREATE POLICY "Users can view own or template lessons" ON public.ai_lessons
    FOR SELECT USING (user_id IS NULL OR auth.uid() = user_id);

-- Allow users to create their own lessons
DROP POLICY IF EXISTS "Users can insert own lessons" ON public.ai_lessons;
CREATE POLICY "Users can insert own lessons" ON public.ai_lessons
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own lessons
DROP POLICY IF EXISTS "Users can update own lessons" ON public.ai_lessons;
CREATE POLICY "Users can update own lessons" ON public.ai_lessons
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own lessons
DROP POLICY IF EXISTS "Users can delete own lessons" ON public.ai_lessons;
CREATE POLICY "Users can delete own lessons" ON public.ai_lessons
    FOR DELETE USING (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 2. Policies for public.ai_lesson_vocabulary
-- ------------------------------------------------------------
-- Allow users to view vocabulary mappings for accessible lessons
DROP POLICY IF EXISTS "Users can view lesson vocabulary mappings" ON public.ai_lesson_vocabulary;
CREATE POLICY "Users can view lesson vocabulary mappings" ON public.ai_lesson_vocabulary
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.ai_lessons l
            WHERE l.id = ai_lesson_vocabulary.lesson_id
            AND (l.user_id IS NULL OR l.user_id = auth.uid())
        )
    );

-- Allow users to manage vocabulary mappings for their own lessons
DROP POLICY IF EXISTS "Users can manage own lesson vocabulary" ON public.ai_lesson_vocabulary;
CREATE POLICY "Users can manage own lesson vocabulary" ON public.ai_lesson_vocabulary
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.ai_lessons l
            WHERE l.id = ai_lesson_vocabulary.lesson_id
            AND l.user_id = auth.uid()
        )
    );

-- ------------------------------------------------------------
-- 3. Policies for public.ai_quizzes
-- ------------------------------------------------------------
-- Allow users to manage (view, insert, update, delete) their own quizzes
DROP POLICY IF EXISTS "Users can manage own quizzes" ON public.ai_quizzes;
CREATE POLICY "Users can manage own quizzes" ON public.ai_quizzes
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 4. Policies for public.ai_quiz_questions
-- ------------------------------------------------------------
-- Allow users to manage quiz questions belonging to their own quizzes
DROP POLICY IF EXISTS "Users can manage own quiz questions" ON public.ai_quiz_questions;
CREATE POLICY "Users can manage own quiz questions" ON public.ai_quiz_questions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.ai_quizzes q
            WHERE q.id = ai_quiz_questions.quiz_id
            AND q.user_id = auth.uid()
        )
    );

-- ------------------------------------------------------------
-- 5. Policies for public.ai_user_progress
-- ------------------------------------------------------------
-- Allow users to manage their own progress tracking records
DROP POLICY IF EXISTS "Users can manage own progress" ON public.ai_user_progress;
CREATE POLICY "Users can manage own progress" ON public.ai_user_progress
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 6. Policies for public.ai_review_items
-- ------------------------------------------------------------
-- Allow users to manage their own SRS review schedule items
DROP POLICY IF EXISTS "Users can manage own review items" ON public.ai_review_items;
CREATE POLICY "Users can manage own review items" ON public.ai_review_items
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
