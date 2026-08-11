-- ============================================================
-- Migration 024: Seed 10 Lessons (100 Words) from 2.txt
-- (Uses Valid Hexadecimal UUIDs c0000000-0000-0000-0000-000000000001 ~ 10)
-- ============================================================

-- 1. Insert 10 Lessons into public.ai_lessons (WHERE NOT EXISTS)
INSERT INTO public.ai_lessons (id, user_id, title, description, image_url, ai_caption)
SELECT 'c0000000-0000-0000-0000-000000000001', NULL, 'Lesson 1: Greetings & Me', 'Basic Greetings & Self', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c', 'Greetings & Me'
WHERE NOT EXISTS (SELECT 1 FROM public.ai_lessons WHERE id = 'c0000000-0000-0000-0000-000000000001');

INSERT INTO public.ai_lessons (id, user_id, title, description, image_url, ai_caption)
SELECT 'c0000000-0000-0000-0000-000000000002', NULL, 'Lesson 2: Family', 'Family Words', 'https://images.unsplash.com/photo-1511895426328-dc8714191300', 'Family'
WHERE NOT EXISTS (SELECT 1 FROM public.ai_lessons WHERE id = 'c0000000-0000-0000-0000-000000000002');

INSERT INTO public.ai_lessons (id, user_id, title, description, image_url, ai_caption)
SELECT 'c0000000-0000-0000-0000-000000000003', NULL, 'Lesson 3: Home', 'Home & Objects', 'https://images.unsplash.com/photo-1513694203232-719a280e022f', 'Home'
WHERE NOT EXISTS (SELECT 1 FROM public.ai_lessons WHERE id = 'c0000000-0000-0000-0000-000000000003');

INSERT INTO public.ai_lessons (id, user_id, title, description, image_url, ai_caption)
SELECT 'c0000000-0000-0000-0000-000000000004', NULL, 'Lesson 4: Food', 'Food & Drinks', 'https://images.unsplash.com/photo-1498837167922-ddd27525d352', 'Food'
WHERE NOT EXISTS (SELECT 1 FROM public.ai_lessons WHERE id = 'c0000000-0000-0000-0000-000000000004');

INSERT INTO public.ai_lessons (id, user_id, title, description, image_url, ai_caption)
SELECT 'c0000000-0000-0000-0000-000000000005', NULL, 'Lesson 5: Actions', 'Daily Actions', 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8', 'Actions'
WHERE NOT EXISTS (SELECT 1 FROM public.ai_lessons WHERE id = 'c0000000-0000-0000-0000-000000000005');

INSERT INTO public.ai_lessons (id, user_id, title, description, image_url, ai_caption)
SELECT 'c0000000-0000-0000-0000-000000000006', NULL, 'Lesson 6: Animals', 'Animal Names', 'https://images.unsplash.com/photo-1543466835-00a7907e9de1', 'Animals'
WHERE NOT EXISTS (SELECT 1 FROM public.ai_lessons WHERE id = 'c0000000-0000-0000-0000-000000000006');

INSERT INTO public.ai_lessons (id, user_id, title, description, image_url, ai_caption)
SELECT 'c0000000-0000-0000-0000-000000000007', NULL, 'Lesson 7: Colors', 'Basic Colors', 'https://images.unsplash.com/photo-1502691876148-a84978e59af8', 'Colors'
WHERE NOT EXISTS (SELECT 1 FROM public.ai_lessons WHERE id = 'c0000000-0000-0000-0000-000000000007');

INSERT INTO public.ai_lessons (id, user_id, title, description, image_url, ai_caption)
SELECT 'c0000000-0000-0000-0000-000000000008', NULL, 'Lesson 8: Places', 'Common Places', 'https://images.unsplash.com/photo-1519501025264-65ba15a82390', 'Places'
WHERE NOT EXISTS (SELECT 1 FROM public.ai_lessons WHERE id = 'c0000000-0000-0000-0000-000000000008');

INSERT INTO public.ai_lessons (id, user_id, title, description, image_url, ai_caption)
SELECT 'c0000000-0000-0000-0000-000000000009', NULL, 'Lesson 9: Travel', 'Travel Essentials', 'https://images.unsplash.com/photo-1488646953014-85cb44e25828', 'Travel'
WHERE NOT EXISTS (SELECT 1 FROM public.ai_lessons WHERE id = 'c0000000-0000-0000-0000-000000000009');

INSERT INTO public.ai_lessons (id, user_id, title, description, image_url, ai_caption)
SELECT 'c0000000-0000-0000-0000-000000000010', NULL, 'Lesson 10: Feelings', 'Feelings & States', 'https://images.unsplash.com/photo-1499209974431-9dac3ada00d7', 'Feelings'
WHERE NOT EXISTS (SELECT 1 FROM public.ai_lessons WHERE id = 'c0000000-0000-0000-0000-000000000010');

-- 2. Helper PL/pgSQL function to map words to study_vocabularies READ-ONLY
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
      ('c0000000-0000-0000-0000-000000000010'::UUID, ARRAY['good','bad','sad','angry','tired','hungry','thirsty','sick','busy','free'])
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
