-- ============================================================
-- Migration 037: Master Setup for All Lessons & 109 Vocabularies
-- Creates junction table ai_lesson_vocabulary and seeds Lessons 1 to 11
-- ============================================================

-- 1. Create public.ai_lesson_vocabulary junction table if not exists
CREATE TABLE IF NOT EXISTS public.ai_lesson_vocabulary (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID NOT NULL REFERENCES public.ai_lessons(id) ON DELETE CASCADE,
    vocabulary_id UUID NOT NULL REFERENCES public.study_vocabularies(id) ON DELETE CASCADE,
    display_order INT NOT NULL DEFAULT 0,
    bounding_box JSONB NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT ai_lesson_vocab_unique UNIQUE (lesson_id, vocabulary_id)
);

-- RLS for ai_lesson_vocabulary
ALTER TABLE public.ai_lesson_vocabulary ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public all on ai_lesson_vocabulary" ON public.ai_lesson_vocabulary;
CREATE POLICY "Allow public all on ai_lesson_vocabulary" ON public.ai_lesson_vocabulary FOR ALL USING (true) WITH CHECK (true);
GRANT ALL ON public.ai_lesson_vocabulary TO anon, authenticated, service_role, postgres;


-- 2. Ensure Lessons 1 to 11 exist in public.ai_lessons
INSERT INTO public.ai_lessons (id, user_id, title, title_en, title_ko, description, description_en, description_ko, image_url, ai_caption)
SELECT 'c0000000-0000-0000-0000-000000000001', NULL, 'Lesson 1: Greetings & Me', 'Lesson 1: Greetings & Me', 'Lesson 1: 인사와 나', 'Basic Greetings & Self', 'Basic Greetings & Self', '인사와 나 기초', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c', 'Greetings & Me'
WHERE NOT EXISTS (SELECT 1 FROM public.ai_lessons WHERE id = 'c0000000-0000-0000-0000-000000000001');

INSERT INTO public.ai_lessons (id, user_id, title, title_en, title_ko, description, description_en, description_ko, image_url, ai_caption)
SELECT 'c0000000-0000-0000-0000-000000000002', NULL, 'Lesson 2: Family', 'Lesson 2: Family', 'Lesson 2: 가족', 'Family Words', 'Family Words', '가족 어휘', 'https://images.unsplash.com/photo-1511895426328-dc8714191300', 'Family'
WHERE NOT EXISTS (SELECT 1 FROM public.ai_lessons WHERE id = 'c0000000-0000-0000-0000-000000000002');

INSERT INTO public.ai_lessons (id, user_id, title, title_en, title_ko, description, description_en, description_ko, image_url, ai_caption)
SELECT 'c0000000-0000-0000-0000-000000000003', NULL, 'Lesson 3: Home', 'Lesson 3: Home', 'Lesson 3: 집', 'Home & Objects', 'Home & Objects', '집과 사물', 'https://images.unsplash.com/photo-1513694203232-719a280e022f', 'Home'
WHERE NOT EXISTS (SELECT 1 FROM public.ai_lessons WHERE id = 'c0000000-0000-0000-0000-000000000003');

INSERT INTO public.ai_lessons (id, user_id, title, title_en, title_ko, description, description_en, description_ko, image_url, ai_caption)
SELECT 'c0000000-0000-0000-0000-000000000004', NULL, 'Lesson 4: Food', 'Lesson 4: Food', 'Lesson 4: 음식', 'Food & Drinks', 'Food & Drinks', '음식과 음료', 'https://images.unsplash.com/photo-1498837167922-ddd27525d352', 'Food'
WHERE NOT EXISTS (SELECT 1 FROM public.ai_lessons WHERE id = 'c0000000-0000-0000-0000-000000000004');

INSERT INTO public.ai_lessons (id, user_id, title, title_en, title_ko, description, description_en, description_ko, image_url, ai_caption)
SELECT 'c0000000-0000-0000-0000-000000000005', NULL, 'Lesson 5: Actions', 'Lesson 5: Actions', 'Lesson 5: 기본 행동', 'Daily Actions', 'Daily Actions', '기본 행동', 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8', 'Actions'
WHERE NOT EXISTS (SELECT 1 FROM public.ai_lessons WHERE id = 'c0000000-0000-0000-0000-000000000005');

INSERT INTO public.ai_lessons (id, user_id, title, title_en, title_ko, description, description_en, description_ko, image_url, ai_caption)
SELECT 'c0000000-0000-0000-0000-000000000006', NULL, 'Lesson 6: Animals', 'Lesson 6: Animals', 'Lesson 6: 동물', 'Animal Names', 'Animal Names', '동물 이름', 'https://images.unsplash.com/photo-1543466835-00a7907e9de1', 'Animals'
WHERE NOT EXISTS (SELECT 1 FROM public.ai_lessons WHERE id = 'c0000000-0000-0000-0000-000000000006');

INSERT INTO public.ai_lessons (id, user_id, title, title_en, title_ko, description, description_en, description_ko, image_url, ai_caption)
SELECT 'c0000000-0000-0000-0000-000000000007', NULL, 'Lesson 7: Colors', 'Lesson 7: Colors', 'Lesson 7: 색깔', 'Basic Colors', 'Basic Colors', '기본 색깔', 'https://images.unsplash.com/photo-1502691876148-a84978e59af8', 'Colors'
WHERE NOT EXISTS (SELECT 1 FROM public.ai_lessons WHERE id = 'c0000000-0000-0000-0000-000000000007');

INSERT INTO public.ai_lessons (id, user_id, title, title_en, title_ko, description, description_en, description_ko, image_url, ai_caption)
SELECT 'c0000000-0000-0000-0000-000000000008', NULL, 'Lesson 8: Places', 'Lesson 8: Places', 'Lesson 8: 장소', 'Common Places', 'Common Places', '주변 장소', 'https://images.unsplash.com/photo-1519501025264-65ba15a82390', 'Places'
WHERE NOT EXISTS (SELECT 1 FROM public.ai_lessons WHERE id = 'c0000000-0000-0000-0000-000000000008');

INSERT INTO public.ai_lessons (id, user_id, title, title_en, title_ko, description, description_en, description_ko, image_url, ai_caption)
SELECT 'c0000000-0000-0000-0000-000000000009', NULL, 'Lesson 9: Travel', 'Lesson 9: Travel', 'Lesson 9: 여행', 'Travel Essentials', 'Travel Essentials', '여행 용품', 'https://images.unsplash.com/photo-1488646953014-85cb44e25828', 'Travel'
WHERE NOT EXISTS (SELECT 1 FROM public.ai_lessons WHERE id = 'c0000000-0000-0000-0000-000000000009');

INSERT INTO public.ai_lessons (id, user_id, title, title_en, title_ko, description, description_en, description_ko, image_url, ai_caption)
SELECT 'c0000000-0000-0000-0000-000000000010', NULL, 'Lesson 10: Feelings', 'Lesson 10: Feelings', 'Lesson 10: 감정과 상태', 'Feelings & States', 'Feelings & States', '감정과 상태', 'https://images.unsplash.com/photo-1499209974431-9dac3ada00d7', 'Feelings'
WHERE NOT EXISTS (SELECT 1 FROM public.ai_lessons WHERE id = 'c0000000-0000-0000-0000-000000000010');

INSERT INTO public.ai_lessons (id, user_id, title, title_en, title_ko, description, description_en, description_ko, image_url, ai_caption)
SELECT 'c0000000-0000-0000-0000-000000000011', NULL, 'Lesson 11: Cafe & Dating', 'Lesson 11: Cafe & Dating', 'Lesson 11: 카페와 데이트', 'Cafe & Dating words for couples', 'Cafe & Dating words for couples', '카페와 데이트 필수 단어', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4', 'Cafe and dating atmosphere'
WHERE NOT EXISTS (SELECT 1 FROM public.ai_lessons WHERE id = 'c0000000-0000-0000-0000-000000000011');


-- 3. Connect Vocabularies in public.study_vocabularies to public.ai_lesson_vocabulary
DO $$
DECLARE
  rec RECORD;
  v_vocab_id UUID;
  v_words TEXT[];
  v_lesson_id UUID;
  v_word TEXT;
  v_idx INT;
BEGIN
  FOR rec IN
    SELECT * FROM (VALUES
      ('c0000000-0000-0000-0000-000000000001'::UUID, ARRAY['hello','bye','i','you','name','friend','happy','love','like','smile']),
      ('c0000000-0000-0000-0000-000000000002'::UUID, ARRAY['family','mother','father','baby','brother','sister','grandma','grandpa','son','daughter']),
      ('c0000000-0000-0000-0000-000000000003'::UUID, ARRAY['house','room','door','window','bed','chair','table','lamp','key','phone']),
      ('c0000000-0000-0000-0000-000000000004'::UUID, ARRAY['food','rice','bread','apple','banana','egg','milk','water','coffee','cake']),
      ('c0000000-0000-0000-0000-000000000005'::UUID, ARRAY['eat','drink','walk','run','sit','stand','sleep','read','write','play']),
      ('c0000000-0000-0000-0000-000000000006'::UUID, ARRAY['dog','cat','bird','fish','horse','cow','pig','lion','monkey','rabbit']),
      ('c0000000-0000-0000-0000-000000000007'::UUID, ARRAY['red','blue','green','yellow','black','white','pink','orange','purple','brown']),
      ('c0000000-0000-0000-0000-000000000008'::UUID, ARRAY['school','home','store','hospital','park','bank','restaurant','airport','hotel','beach']),
      ('c0000000-0000-0000-0000-000000000009'::UUID, ARRAY['car','bus','train','plane','ship','road','map','bag','ticket','camera']),
      ('c0000000-0000-0000-0000-000000000010'::UUID, ARRAY['good','bad','sad','angry','tired','hungry','thirsty','sick','busy','free']),
      ('c0000000-0000-0000-0000-000000000011'::UUID, ARRAY['coffee','date','tea','dessert','menu','sweet','order','talk','together','romantic'])
    ) AS t(lesson_id, words)
  LOOP
    v_lesson_id := rec.lesson_id;
    v_words := rec.words;
    
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
  END LOOP;
END $$;

NOTIFY pgrst, 'reload schema';
