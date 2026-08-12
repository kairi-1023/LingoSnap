-- Keep the single displayed beginner actions lesson title consistent.
UPDATE public.ai_lessons
SET
  title_ko = 'Lesson 5: 기본 행동',
  title_en = 'Lesson 5: Actions',
  description_ko = '기본 행동 10선',
  description_en = 'Daily Actions'
WHERE id = 'c0000000-0000-0000-0000-000000000005'::uuid;
