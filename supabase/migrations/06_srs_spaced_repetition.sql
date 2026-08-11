-- Migration: 06_srs_spaced_repetition.sql
-- Expand user_studied_words with Spaced Repetition System (SRS) columns

ALTER TABLE public.user_studied_words 
  ADD COLUMN IF NOT EXISTS srs_stage INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS next_review_at TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '1 day',
  ADD COLUMN IF NOT EXISTS last_reviewed_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS review_count INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS wrong_count INT NOT NULL DEFAULT 0;

-- Create index for fast SRS review query
CREATE INDEX IF NOT EXISTS idx_user_studied_words_srs ON public.user_studied_words(user_id, next_review_at);

-- RLS Update Policy
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_studied_words' AND policyname = 'Users can update own studied words'
  ) THEN
    CREATE POLICY "Users can update own studied words"
    ON public.user_studied_words FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;
