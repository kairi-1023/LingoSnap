-- Migration 02: User Studied Words Tracking Table for Deduplication
-- Prevents already studied or viewed words from appearing repeatedly.

CREATE TABLE IF NOT EXISTS public.user_studied_words (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    concept_id UUID NOT NULL REFERENCES public.word_concepts(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT user_studied_words_user_concept_unique UNIQUE (user_id, concept_id)
);

-- Index for fast lookup & filtering
CREATE INDEX IF NOT EXISTS idx_user_studied_words_user_id ON public.user_studied_words(user_id);
CREATE INDEX IF NOT EXISTS idx_user_studied_words_concept_id ON public.user_studied_words(concept_id);

-- Enable RLS
ALTER TABLE public.user_studied_words ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only view their own studied words
CREATE POLICY "Users can view own studied words"
ON public.user_studied_words FOR SELECT
USING (auth.uid() = user_id);

-- RLS Policy: Users can insert their own studied words
CREATE POLICY "Users can insert own studied words"
ON public.user_studied_words FOR INSERT
WITH CHECK (auth.uid() = user_id);
