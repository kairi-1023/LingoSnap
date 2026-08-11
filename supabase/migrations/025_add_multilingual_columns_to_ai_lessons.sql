-- ============================================================
-- Migration 025: Clean Multilingual Columns & Short Captions
-- (Uses Valid Hexadecimal UUIDs c0000000-0000-0000-0000-000000000001 ~ 10)
-- ============================================================

-- 1. Add Multilingual Columns
ALTER TABLE public.ai_lessons
    ADD COLUMN IF NOT EXISTS title_ko VARCHAR(150),
    ADD COLUMN IF NOT EXISTS title_en VARCHAR(150),
    ADD COLUMN IF NOT EXISTS description_ko TEXT,
    ADD COLUMN IF NOT EXISTS description_en TEXT;

-- 2. Update MVP Seed Lesson (11111111-1111-1111-1111-111111111111)
UPDATE public.ai_lessons SET title_ko = '기초 일상 행동', title_en = 'Beginner Daily Actions', description_ko = '기본 행동 10선', description_en = 'Daily Actions' WHERE id = '11111111-1111-1111-1111-111111111111';

-- 3. Update 10 txt Lessons (c0000000-0000-0000-0000-000000000001 ~ 10)
UPDATE public.ai_lessons SET title_ko = 'Lesson 1: 인사와 나', title_en = 'Lesson 1: Greetings & Me', description_ko = '인사와 나 기초', description_en = 'Basic Greetings & Self' WHERE id = 'c0000000-0000-0000-0000-000000000001';

UPDATE public.ai_lessons SET title_ko = 'Lesson 2: 가족', title_en = 'Lesson 2: Family', description_ko = '가족 어휘', description_en = 'Family Words' WHERE id = 'c0000000-0000-0000-0000-000000000002';

UPDATE public.ai_lessons SET title_ko = 'Lesson 3: 집', title_en = 'Lesson 3: Home', description_ko = '집과 사물', description_en = 'Home & Objects' WHERE id = 'c0000000-0000-0000-0000-000000000003';

UPDATE public.ai_lessons SET title_ko = 'Lesson 4: 음식', title_en = 'Lesson 4: Food', description_ko = '음식 어휘', description_en = 'Food & Drinks' WHERE id = 'c0000000-0000-0000-0000-000000000004';

UPDATE public.ai_lessons SET title_ko = 'Lesson 5: 기본 행동', title_en = 'Lesson 5: Actions', description_ko = '기본 행동', description_en = 'Daily Actions' WHERE id = 'c0000000-0000-0000-0000-000000000005';

UPDATE public.ai_lessons SET title_ko = 'Lesson 6: 동물', title_en = 'Lesson 6: Animals', description_ko = '동물 이름', description_en = 'Animal Names' WHERE id = 'c0000000-0000-0000-0000-000000000006';

UPDATE public.ai_lessons SET title_ko = 'Lesson 7: 색깔', title_en = 'Lesson 7: Colors', description_ko = '기본 색깔', description_en = 'Basic Colors' WHERE id = 'c0000000-0000-0000-0000-000000000007';

UPDATE public.ai_lessons SET title_ko = 'Lesson 8: 장소', title_en = 'Lesson 8: Places', description_ko = '주변 장소', description_en = 'Common Places' WHERE id = 'c0000000-0000-0000-0000-000000000008';

UPDATE public.ai_lessons SET title_ko = 'Lesson 9: 여행', title_en = 'Lesson 9: Travel', description_ko = '여행 용품', description_en = 'Travel Essentials' WHERE id = 'c0000000-0000-0000-0000-000000000009';

UPDATE public.ai_lessons SET title_ko = 'Lesson 10: 감정과 상태', title_en = 'Lesson 10: Feelings', description_ko = '감정과 상태', description_en = 'Feelings & States' WHERE id = 'c0000000-0000-0000-0000-000000000010';

NOTIFY pgrst, 'reload schema';
