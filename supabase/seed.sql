-- ==============================================================================
-- LingoSnap MVP Seed Content SQL Migration File
-- ==============================================================================
-- Purpose:
--   Populate the initial database with:
--   1. 10 Beginner Daily Action Vocabularies in public.study_vocabularies
--   2. 1 MVP Lesson ("Beginner Daily Actions") in public.ai_lessons
--   3. 10 Lesson Vocabulary mappings in public.ai_lesson_vocabulary
--   4. 1 MVP Quiz ("Beginner Daily Actions Quiz") in public.ai_quizzes
--   5. 30 MVP Quiz Questions (IMAGE_TO_WORD, WORD_TO_IMAGE, SENTENCE_COMPLETION) in public.ai_quiz_questions
-- Safety:
--   Uses ON CONFLICT DO NOTHING for idempotent execution.
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. Insert 10 Beginner Daily Action Vocabularies into public.study_vocabularies
-- ------------------------------------------------------------------------------

INSERT INTO public.study_vocabularies (
  id,
  concept_code,
  category,
  difficulty_level,
  word_en,
  word_ko,
  example_en,
  example_ko,
  phonetic_en,
  image_url,
  image_source
) VALUES
  (
    'a0000000-0000-0000-0000-000000000001',
    'eat',
    'daily_actions',
    'beginner',
    'eat',
    '먹다',
    'I eat an apple every morning.',
    '나는 매일 아침 사과를 먹는다.',
    '[iːt]',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
    'external'
  ),
  (
    'a0000000-0000-0000-0000-000000000002',
    'drink',
    'daily_actions',
    'beginner',
    'drink',
    '마시다',
    'She drinks fresh water after running.',
    '그녀는 달리기를 한 후 시원한 물을 마신다.',
    '[drɪŋk]',
    'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd',
    'external'
  ),
  (
    'a0000000-0000-0000-0000-000000000003',
    'sleep',
    'daily_actions',
    'beginner',
    'sleep',
    '자다',
    'I sleep eight hours every night.',
    '나는 매일 밤 8시간을 자다.',
    '[sliːp]',
    'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55',
    'external'
  ),
  (
    'a0000000-0000-0000-0000-000000000004',
    'cook',
    'food',
    'beginner',
    'cook',
    '요리하다',
    'He cooks dinner for his family.',
    '그는 가족을 위해 저녁을 요리한다.',
    '[kʊk]',
    'https://images.unsplash.com/photo-1556910103-1c02745aae4d',
    'external'
  ),
  (
    'a0000000-0000-0000-0000-000000000005',
    'bake',
    'food',
    'beginner',
    'bake',
    '구우다',
    'We bake fresh bread together.',
    '우리는 함께 갓 구운 빵을 굽는다.',
    '[beɪk]',
    'https://images.unsplash.com/photo-1509440159596-0249088772ff',
    'external'
  ),
  (
    'a0000000-0000-0000-0000-000000000006',
    'run',
    'movement',
    'beginner',
    'run',
    '달리다',
    'I run in the park every morning.',
    '나는 매일 아침 공원에서 달리다.',
    '[rʌn]',
    'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8',
    'external'
  ),
  (
    'a0000000-0000-0000-0000-000000000007',
    'walk',
    'movement',
    'beginner',
    'walk',
    '걷다',
    'They walk on the beach at sunset.',
    '그들은 노을 질 때 해변을 걷는다.',
    '[wɔːk]',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
    'external'
  ),
  (
    'a0000000-0000-0000-0000-000000000008',
    'jump',
    'movement',
    'beginner',
    'jump',
    '뛰다',
    'The girl jumps high with joy.',
    '소녀가 기쁨에 차 높이 뛰어오른다.',
    '[dʒʌmp]',
    'https://images.unsplash.com/photo-1517649763962-0c623266ddc0',
    'external'
  ),
  (
    'a0000000-0000-0000-0000-000000000009',
    'clean',
    'home_activities',
    'beginner',
    'clean',
    '청소하다',
    'I clean my room on weekends.',
    '나는 주말에 내 방을 청소한다.',
    '[kliːn]',
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952',
    'external'
  ),
  (
    'a0000000-0000-0000-0000-000000000010',
    'read',
    'home_activities',
    'beginner',
    'read',
    '읽다',
    'I read an interesting book in the library.',
    '나는 도서관에서 흥미로운 책을 읽는다.',
    '[riːd]',
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6',
    'external'
  )
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 2. Insert 1 MVP Lesson into public.ai_lessons
-- ------------------------------------------------------------------------------

INSERT INTO public.ai_lessons (
  id,
  user_id,
  title,
  description,
  image_url,
  ai_caption
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  NULL, -- Global / Template Lesson accessible by all users
  'Beginner Daily Actions',
  'Learn basic daily action verbs through visual situations.',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
  'A collection of everyday action words presented through real-world situation photos.'
)
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 3. Connect 10 Vocabularies to Lesson in public.ai_lesson_vocabulary
-- ------------------------------------------------------------------------------

INSERT INTO public.ai_lesson_vocabulary (
  id,
  lesson_id,
  vocabulary_id,
  display_order
) VALUES
  ('b0000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'a0000000-0000-0000-0000-000000000001', 1),
  ('b0000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'a0000000-0000-0000-0000-000000000002', 2),
  ('b0000000-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'a0000000-0000-0000-0000-000000000003', 3),
  ('b0000000-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 'a0000000-0000-0000-0000-000000000004', 4),
  ('b0000000-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111', 'a0000000-0000-0000-0000-000000000005', 5),
  ('b0000000-0000-0000-0000-000000000006', '11111111-1111-1111-1111-111111111111', 'a0000000-0000-0000-0000-000000000006', 6),
  ('b0000000-0000-0000-0000-000000000007', '11111111-1111-1111-1111-111111111111', 'a0000000-0000-0000-0000-000000000007', 7),
  ('b0000000-0000-0000-0000-000000000008', '11111111-1111-1111-1111-111111111111', 'a0000000-0000-0000-0000-000000000008', 8),
  ('b0000000-0000-0000-0000-000000000009', '11111111-1111-1111-1111-111111111111', 'a0000000-0000-0000-0000-000000000009', 9),
  ('b0000000-0000-0000-0000-000000000010', '11111111-1111-1111-1111-111111111111', 'a0000000-0000-0000-0000-000000000010', 10)
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 4. Insert 1 MVP Quiz into public.ai_quizzes
-- ------------------------------------------------------------------------------

INSERT INTO public.ai_quizzes (
  id,
  lesson_id,
  user_id,
  score,
  completed
) VALUES (
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  '00000000-0000-0000-0000-000000000000', -- Template System User UUID
  0,
  false
)
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 5. Insert 30 MVP Quiz Questions into public.ai_quiz_questions
-- ------------------------------------------------------------------------------

INSERT INTO public.ai_quiz_questions (
  id,
  quiz_id,
  question_type,
  question_text,
  question_data,
  options,
  correct_answer
) VALUES
  -- Type 1: IMAGE_TO_WORD (Q1 ~ Q10)
  (
    'q0000000-0000-0000-0000-000000000001',
    '22222222-2222-2222-2222-222222222222',
    'IMAGE_TO_WORD',
    '사진 속 인물의 행동에 알맞은 단어를 선택하세요.',
    '{"orderIndex": 1, "vocabularyId": "a0000000-0000-0000-0000-000000000001", "imageUrl": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}'::jsonb,
    '["eat", "run", "sleep", "cook"]'::jsonb,
    'eat'
  ),
  (
    'q0000000-0000-0000-0000-000000000002',
    '22222222-2222-2222-2222-222222222222',
    'IMAGE_TO_WORD',
    '사진 속 인물의 행동에 알맞은 단어를 선택하세요.',
    '{"orderIndex": 2, "vocabularyId": "a0000000-0000-0000-0000-000000000002", "imageUrl": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd"}'::jsonb,
    '["drink", "walk", "bake", "read"]'::jsonb,
    'drink'
  ),
  (
    'q0000000-0000-0000-0000-000000000003',
    '22222222-2222-2222-2222-222222222222',
    'IMAGE_TO_WORD',
    '사진 속 인물의 행동에 알맞은 단어를 선택하세요.',
    '{"orderIndex": 3, "vocabularyId": "a0000000-0000-0000-0000-000000000003", "imageUrl": "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55"}'::jsonb,
    '["sleep", "jump", "clean", "eat"]'::jsonb,
    'sleep'
  ),
  (
    'q0000000-0000-0000-0000-000000000004',
    '22222222-2222-2222-2222-222222222222',
    'IMAGE_TO_WORD',
    '사진 속 인물의 행동에 알맞은 단어를 선택하세요.',
    '{"orderIndex": 4, "vocabularyId": "a0000000-0000-0000-0000-000000000004", "imageUrl": "https://images.unsplash.com/photo-1556910103-1c02745aae4d"}'::jsonb,
    '["cook", "bake", "run", "drink"]'::jsonb,
    'cook'
  ),
  (
    'q0000000-0000-0000-0000-000000000005',
    '22222222-2222-2222-2222-222222222222',
    'IMAGE_TO_WORD',
    '사진 속 인물의 행동에 알맞은 단어를 선택하세요.',
    '{"orderIndex": 5, "vocabularyId": "a0000000-0000-0000-0000-000000000005", "imageUrl": "https://images.unsplash.com/photo-1509440159596-0249088772ff"}'::jsonb,
    '["bake", "cook", "read", "clean"]'::jsonb,
    'bake'
  ),
  (
    'q0000000-0000-0000-0000-000000000006',
    '22222222-2222-2222-2222-222222222222',
    'IMAGE_TO_WORD',
    '사진 속 인물의 행동에 알맞은 단어를 선택하세요.',
    '{"orderIndex": 6, "vocabularyId": "a0000000-0000-0000-0000-000000000006", "imageUrl": "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8"}'::jsonb,
    '["run", "walk", "jump", "sleep"]'::jsonb,
    'run'
  ),
  (
    'q0000000-0000-0000-0000-000000000007',
    '22222222-2222-2222-2222-222222222222',
    'IMAGE_TO_WORD',
    '사진 속 인물의 행동에 알맞은 단어를 선택하세요.',
    '{"orderIndex": 7, "vocabularyId": "a0000000-0000-0000-0000-000000000007", "imageUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"}'::jsonb,
    '["walk", "run", "clean", "drink"]'::jsonb,
    'walk'
  ),
  (
    'q0000000-0000-0000-0000-000000000008',
    '22222222-2222-2222-2222-222222222222',
    'IMAGE_TO_WORD',
    '사진 속 인물의 행동에 알맞은 단어를 선택하세요.',
    '{"orderIndex": 8, "vocabularyId": "a0000000-0000-0000-0000-000000000008", "imageUrl": "https://images.unsplash.com/photo-1517649763962-0c623266ddc0"}'::jsonb,
    '["jump", "run", "eat", "bake"]'::jsonb,
    'jump'
  ),
  (
    'q0000000-0000-0000-0000-000000000009',
    '22222222-2222-2222-2222-222222222222',
    'IMAGE_TO_WORD',
    '사진 속 인물의 행동에 알맞은 단어를 선택하세요.',
    '{"orderIndex": 9, "vocabularyId": "a0000000-0000-0000-0000-000000000009", "imageUrl": "https://images.unsplash.com/photo-1581578731548-c64695cc6952"}'::jsonb,
    '["clean", "cook", "read", "walk"]'::jsonb,
    'clean'
  ),
  (
    'q0000000-0000-0000-0000-000000000010',
    '22222222-2222-2222-2222-222222222222',
    'IMAGE_TO_WORD',
    '사진 속 인물의 행동에 알맞은 단어를 선택하세요.',
    '{"orderIndex": 10, "vocabularyId": "a0000000-0000-0000-0000-000000000010", "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6"}'::jsonb,
    '["read", "clean", "sleep", "eat"]'::jsonb,
    'read'
  ),

  -- Type 2: WORD_TO_IMAGE (Q11 ~ Q20)
  (
    'q0000000-0000-0000-0000-000000000011',
    '22222222-2222-2222-2222-222222222222',
    'WORD_TO_IMAGE',
    'eat',
    '{"orderIndex": 11, "vocabularyId": "a0000000-0000-0000-0000-000000000001", "word": "eat"}'::jsonb,
    '["https://images.unsplash.com/photo-1546069901-ba9599a7e63c", "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd", "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55", "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8"]'::jsonb,
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'
  ),
  (
    'q0000000-0000-0000-0000-000000000012',
    '22222222-2222-2222-2222-222222222222',
    'WORD_TO_IMAGE',
    'drink',
    '{"orderIndex": 12, "vocabularyId": "a0000000-0000-0000-0000-000000000002", "word": "drink"}'::jsonb,
    '["https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd", "https://images.unsplash.com/photo-1546069901-ba9599a7e63c", "https://images.unsplash.com/photo-1556910103-1c02745aae4d", "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"]'::jsonb,
    'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd'
  ),
  (
    'q0000000-0000-0000-0000-000000000013',
    '22222222-2222-2222-2222-222222222222',
    'WORD_TO_IMAGE',
    'sleep',
    '{"orderIndex": 13, "vocabularyId": "a0000000-0000-0000-0000-000000000003", "word": "sleep"}'::jsonb,
    '["https://images.unsplash.com/photo-1541781774459-bb2af2f05b55", "https://images.unsplash.com/photo-1517649763962-0c623266ddc0", "https://images.unsplash.com/photo-1581578731548-c64695cc6952", "https://images.unsplash.com/photo-1497633762265-9d179a990aa6"]'::jsonb,
    'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55'
  ),
  (
    'q0000000-0000-0000-0000-000000000014',
    '22222222-2222-2222-2222-222222222222',
    'WORD_TO_IMAGE',
    'cook',
    '{"orderIndex": 14, "vocabularyId": "a0000000-0000-0000-0000-000000000004", "word": "cook"}'::jsonb,
    '["https://images.unsplash.com/photo-1556910103-1c02745aae4d", "https://images.unsplash.com/photo-1509440159596-0249088772ff", "https://images.unsplash.com/photo-1546069901-ba9599a7e63c", "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd"]'::jsonb,
    'https://images.unsplash.com/photo-1556910103-1c02745aae4d'
  ),
  (
    'q0000000-0000-0000-0000-000000000015',
    '22222222-2222-2222-2222-222222222222',
    'WORD_TO_IMAGE',
    'bake',
    '{"orderIndex": 15, "vocabularyId": "a0000000-0000-0000-0000-000000000005", "word": "bake"}'::jsonb,
    '["https://images.unsplash.com/photo-1509440159596-0249088772ff", "https://images.unsplash.com/photo-1556910103-1c02745aae4d", "https://images.unsplash.com/photo-1581578731548-c64695cc6952", "https://images.unsplash.com/photo-1497633762265-9d179a990aa6"]'::jsonb,
    'https://images.unsplash.com/photo-1509440159596-0249088772ff'
  ),
  (
    'q0000000-0000-0000-0000-000000000016',
    '22222222-2222-2222-2222-222222222222',
    'WORD_TO_IMAGE',
    'run',
    '{"orderIndex": 16, "vocabularyId": "a0000000-0000-0000-0000-000000000006", "word": "run"}'::jsonb,
    '["https://images.unsplash.com/photo-1476480862126-209bfaa8edc8", "https://images.unsplash.com/photo-1507525428034-b723cf961d3e", "https://images.unsplash.com/photo-1517649763962-0c623266ddc0", "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55"]'::jsonb,
    'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8'
  ),
  (
    'q0000000-0000-0000-0000-000000000017',
    '22222222-2222-2222-2222-222222222222',
    'WORD_TO_IMAGE',
    'walk',
    '{"orderIndex": 17, "vocabularyId": "a0000000-0000-0000-0000-000000000007", "word": "walk"}'::jsonb,
    '["https://images.unsplash.com/photo-1507525428034-b723cf961d3e", "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8", "https://images.unsplash.com/photo-1517649763962-0c623266ddc0", "https://images.unsplash.com/photo-1581578731548-c64695cc6952"]'::jsonb,
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e'
  ),
  (
    'q0000000-0000-0000-0000-000000000018',
    '22222222-2222-2222-2222-222222222222',
    'WORD_TO_IMAGE',
    'jump',
    '{"orderIndex": 18, "vocabularyId": "a0000000-0000-0000-0000-000000000008", "word": "jump"}'::jsonb,
    '["https://images.unsplash.com/photo-1517649763962-0c623266ddc0", "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8", "https://images.unsplash.com/photo-1507525428034-b723cf961d3e", "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"]'::jsonb,
    'https://images.unsplash.com/photo-1517649763962-0c623266ddc0'
  ),
  (
    'q0000000-0000-0000-0000-000000000019',
    '22222222-2222-2222-2222-222222222222',
    'WORD_TO_IMAGE',
    'clean',
    '{"orderIndex": 19, "vocabularyId": "a0000000-0000-0000-0000-000000000009", "word": "clean"}'::jsonb,
    '["https://images.unsplash.com/photo-1581578731548-c64695cc6952", "https://images.unsplash.com/photo-1497633762265-9d179a990aa6", "https://images.unsplash.com/photo-1556910103-1c02745aae4d", "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55"]'::jsonb,
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952'
  ),
  (
    'q0000000-0000-0000-0000-000000000020',
    '22222222-2222-2222-2222-222222222222',
    'WORD_TO_IMAGE',
    'read',
    '{"orderIndex": 20, "vocabularyId": "a0000000-0000-0000-0000-000000000010", "word": "read"}'::jsonb,
    '["https://images.unsplash.com/photo-1497633762265-9d179a990aa6", "https://images.unsplash.com/photo-1581578731548-c64695cc6952", "https://images.unsplash.com/photo-1509440159596-0249088772ff", "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd"]'::jsonb,
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6'
  ),

  -- Type 3: SENTENCE_COMPLETION (Q21 ~ Q30)
  (
    'q0000000-0000-0000-0000-000000000021',
    '22222222-2222-2222-2222-222222222222',
    'SENTENCE_COMPLETION',
    'I ___ an apple every morning.',
    '{"orderIndex": 21, "vocabularyId": "a0000000-0000-0000-0000-000000000001"}'::jsonb,
    '["eat", "drink", "sleep", "run"]'::jsonb,
    'eat'
  ),
  (
    'q0000000-0000-0000-0000-000000000022',
    '22222222-2222-2222-2222-222222222222',
    'SENTENCE_COMPLETION',
    'She ___s fresh water after running.',
    '{"orderIndex": 22, "vocabularyId": "a0000000-0000-0000-0000-000000000002"}'::jsonb,
    '["drink", "eat", "cook", "walk"]'::jsonb,
    'drink'
  ),
  (
    'q0000000-0000-0000-0000-000000000023',
    '22222222-2222-2222-2222-222222222222',
    'SENTENCE_COMPLETION',
    'I ___ eight hours every night.',
    '{"orderIndex": 23, "vocabularyId": "a0000000-0000-0000-0000-000000000003"}'::jsonb,
    '["sleep", "jump", "clean", "bake"]'::jsonb,
    'sleep'
  ),
  (
    'q0000000-0000-0000-0000-000000000024',
    '22222222-2222-2222-2222-222222222222',
    'SENTENCE_COMPLETION',
    'He ___s dinner for his family.',
    '{"orderIndex": 24, "vocabularyId": "a0000000-0000-0000-0000-000000000004"}'::jsonb,
    '["cook", "bake", "read", "run"]'::jsonb,
    'cook'
  ),
  (
    'q0000000-0000-0000-0000-000000000025',
    '22222222-2222-2222-2222-222222222222',
    'SENTENCE_COMPLETION',
    'We ___ fresh bread together.',
    '{"orderIndex": 25, "vocabularyId": "a0000000-0000-0000-0000-000000000005"}'::jsonb,
    '["bake", "cook", "clean", "walk"]'::jsonb,
    'bake'
  ),
  (
    'q0000000-0000-0000-0000-000000000026',
    '22222222-2222-2222-2222-222222222222',
    'SENTENCE_COMPLETION',
    'I ___ in the park every morning.',
    '{"orderIndex": 26, "vocabularyId": "a0000000-0000-0000-0000-000000000006"}'::jsonb,
    '["run", "walk", "jump", "sleep"]'::jsonb,
    'run'
  ),
  (
    'q0000000-0000-0000-0000-000000000027',
    '22222222-2222-2222-2222-222222222222',
    'SENTENCE_COMPLETION',
    'They ___ on the beach at sunset.',
    '{"orderIndex": 27, "vocabularyId": "a0000000-0000-0000-0000-000000000007"}'::jsonb,
    '["walk", "run", "clean", "drink"]'::jsonb,
    'walk'
  ),
  (
    'q0000000-0000-0000-0000-000000000028',
    '22222222-2222-2222-2222-222222222222',
    'SENTENCE_COMPLETION',
    'The girl ___s high with joy.',
    '{"orderIndex": 28, "vocabularyId": "a0000000-0000-0000-0000-000000000008"}'::jsonb,
    '["jump", "run", "eat", "read"]'::jsonb,
    'jump'
  ),
  (
    'q0000000-0000-0000-0000-000000000029',
    '22222222-2222-2222-2222-222222222222',
    'SENTENCE_COMPLETION',
    'I ___ my room on weekends.',
    '{"orderIndex": 29, "vocabularyId": "a0000000-0000-0000-0000-000000000009"}'::jsonb,
    '["clean", "cook", "read", "bake"]'::jsonb,
    'clean'
  ),
  (
    'q0000000-0000-0000-0000-000000000030',
    '22222222-2222-2222-2222-222222222222',
    'SENTENCE_COMPLETION',
    'I ___ an interesting book in the library.',
    '{"orderIndex": 30, "vocabularyId": "a0000000-0000-0000-0000-000000000010"}'::jsonb,
    '["read", "clean", "sleep", "eat"]'::jsonb,
    'read'
  )
ON CONFLICT (id) DO NOTHING;
