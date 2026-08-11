-- Migration: 07_diary_corrections_and_reactions.sql
-- 1. Diary Corrections Table
CREATE TABLE IF NOT EXISTS public.diary_corrections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    diary_id UUID NOT NULL REFERENCES public.diaries(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    original_text TEXT NOT NULL,
    corrected_text TEXT NOT NULL,
    comment TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Diary Reactions Table
CREATE TABLE IF NOT EXISTS public.diary_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    diary_id UUID NOT NULL REFERENCES public.diaries(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    emoji VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_diary_user_emoji UNIQUE (diary_id, user_id, emoji)
);

-- Enable RLS
ALTER TABLE public.diary_corrections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diary_reactions ENABLE ROW LEVEL SECURITY;

-- Helper RLS policy for couple members
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'diary_corrections' AND policyname = 'Allow couple members on corrections'
  ) THEN
    CREATE POLICY "Allow couple members on corrections" ON public.diary_corrections
      FOR ALL TO authenticated USING (
        EXISTS (
          SELECT 1 FROM public.diaries d 
          WHERE d.id = diary_id 
            AND (
              EXISTS (
                SELECT 1 FROM public.couples c 
                WHERE c.id = d.couple_id AND (c.user1_id = auth.uid() OR c.user2_id = auth.uid())
              )
            )
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'diary_reactions' AND policyname = 'Allow couple members on reactions'
  ) THEN
    CREATE POLICY "Allow couple members on reactions" ON public.diary_reactions
      FOR ALL TO authenticated USING (
        EXISTS (
          SELECT 1 FROM public.diaries d 
          WHERE d.id = diary_id 
            AND (
              EXISTS (
                SELECT 1 FROM public.couples c 
                WHERE c.id = d.couple_id AND (c.user1_id = auth.uid() OR c.user2_id = auth.uid())
              )
            )
        )
      );
  END IF;
END $$;
