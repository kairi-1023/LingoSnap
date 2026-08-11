-- ============================================================
-- Migration 022: Grant & Seed 10 Vocabularies into Foreign Table study_vocabularies
-- Safely inserts using existing columns (excluding image_url)
-- ============================================================

-- 1. Grant SELECT & ALL privileges to all Supabase API roles
GRANT ALL ON public.study_vocabularies TO anon, authenticated, service_role, postgres;

-- 2. Insert 10 Beginner Daily Action Vocabularies into public.study_vocabularies
INSERT INTO public.study_vocabularies (
  id,
  concept_code,
  category,
  difficulty_level,
  word_en,
  word_ko,
  example_en,
  example_ko,
  phonetic_en
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
    '[iːt]'
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
    '[drɪŋk]'
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
    '[sliːp]'
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
    '[kʊk]'
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
    '[beɪk]'
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
    '[rʌn]'
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
    '[wɔːk]'
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
    '[dʒʌmp]'
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
    '[kliːn]'
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
    '[riːd]'
  );

-- 3. Notify PostgREST to reload schema
NOTIFY pgrst, 'reload schema';
