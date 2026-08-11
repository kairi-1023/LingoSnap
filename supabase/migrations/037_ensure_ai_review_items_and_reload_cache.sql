-- ============================================================
-- Migration: 037_ensure_ai_review_items_and_reload_cache.sql
-- Description: Ensures public.ai_review_items table exists with correct schema 
--              and reloads PostgREST schema cache.
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

-- RLS Enable
ALTER TABLE public.ai_review_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow users full access to own review items" ON public.ai_review_items;
CREATE POLICY "Allow users full access to own review items"
ON public.ai_review_items FOR ALL
USING (auth.uid() = user_id OR user_id IS NULL)
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- PostgREST Schema Cache Reload
NOTIFY pgrst, 'reload schema';
