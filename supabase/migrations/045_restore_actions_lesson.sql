-- Restore the beginner Daily Actions lesson and its 10 vocabulary rows.
-- Safe to run repeatedly: existing rows with the same id or concept_code are skipped.

INSERT INTO public.ai_lessons (
  id,
  user_id,
  image_url,
  ai_caption,
  title,
  description,
  title_ko,
  title_en,
  description_ko,
  description_en
)
SELECT
  'c0000000-0000-0000-0000-000000000005'::uuid,
  NULL,
  'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8',
  'Actions',
  'Lesson 5: Actions',
  'Daily Actions',
  '기초 일상 행동',
  'Beginner Daily Actions',
  '기초 일상 행동 10선',
  'Daily Actions'
WHERE NOT EXISTS (
  SELECT 1 FROM public.ai_lessons
  WHERE id = 'c0000000-0000-0000-0000-000000000005'::uuid
);

INSERT INTO public.study_vocabularies (
  id,
  lesson_id,
  concept_code,
  category,
  difficulty_level,
  word_en,
  word_ko,
  word_tl,
  example_en,
  example_ko,
  example_tl,
  phonetic_en,
  phonetic_ko,
  phonetic_tl
)
SELECT
  restored.id,
  'c0000000-0000-0000-0000-000000000005'::uuid,
  restored.concept_code,
  'actions',
  'beginner',
  restored.concept_code,
  restored.word_ko,
  restored.word_tl,
  restored.example_en,
  restored.example_ko,
  restored.example_tl,
  restored.phonetic_en,
  restored.phonetic_ko,
  restored.phonetic_tl
FROM (
  VALUES
    ('a0000000-0000-0000-0000-000000000001'::uuid, 'eat',   '먹다', 'kumain',   'Let''s eat together.',       '같이 먹자.',                 'Kumain tayo nang sabay.',              '[iːt]',   '[먹다]',   '[ku-main]'),
    ('a0000000-0000-0000-0000-000000000002'::uuid, 'drink', '마시다', 'uminom',   'Drink fresh water.',         '신선한 물을 마셔요.',         'Uminom ng sariwang tubig.',            '[drɪŋk]', '[마시다]', '[u-mi-nom]'),
    ('a0000000-0000-0000-0000-000000000003'::uuid, 'sleep', '자다', 'matulog',   'Sleep early tonight.',       '오늘 밤은 일찍 자요.',         'Matulog ka nang maaga.',               '[sliːp]',  '[자다]',   '[ma-tu-log]'),
    ('a0000000-0000-0000-0000-000000000006'::uuid, 'run',   '달리다', 'tumakbo',  'He runs fast.',              '그는 빠르게 달려요.',         'Mabilis siyang tumakbo.',              '[rʌn]',   '[달리다]', '[tu-mak-bo]'),
    ('a0000000-0000-0000-0000-000000000007'::uuid, 'walk',  '걷다', 'maglakad',  'I walk in the park.',        '나는 공원에서 걸어요.',       'Naglalakad ako sa parke.',             '[wɔːk]',  '[걷다]',   '[mag-la-kad]'),
    ('a0000000-0000-0000-0000-000000000010'::uuid, 'read',  '읽다', 'magbasa',   'I read a book.',             '나는 책을 읽어요.',           'Nagbabasa ako ng libro.',              '[riːd]',  '[읽다]',   '[mag-ba-sa]'),
    ('a0000000-0000-0000-0000-000000000050'::uuid, 'sit',   '앉다', 'umupo',     'Please sit down.',            '앉으세요.',                  'Umupo ka muna.',                       '[sɪt]',   '[앉다]',   '[u-mu-po]'),
    ('a0000000-0000-0000-0000-000000000051'::uuid, 'stand', '서다', 'tumatayo',  'Stand up straight.',          '똑바로 서세요.',              'Tumayo ka nang diretso.',              '[stænd]', '[서다]',   '[tu-ma-ta-yo]'),
    ('a0000000-0000-0000-0000-000000000052'::uuid, 'write', '쓰다', 'magsulat',  'Write a letter to me.',       '나에게 편지를 써줘요.',        'Magsulat ka ng liham para sa akin.',   '[raɪt]',  '[쓰다]',   '[mag-su-lat]'),
    ('a0000000-0000-0000-0000-000000000053'::uuid, 'play',  '놀다 / 경기를 하다', 'maglaro', 'Children play happily.', '아이들이 행복하게 놀고 있어요.', 'Naglalaro ang mga bata nang masaya.', '[pleɪ]', '[놀다]', '[mag-la-ro]')
) AS restored(
  id,
  concept_code,
  word_ko,
  word_tl,
  example_en,
  example_ko,
  example_tl,
  phonetic_en,
  phonetic_ko,
  phonetic_tl
)
WHERE NOT EXISTS (
  SELECT 1
  FROM public.study_vocabularies existing
  WHERE existing.id = restored.id
     OR LOWER(existing.concept_code) = LOWER(restored.concept_code)
);

-- Reconnect every restored/existing action word to the Daily Actions lesson.
UPDATE public.study_vocabularies
SET lesson_id = 'c0000000-0000-0000-0000-000000000005'::uuid,
    category = 'actions',
    difficulty_level = 'beginner'
WHERE LOWER(concept_code) IN ('eat', 'drink', 'walk', 'run', 'sit', 'stand', 'sleep', 'read', 'write', 'play');

NOTIFY pgrst, 'reload schema';
