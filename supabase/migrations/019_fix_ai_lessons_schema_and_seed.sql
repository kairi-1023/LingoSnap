-- ============================================================
-- Together Lingo Migration 019: Fix ai_lessons Schema & Enable RLS
-- Based on real db-current.csv schema
-- ============================================================

-- 1. Ensure title, description, completed_at exist and user_id is NULLABLE on public.ai_lessons
ALTER TABLE public.ai_lessons
    ADD COLUMN IF NOT EXISTS title VARCHAR(100) DEFAULT 'Beginner Lesson',
    ADD COLUMN IF NOT EXISTS description TEXT,
    ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;

ALTER TABLE public.ai_lessons
    ALTER COLUMN user_id DROP NOT NULL;

-- 2. Ensure optional columns exist on ai_lesson_vocabulary
ALTER TABLE public.ai_lesson_vocabulary
    ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 0,
    ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid();

-- 3. Enable Row Level Security (RLS) on public.ai_lessons & public.ai_lesson_vocabulary
ALTER TABLE public.ai_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_lesson_vocabulary ENABLE ROW LEVEL SECURITY;

-- 4. Public Read RLS Policies
DROP POLICY IF EXISTS "Users can view own or template lessons" ON public.ai_lessons;
CREATE POLICY "Users can view own or template lessons" ON public.ai_lessons
    FOR SELECT USING (user_id IS NULL OR auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view lesson vocabulary mappings" ON public.ai_lesson_vocabulary;
CREATE POLICY "Users can view lesson vocabulary mappings" ON public.ai_lesson_vocabulary
    FOR SELECT USING (TRUE);

-- 5. Seed First Lesson ("Beginner Daily Actions")
INSERT INTO public.ai_lessons (
  id,
  user_id,
  title,
  description,
  image_url,
  ai_caption
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  NULL,
  'Beginner Daily Actions',
  'Learn basic daily action verbs through visual situations.',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
  'A collection of everyday action words presented through real-world situation photos.'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url;

-- 6. Seed 10 Lesson Vocabulary Mappings (Using lesson_id, vocabulary_id)
INSERT INTO public.ai_lesson_vocabulary (
  lesson_id,
  vocabulary_id,
  display_order
) VALUES
  ('11111111-1111-1111-1111-111111111111', 'a0000000-0000-0000-0000-000000000001', 1),
  ('11111111-1111-1111-1111-111111111111', 'a0000000-0000-0000-0000-000000000002', 2),
  ('11111111-1111-1111-1111-111111111111', 'a0000000-0000-0000-0000-000000000003', 3),
  ('11111111-1111-1111-1111-111111111111', 'a0000000-0000-0000-0000-000000000004', 4),
  ('11111111-1111-1111-1111-111111111111', 'a0000000-0000-0000-0000-000000000005', 5),
  ('11111111-1111-1111-1111-111111111111', 'a0000000-0000-0000-0000-000000000006', 6),
  ('11111111-1111-1111-1111-111111111111', 'a0000000-0000-0000-0000-000000000007', 7),
  ('11111111-1111-1111-1111-111111111111', 'a0000000-0000-0000-0000-000000000008', 8),
  ('11111111-1111-1111-1111-111111111111', 'a0000000-0000-0000-0000-000000000009', 9),
  ('11111111-1111-1111-1111-111111111111', 'a0000000-0000-0000-0000-000000000010', 10)
ON CONFLICT (lesson_id, vocabulary_id) DO NOTHING;
