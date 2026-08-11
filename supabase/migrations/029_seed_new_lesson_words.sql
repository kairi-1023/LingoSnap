-- ============================================================
-- Migration 029: Seed Lesson 11 (Cafe & Dating)
-- Languages: English, Korean, Tagalog (en, ko, tl)
-- ============================================================

-- 1. Insert Lesson 11 into public.ai_lessons
INSERT INTO public.ai_lessons (
  id, user_id, title, title_en, title_ko, description, description_en, description_ko, image_url, ai_caption
)
SELECT
  'c0000000-0000-0000-0000-000000000011',
  NULL,
  'Lesson 11: Cafe & Dating',
  'Lesson 11: Cafe & Dating',
  'Lesson 11: 카페와 데이트',
  'Cafe & Dating words for couples',
  'Cafe & Dating words for couples',
  '카페와 데이트 필수 단어',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
  'A cozy cafe table with warm coffee and desserts for couples'
WHERE NOT EXISTS (
  SELECT 1 FROM public.ai_lessons WHERE id = 'c0000000-0000-0000-0000-000000000011'
);

-- 2. Insert 10 Vocabularies into public.study_vocabularies (en, ko, tl)
INSERT INTO public.study_vocabularies (
  id, concept_code, category, difficulty_level,
  word_en, word_ko, word_tl,
  example_en, example_ko, example_tl,
  phonetic_en, phonetic_ko, phonetic_tl
)
SELECT
  'a0000000-0000-0000-0000-000000000011', 'coffee', 'cafe_dating', 'beginner',
  'coffee', '커피', 'kape',
  'Let us drink coffee together at the cafe.', '카페에서 함께 커피를 마시자.', 'Uminom tayo ng kape sa cafe.',
  '[ˈkɔːfi]', '[커피]', '[ka-pe]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE id = 'a0000000-0000-0000-0000-000000000011');

INSERT INTO public.study_vocabularies (
  id, concept_code, category, difficulty_level,
  word_en, word_ko, word_tl,
  example_en, example_ko, example_tl,
  phonetic_en, phonetic_ko, phonetic_tl
)
SELECT
  'a0000000-0000-0000-0000-000000000012', 'date', 'cafe_dating', 'beginner',
  'date', '데이트', 'date',
  'We had a wonderful date yesterday.', '우리는 어제 멋진 데이트를 했다.', 'Nagkaroon kami ng magandang date kahapon.',
  '[deɪt]', '[데이트]', '[deyt]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE id = 'a0000000-0000-0000-0000-000000000012');

INSERT INTO public.study_vocabularies (
  id, concept_code, category, difficulty_level,
  word_en, word_ko, word_tl,
  example_en, example_ko, example_tl,
  phonetic_en, phonetic_ko, phonetic_tl
)
SELECT
  'a0000000-0000-0000-0000-000000000013', 'tea', 'cafe_dating', 'beginner',
  'tea', '차', 'tsaa',
  'She enjoys drinking warm tea.', '그녀는 따뜻한 차를 마시는 것을 즐긴다.', 'Gusto niyang uminom ng mainit na tsaa.',
  '[tiː]', '[차]', '[cha-a]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE id = 'a0000000-0000-0000-0000-000000000013');

INSERT INTO public.study_vocabularies (
  id, concept_code, category, difficulty_level,
  word_en, word_ko, word_tl,
  example_en, example_ko, example_tl,
  phonetic_en, phonetic_ko, phonetic_tl
)
SELECT
  'a0000000-0000-0000-0000-000000000014', 'dessert', 'cafe_dating', 'beginner',
  'dessert', '디저트', 'matamis',
  'This chocolate cake is a delicious dessert.', '이 초콜릿 케이크는 맛있는 디저트이다.', 'Masarap na matamis itong tsokolate cake.',
  '[dɪˈzɜːrt]', '[디저트]', '[ma-ta-mis]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE id = 'a0000000-0000-0000-0000-000000000014');

INSERT INTO public.study_vocabularies (
  id, concept_code, category, difficulty_level,
  word_en, word_ko, word_tl,
  example_en, example_ko, example_tl,
  phonetic_en, phonetic_ko, phonetic_tl
)
SELECT
  'a0000000-0000-0000-0000-000000000015', 'menu', 'cafe_dating', 'beginner',
  'menu', '메뉴', 'menu',
  'Please show us the cafe menu.', '카페 메뉴판을 보여주세요.', 'Paki-pakita ang menu ng cafe.',
  '[ˈmenjuː]', '[메뉴]', '[me-nyu]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE id = 'a0000000-0000-0000-0000-000000000015');

INSERT INTO public.study_vocabularies (
  id, concept_code, category, difficulty_level,
  word_en, word_ko, word_tl,
  example_en, example_ko, example_tl,
  phonetic_en, phonetic_ko, phonetic_tl
)
SELECT
  'a0000000-0000-0000-0000-000000000016', 'sweet', 'cafe_dating', 'beginner',
  'sweet', '달콤한', 'matamis',
  'Your smile is so sweet.', '당신의 미소는 참 달콤해요.', 'Napakatamis ng iyong ngiti.',
  '[swiːt]', '[스위트]', '[ma-ta-mis]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE id = 'a0000000-0000-0000-0000-000000000016');

INSERT INTO public.study_vocabularies (
  id, concept_code, category, difficulty_level,
  word_en, word_ko, word_tl,
  example_en, example_ko, example_tl,
  phonetic_en, phonetic_ko, phonetic_tl
)
SELECT
  'a0000000-0000-0000-0000-000000000017', 'order', 'cafe_dating', 'beginner',
  'order', '주문하다', 'umorder',
  'I will order two coffees.', '커피 두 잔을 주문할게요.', 'Umorder ako ng dalawang kape.',
  '[ˈɔːrdər]', '[오더]', '[u-mor-der]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE id = 'a0000000-0000-0000-0000-000000000017');

INSERT INTO public.study_vocabularies (
  id, concept_code, category, difficulty_level,
  word_en, word_ko, word_tl,
  example_en, example_ko, example_tl,
  phonetic_en, phonetic_ko, phonetic_tl
)
SELECT
  'a0000000-0000-0000-0000-000000000018', 'talk', 'cafe_dating', 'beginner',
  'talk', '대화하다', 'mag-usap',
  'We talk about our daily life.', '우리는 일상에 대해 대화한다.', 'Naguusap kami tungkol sa aming araw-araw na buhay.',
  '[tɔːk]', '[토크]', '[mag-u-sap]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE id = 'a0000000-0000-0000-0000-000000000018');

INSERT INTO public.study_vocabularies (
  id, concept_code, category, difficulty_level,
  word_en, word_ko, word_tl,
  example_en, example_ko, example_tl,
  phonetic_en, phonetic_ko, phonetic_tl
)
SELECT
  'a0000000-0000-0000-0000-000000000019', 'together', 'cafe_dating', 'beginner',
  'together', '함께', 'magkasama',
  'We spend happy time together.', '우리는 함께 행복한 시간을 보낸다.', 'Masaya kaming nagtatagal nang magkasama.',
  '[təˈɡeðər]', '[투게더]', '[mag-ka-sa-ma]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE id = 'a0000000-0000-0000-0000-000000000019');

INSERT INTO public.study_vocabularies (
  id, concept_code, category, difficulty_level,
  word_en, word_ko, word_tl,
  example_en, example_ko, example_tl,
  phonetic_en, phonetic_ko, phonetic_tl
)
SELECT
  'a0000000-0000-0000-0000-000000000020', 'romantic', 'cafe_dating', 'beginner',
  'romantic', '낭만적인', 'romantiko',
  'It was a very romantic evening.', '매우 낭만적인 저녁이었다.', 'Napakaromantiko ng gabi.',
  '[roʊˈmæntɪk]', '[로맨틱]', '[ro-man-ti-ko]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE id = 'a0000000-0000-0000-0000-000000000020');

-- 3. Connect Vocabularies to Lesson 11 in public.ai_lesson_vocabulary
DO $$
DECLARE
  v_lesson_id UUID := 'c0000000-0000-0000-0000-000000000011';
  v_words TEXT[] := ARRAY['coffee', 'date', 'tea', 'dessert', 'menu', 'sweet', 'order', 'talk', 'together', 'romantic'];
  v_word TEXT;
  v_vocab_id UUID;
  v_idx INT;
BEGIN
  FOR v_idx IN 1..array_length(v_words, 1) LOOP
    v_word := v_words[v_idx];
    
    SELECT id INTO v_vocab_id
    FROM public.study_vocabularies
    WHERE LOWER(word_en) = LOWER(v_word) OR LOWER(concept_code) = LOWER(v_word)
    LIMIT 1;

    IF v_vocab_id IS NOT NULL THEN
      INSERT INTO public.ai_lesson_vocabulary (lesson_id, vocabulary_id, display_order)
      SELECT v_lesson_id, v_vocab_id, v_idx
      WHERE NOT EXISTS (
        SELECT 1 FROM public.ai_lesson_vocabulary 
        WHERE lesson_id = v_lesson_id AND vocabulary_id = v_vocab_id
      );
    END IF;
  END LOOP;
END $$;

-- 4. Create AI Quiz for Lesson 11
INSERT INTO public.ai_quizzes (id, lesson_id)
SELECT 'b0000000-0000-0000-0000-000000000011', 'c0000000-0000-0000-0000-000000000011'
WHERE NOT EXISTS (SELECT 1 FROM public.ai_quizzes WHERE id = 'b0000000-0000-0000-0000-000000000011');

-- 5. Insert Quiz Questions for Lesson 11
INSERT INTO public.ai_quiz_questions (id, quiz_id, type, question_text, options, correct_answer)
SELECT
  'd0000000-0000-0000-0000-000000000111',
  'b0000000-0000-0000-0000-000000000011',
  'multiple_choice',
  'What is "커피" in Tagalog?',
  '["kape", "tsaa", "matamis", "menu"]'::jsonb,
  'kape'
WHERE NOT EXISTS (SELECT 1 FROM public.ai_quiz_questions WHERE id = 'd0000000-0000-0000-0000-000000000111');

INSERT INTO public.ai_quiz_questions (id, quiz_id, type, question_text, options, correct_answer)
SELECT
  'd0000000-0000-0000-0000-000000000112',
  'b0000000-0000-0000-0000-000000000011',
  'multiple_choice',
  'What does "date" mean in Korean?',
  '["데이트", "디저트", "주문하다", "대화하다"]'::jsonb,
  '데이트'
WHERE NOT EXISTS (SELECT 1 FROM public.ai_quiz_questions WHERE id = 'd0000000-0000-0000-0000-000000000112');

INSERT INTO public.ai_quiz_questions (id, quiz_id, type, question_text, options, correct_answer)
SELECT
  'd0000000-0000-0000-0000-000000000113',
  'b0000000-0000-0000-0000-000000000011',
  'multiple_choice',
  'What is the English word for "함께"?',
  '["together", "romantic", "sweet", "order"]'::jsonb,
  'together'
WHERE NOT EXISTS (SELECT 1 FROM public.ai_quiz_questions WHERE id = 'd0000000-0000-0000-0000-000000000113');

NOTIFY pgrst, 'reload schema';
