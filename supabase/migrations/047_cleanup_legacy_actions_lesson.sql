-- Keep the canonical Lesson 5 and remove the duplicate legacy lesson only
-- when it has no vocabulary rows attached.
UPDATE public.ai_lessons
SET
  title_ko = 'Lesson 5: 기본 행동',
  title_en = 'Lesson 5: Actions',
  description_ko = '기본 행동 10선',
  description_en = 'Daily Actions'
WHERE id = 'c0000000-0000-0000-0000-000000000005'::uuid;

DELETE FROM public.ai_lessons AS legacy
WHERE legacy.id = '11111111-1111-1111-1111-111111111111'::uuid
  AND NOT EXISTS (
    SELECT 1
    FROM public.study_vocabularies vocabulary
    WHERE vocabulary.lesson_id = legacy.id
  );
