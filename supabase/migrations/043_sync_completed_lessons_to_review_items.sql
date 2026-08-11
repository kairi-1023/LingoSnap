-- ============================================================
-- Migration 043: Sync Completed Lessons to ai_review_items
-- Automatically populates ai_review_items for all completed lessons / vocabularies
-- ============================================================

INSERT INTO public.ai_review_items (
  id,
  user_id,
  vocabulary_id,
  srs_stage,
  next_review_at,
  last_reviewed_at,
  correct_count,
  wrong_count,
  created_at
)
SELECT
  gen_random_uuid(),
  v.user_id,
  v.vocabulary_id,
  1,
  now() + interval '1 day',
  now(),
  1,
  0,
  now()
FROM (
  SELECT DISTINCT
    l.user_id,
    sv.id AS vocabulary_id
  FROM public.ai_lessons l
  JOIN public.study_vocabularies sv ON sv.lesson_id = l.id OR (l.title_ko LIKE '%' || sv.category || '%')
  WHERE l.completed_at IS NOT NULL AND l.user_id IS NOT NULL
) v
ON CONFLICT (user_id, vocabulary_id) DO NOTHING;

-- Guaranteed sync for guest/demo user testing if user_id is null in lessons
INSERT INTO public.ai_review_items (
  id,
  user_id,
  vocabulary_id,
  srs_stage,
  next_review_at,
  last_reviewed_at,
  correct_count,
  wrong_count,
  created_at
)
SELECT
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000'::uuid,
  sv.id,
  1,
  now(),
  now(),
  1,
  0,
  now()
FROM public.study_vocabularies sv
WHERE sv.lesson_id = 'c0000000-0000-0000-0000-000000000002' OR sv.category = 'family'
ON CONFLICT DO NOTHING;

NOTIFY pgrst, 'reload schema';
