-- ============================================================
-- Migration 031: Safe Linker for Lessons 1 to 11
-- Description: Automatically finds matching word IDs from public.study_vocabularies
--              by LOWER(word_en) or LOWER(concept_code) and links them to public.ai_lesson_vocabulary.
-- ============================================================

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
      
      -- Find matching vocabulary id in study_vocabularies table
      SELECT id INTO v_vocab_id
      FROM public.study_vocabularies
      WHERE LOWER(word_en) = LOWER(v_word) OR LOWER(concept_code) = LOWER(v_word)
      LIMIT 1;

      -- If found, safely insert into ai_lesson_vocabulary without duplicates
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
