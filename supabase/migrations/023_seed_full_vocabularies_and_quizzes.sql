-- ============================================================
-- Migration 023: Safe Universal Idempotent Seed
-- (Uses WHERE NOT EXISTS instead of ON CONFLICT for Foreign Table compatibility)
-- ============================================================

-- 1. Grant SELECT & ALL privileges to all Supabase API roles
GRANT ALL ON public.study_vocabularies TO anon, authenticated, service_role, postgres;
GRANT ALL ON public.ai_lessons TO anon, authenticated, service_role, postgres;
GRANT ALL ON public.ai_lesson_vocabulary TO anon, authenticated, service_role, postgres;
GRANT ALL ON public.ai_quizzes TO anon, authenticated, service_role, postgres;
GRANT ALL ON public.ai_quiz_questions TO anon, authenticated, service_role, postgres;

-- 2. Insert 10 Vocabularies into public.study_vocabularies (WHERE NOT EXISTS)
INSERT INTO public.study_vocabularies (
  id, concept_code, category, difficulty_level, word_en, word_ko, example_en, example_ko, phonetic_en
)
SELECT 'a0000000-0000-0000-0000-000000000001', 'eat', 'daily_actions', 'beginner', 'eat', '먹다', 'I eat an apple every morning.', '나는 매일 아침 사과를 먹는다.', '[iːt]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE id = 'a0000000-0000-0000-0000-000000000001');

INSERT INTO public.study_vocabularies (
  id, concept_code, category, difficulty_level, word_en, word_ko, example_en, example_ko, phonetic_en
)
SELECT 'a0000000-0000-0000-0000-000000000002', 'drink', 'daily_actions', 'beginner', 'drink', '마시다', 'She drinks fresh water after running.', '그녀는 달리기를 한 후 시원한 물을 마신다.', '[drɪŋk]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE id = 'a0000000-0000-0000-0000-000000000002');

INSERT INTO public.study_vocabularies (
  id, concept_code, category, difficulty_level, word_en, word_ko, example_en, example_ko, phonetic_en
)
SELECT 'a0000000-0000-0000-0000-000000000003', 'sleep', 'daily_actions', 'beginner', 'sleep', '자다', 'I sleep eight hours every night.', '나는 매일 밤 8시간을 자다.', '[sliːp]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE id = 'a0000000-0000-0000-0000-000000000003');

INSERT INTO public.study_vocabularies (
  id, concept_code, category, difficulty_level, word_en, word_ko, example_en, example_ko, phonetic_en
)
SELECT 'a0000000-0000-0000-0000-000000000004', 'cook', 'food', 'beginner', 'cook', '요리하다', 'He cooks dinner for his family.', '그는 가족을 위해 저녁을 요리한다.', '[kʊk]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE id = 'a0000000-0000-0000-0000-000000000004');

INSERT INTO public.study_vocabularies (
  id, concept_code, category, difficulty_level, word_en, word_ko, example_en, example_ko, phonetic_en
)
SELECT 'a0000000-0000-0000-0000-000000000005', 'bake', 'food', 'beginner', 'bake', '구우다', 'We bake fresh bread together.', '우리는 함께 갓 구운 빵을 굽는다.', '[beɪk]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE id = 'a0000000-0000-0000-0000-000000000005');

INSERT INTO public.study_vocabularies (
  id, concept_code, category, difficulty_level, word_en, word_ko, example_en, example_ko, phonetic_en
)
SELECT 'a0000000-0000-0000-0000-000000000006', 'run', 'movement', 'beginner', 'run', '달리다', 'I run in the park every morning.', '나는 매일 아침 공원에서 달리다.', '[rʌn]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE id = 'a0000000-0000-0000-0000-000000000006');

INSERT INTO public.study_vocabularies (
  id, concept_code, category, difficulty_level, word_en, word_ko, example_en, example_ko, phonetic_en
)
SELECT 'a0000000-0000-0000-0000-000000000007', 'walk', 'movement', 'beginner', 'walk', '걷다', 'They walk on the beach at sunset.', '그들은 노을 질 때 해변을 걷는다.', '[wɔːk]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE id = 'a0000000-0000-0000-0000-000000000007');

INSERT INTO public.study_vocabularies (
  id, concept_code, category, difficulty_level, word_en, word_ko, example_en, example_ko, phonetic_en
)
SELECT 'a0000000-0000-0000-0000-000000000008', 'jump', 'movement', 'beginner', 'jump', '뛰다', 'The girl jumps high with joy.', '소녀가 기쁨에 차 높이 뛰어오른다.', '[dʒʌmp]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE id = 'a0000000-0000-0000-0000-000000000008');

INSERT INTO public.study_vocabularies (
  id, concept_code, category, difficulty_level, word_en, word_ko, example_en, example_ko, phonetic_en
)
SELECT 'a0000000-0000-0000-0000-000000000009', 'clean', 'home_activities', 'beginner', 'clean', '청소하다', 'I clean my room on weekends.', '나는 주말에 내 방을 청소한다.', '[kliːn]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE id = 'a0000000-0000-0000-0000-000000000009');

INSERT INTO public.study_vocabularies (
  id, concept_code, category, difficulty_level, word_en, word_ko, example_en, example_ko, phonetic_en
)
SELECT 'a0000000-0000-0000-0000-000000000010', 'read', 'home_activities', 'beginner', 'read', '읽다', 'I read an interesting book in the library.', '나는 도서관에서 흥미로운 책을 읽는다.', '[riːd]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE id = 'a0000000-0000-0000-0000-000000000010');

-- 3. Insert 1 Lesson into public.ai_lessons (WHERE NOT EXISTS)
INSERT INTO public.ai_lessons (
  id, user_id, title, description, image_url, ai_caption
)
SELECT
  '11111111-1111-1111-1111-111111111111',
  NULL,
  'Beginner Daily Actions',
  'Learn basic daily action verbs through visual situations.',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
  'A collection of everyday action words presented through real-world situation photos.'
WHERE NOT EXISTS (SELECT 1 FROM public.ai_lessons WHERE id = '11111111-1111-1111-1111-111111111111');

-- 4. Connect 10 Vocabularies to Lesson in public.ai_lesson_vocabulary (WHERE NOT EXISTS)
INSERT INTO public.ai_lesson_vocabulary (lesson_id, vocabulary_id, display_order)
SELECT '11111111-1111-1111-1111-111111111111', 'a0000000-0000-0000-0000-000000000001', 1
WHERE NOT EXISTS (SELECT 1 FROM public.ai_lesson_vocabulary WHERE lesson_id = '11111111-1111-1111-1111-111111111111' AND vocabulary_id = 'a0000000-0000-0000-0000-000000000001');

INSERT INTO public.ai_lesson_vocabulary (lesson_id, vocabulary_id, display_order)
SELECT '11111111-1111-1111-1111-111111111111', 'a0000000-0000-0000-0000-000000000002', 2
WHERE NOT EXISTS (SELECT 1 FROM public.ai_lesson_vocabulary WHERE lesson_id = '11111111-1111-1111-1111-111111111111' AND vocabulary_id = 'a0000000-0000-0000-0000-000000000002');

INSERT INTO public.ai_lesson_vocabulary (lesson_id, vocabulary_id, display_order)
SELECT '11111111-1111-1111-1111-111111111111', 'a0000000-0000-0000-0000-000000000003', 3
WHERE NOT EXISTS (SELECT 1 FROM public.ai_lesson_vocabulary WHERE lesson_id = '11111111-1111-1111-1111-111111111111' AND vocabulary_id = 'a0000000-0000-0000-0000-000000000003');

INSERT INTO public.ai_lesson_vocabulary (lesson_id, vocabulary_id, display_order)
SELECT '11111111-1111-1111-1111-111111111111', 'a0000000-0000-0000-0000-000000000004', 4
WHERE NOT EXISTS (SELECT 1 FROM public.ai_lesson_vocabulary WHERE lesson_id = '11111111-1111-1111-1111-111111111111' AND vocabulary_id = 'a0000000-0000-0000-0000-000000000004');

INSERT INTO public.ai_lesson_vocabulary (lesson_id, vocabulary_id, display_order)
SELECT '11111111-1111-1111-1111-111111111111', 'a0000000-0000-0000-0000-000000000005', 5
WHERE NOT EXISTS (SELECT 1 FROM public.ai_lesson_vocabulary WHERE lesson_id = '11111111-1111-1111-1111-111111111111' AND vocabulary_id = 'a0000000-0000-0000-0000-000000000005');

INSERT INTO public.ai_lesson_vocabulary (lesson_id, vocabulary_id, display_order)
SELECT '11111111-1111-1111-1111-111111111111', 'a0000000-0000-0000-0000-000000000006', 6
WHERE NOT EXISTS (SELECT 1 FROM public.ai_lesson_vocabulary WHERE lesson_id = '11111111-1111-1111-1111-111111111111' AND vocabulary_id = 'a0000000-0000-0000-0000-000000000006');

INSERT INTO public.ai_lesson_vocabulary (lesson_id, vocabulary_id, display_order)
SELECT '11111111-1111-1111-1111-111111111111', 'a0000000-0000-0000-0000-000000000007', 7
WHERE NOT EXISTS (SELECT 1 FROM public.ai_lesson_vocabulary WHERE lesson_id = '11111111-1111-1111-1111-111111111111' AND vocabulary_id = 'a0000000-0000-0000-0000-000000000007');

INSERT INTO public.ai_lesson_vocabulary (lesson_id, vocabulary_id, display_order)
SELECT '11111111-1111-1111-1111-111111111111', 'a0000000-0000-0000-0000-000000000008', 8
WHERE NOT EXISTS (SELECT 1 FROM public.ai_lesson_vocabulary WHERE lesson_id = '11111111-1111-1111-1111-111111111111' AND vocabulary_id = 'a0000000-0000-0000-0000-000000000008');

INSERT INTO public.ai_lesson_vocabulary (lesson_id, vocabulary_id, display_order)
SELECT '11111111-1111-1111-1111-111111111111', 'a0000000-0000-0000-0000-000000000009', 9
WHERE NOT EXISTS (SELECT 1 FROM public.ai_lesson_vocabulary WHERE lesson_id = '11111111-1111-1111-1111-111111111111' AND vocabulary_id = 'a0000000-0000-0000-0000-000000000009');

INSERT INTO public.ai_lesson_vocabulary (lesson_id, vocabulary_id, display_order)
SELECT '11111111-1111-1111-1111-111111111111', 'a0000000-0000-0000-0000-000000000010', 10
WHERE NOT EXISTS (SELECT 1 FROM public.ai_lesson_vocabulary WHERE lesson_id = '11111111-1111-1111-1111-111111111111' AND vocabulary_id = 'a0000000-0000-0000-0000-000000000010');

-- 5. Insert 1 Quiz into public.ai_quizzes (WHERE NOT EXISTS)
INSERT INTO public.ai_quizzes (
  id, lesson_id, score, completed
)
SELECT '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 0, false
WHERE NOT EXISTS (SELECT 1 FROM public.ai_quizzes WHERE id = '22222222-2222-2222-2222-222222222222');

-- 6. Insert 30 Quiz Questions into public.ai_quiz_questions (WHERE NOT EXISTS)
INSERT INTO public.ai_quiz_questions (
  id, quiz_id, question_type, question_text, question_data, options, correct_answer
)
SELECT 'q0000000-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', 'IMAGE_TO_WORD', '사진 속 인물의 행동에 알맞은 단어를 선택하세요.', '{"orderIndex": 1, "vocabularyId": "a0000000-0000-0000-0000-000000000001", "imageUrl": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}'::jsonb, '["eat", "run", "sleep", "cook"]'::jsonb, 'eat'
WHERE NOT EXISTS (SELECT 1 FROM public.ai_quiz_questions WHERE id = 'q0000000-0000-0000-0000-000000000001');

INSERT INTO public.ai_quiz_questions (
  id, quiz_id, question_type, question_text, question_data, options, correct_answer
)
SELECT 'q0000000-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', 'IMAGE_TO_WORD', '사진 속 인물의 행동에 알맞은 단어를 선택하세요.', '{"orderIndex": 2, "vocabularyId": "a0000000-0000-0000-0000-000000000002", "imageUrl": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd"}'::jsonb, '["drink", "walk", "bake", "read"]'::jsonb, 'drink'
WHERE NOT EXISTS (SELECT 1 FROM public.ai_quiz_questions WHERE id = 'q0000000-0000-0000-0000-000000000002');

INSERT INTO public.ai_quiz_questions (
  id, quiz_id, question_type, question_text, question_data, options, correct_answer
)
SELECT 'q0000000-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222', 'IMAGE_TO_WORD', '사진 속 인물의 행동에 알맞은 단어를 선택하세요.', '{"orderIndex": 3, "vocabularyId": "a0000000-0000-0000-0000-000000000003", "imageUrl": "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55"}'::jsonb, '["sleep", "jump", "clean", "eat"]'::jsonb, 'sleep'
WHERE NOT EXISTS (SELECT 1 FROM public.ai_quiz_questions WHERE id = 'q0000000-0000-0000-0000-000000000003');

INSERT INTO public.ai_quiz_questions (
  id, quiz_id, question_type, question_text, question_data, options, correct_answer
)
SELECT 'q0000000-0000-0000-0000-000000000004', '22222222-2222-2222-2222-222222222222', 'IMAGE_TO_WORD', '사진 속 인물의 행동에 알맞은 단어를 선택하세요.', '{"orderIndex": 4, "vocabularyId": "a0000000-0000-0000-0000-000000000004", "imageUrl": "https://images.unsplash.com/photo-1556910103-1c02745aae4d"}'::jsonb, '["cook", "bake", "run", "drink"]'::jsonb, 'cook'
WHERE NOT EXISTS (SELECT 1 FROM public.ai_quiz_questions WHERE id = 'q0000000-0000-0000-0000-000000000004');

INSERT INTO public.ai_quiz_questions (
  id, quiz_id, question_type, question_text, question_data, options, correct_answer
)
SELECT 'q0000000-0000-0000-0000-000000000005', '22222222-2222-2222-2222-222222222222', 'IMAGE_TO_WORD', '사진 속 인물의 행동에 알맞은 단어를 선택하세요.', '{"orderIndex": 5, "vocabularyId": "a0000000-0000-0000-0000-000000000005", "imageUrl": "https://images.unsplash.com/photo-1509440159596-0249088772ff"}'::jsonb, '["bake", "cook", "read", "clean"]'::jsonb, 'bake'
WHERE NOT EXISTS (SELECT 1 FROM public.ai_quiz_questions WHERE id = 'q0000000-0000-0000-0000-000000000005');

INSERT INTO public.ai_quiz_questions (
  id, quiz_id, question_type, question_text, question_data, options, correct_answer
)
SELECT 'q0000000-0000-0000-0000-000000000006', '22222222-2222-2222-2222-222222222222', 'IMAGE_TO_WORD', '사진 속 인물의 행동에 알맞은 단어를 선택하세요.', '{"orderIndex": 6, "vocabularyId": "a0000000-0000-0000-0000-000000000006", "imageUrl": "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8"}'::jsonb, '["run", "walk", "jump", "sleep"]'::jsonb, 'run'
WHERE NOT EXISTS (SELECT 1 FROM public.ai_quiz_questions WHERE id = 'q0000000-0000-0000-0000-000000000006');

INSERT INTO public.ai_quiz_questions (
  id, quiz_id, question_type, question_text, question_data, options, correct_answer
)
SELECT 'q0000000-0000-0000-0000-000000000007', '22222222-2222-2222-2222-222222222222', 'IMAGE_TO_WORD', '사진 속 인물의 행동에 알맞은 단어를 선택하세요.', '{"orderIndex": 7, "vocabularyId": "a0000000-0000-0000-0000-000000000007", "imageUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"}'::jsonb, '["walk", "run", "clean", "drink"]'::jsonb, 'walk'
WHERE NOT EXISTS (SELECT 1 FROM public.ai_quiz_questions WHERE id = 'q0000000-0000-0000-0000-000000000007');

INSERT INTO public.ai_quiz_questions (
  id, quiz_id, question_type, question_text, question_data, options, correct_answer
)
SELECT 'q0000000-0000-0000-0000-000000000008', '22222222-2222-2222-2222-222222222222', 'IMAGE_TO_WORD', '사진 속 인물의 행동에 알맞은 단어를 선택하세요.', '{"orderIndex": 8, "vocabularyId": "a0000000-0000-0000-0000-000000000008", "imageUrl": "https://images.unsplash.com/photo-1517649763962-0c623266ddc0"}'::jsonb, '["jump", "run", "eat", "bake"]'::jsonb, 'jump'
WHERE NOT EXISTS (SELECT 1 FROM public.ai_quiz_questions WHERE id = 'q0000000-0000-0000-0000-000000000008');

INSERT INTO public.ai_quiz_questions (
  id, quiz_id, question_type, question_text, question_data, options, correct_answer
)
SELECT 'q0000000-0000-0000-0000-000000000009', '22222222-2222-2222-2222-222222222222', 'IMAGE_TO_WORD', '사진 속 인물의 행동에 알맞은 단어를 선택하세요.', '{"orderIndex": 9, "vocabularyId": "a0000000-0000-0000-0000-000000000009", "imageUrl": "https://images.unsplash.com/photo-1581578731548-c64695cc6952"}'::jsonb, '["clean", "cook", "read", "walk"]'::jsonb, 'clean'
WHERE NOT EXISTS (SELECT 1 FROM public.ai_quiz_questions WHERE id = 'q0000000-0000-0000-0000-000000000009');

INSERT INTO public.ai_quiz_questions (
  id, quiz_id, question_type, question_text, question_data, options, correct_answer
)
SELECT 'q0000000-0000-0000-0000-000000000010', '22222222-2222-2222-2222-222222222222', 'IMAGE_TO_WORD', '사진 속 인물의 행동에 알맞은 단어를 선택하세요.', '{"orderIndex": 10, "vocabularyId": "a0000000-0000-0000-0000-000000000010", "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6"}'::jsonb, '["read", "clean", "sleep", "eat"]'::jsonb, 'read'
WHERE NOT EXISTS (SELECT 1 FROM public.ai_quiz_questions WHERE id = 'q0000000-0000-0000-0000-000000000010');

INSERT INTO public.ai_quiz_questions (
  id, quiz_id, question_type, question_text, question_data, options, correct_answer
)
SELECT 'q0000000-0000-0000-0000-000000000011', '22222222-2222-2222-2222-222222222222', 'WORD_TO_IMAGE', 'eat', '{"orderIndex": 11, "vocabularyId": "a0000000-0000-0000-0000-000000000001", "word": "eat"}'::jsonb, '["https://images.unsplash.com/photo-1546069901-ba9599a7e63c", "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd", "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55", "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8"]'::jsonb, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'
WHERE NOT EXISTS (SELECT 1 FROM public.ai_quiz_questions WHERE id = 'q0000000-0000-0000-0000-000000000011');

INSERT INTO public.ai_quiz_questions (
  id, quiz_id, question_type, question_text, question_data, options, correct_answer
)
SELECT 'q0000000-0000-0000-0000-000000000021', '22222222-2222-2222-2222-222222222222', 'SENTENCE_COMPLETION', 'I ___ an apple every morning.', '{"orderIndex": 21, "vocabularyId": "a0000000-0000-0000-0000-000000000001"}'::jsonb, '["eat", "drink", "sleep", "run"]'::jsonb, 'eat'
WHERE NOT EXISTS (SELECT 1 FROM public.ai_quiz_questions WHERE id = 'q0000000-0000-0000-0000-000000000021');

-- 7. Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
