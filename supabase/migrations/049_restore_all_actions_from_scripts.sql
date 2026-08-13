-- Restore all 10 Daily Actions words from scripts/words_examples.csv.
-- Existing rows are updated by concept_code; missing rows are inserted.

DO $$
DECLARE
  restored RECORD;
  existing_id uuid;
BEGIN
  FOR restored IN
    SELECT * FROM (VALUES
      ('a0000000-0000-0000-0000-000000000001'::uuid, 'eat',   '먹다', 'kumain',  'Let''s eat together.',       '같이 먹자.',                 'Kumain tayo nang sabay.',            '[iːt]',   '[먹다]',   '[ku-main]'),
      ('a0000000-0000-0000-0000-000000000002'::uuid, 'drink', '마시다', 'uminom',  'Drink fresh water.',         '신선한 물을 마셔요.',         'Uminom ng sariwang tubig.',          '[drɪŋk]', '[마시다]', '[u-mi-nom]'),
      ('a0000000-0000-0000-0000-000000000003'::uuid, 'sleep', '자다', 'matulog',  'Sleep early tonight.',       '오늘 밤은 일찍 자요.',         'Matulog ka nang maaga.',             '[sliːp]',  '[자다]',   '[ma-tu-log]'),
      ('a0000000-0000-0000-0000-000000000006'::uuid, 'run',   '달리다', 'tumakbo', 'He runs fast.',              '그는 빠르게 달려요.',         'Mabilis siyang tumakbo.',            '[rʌn]',   '[달리다]', '[tu-mak-bo]'),
      ('a0000000-0000-0000-0000-000000000007'::uuid, 'walk',  '걷다', 'maglakad', 'I walk in the park.',        '나는 공원에서 걸어요.',       'Naglalakad ako sa parke.',           '[wɔːk]',  '[걷다]',   '[mag-la-kad]'),
      ('a0000000-0000-0000-0000-000000000010'::uuid, 'read',  '읽다', 'magbasa',  'I read a book.',             '나는 책을 읽어요.',           'Nagbabasa ako ng libro.',            '[riːd]',  '[읽다]',   '[mag-ba-sa]'),
      ('a0000000-0000-0000-0000-000000000050'::uuid, 'sit',   '앉다', 'umupo',    'Please sit down.',            '앉으세요.',                  'Umupo ka muna.',                     '[sɪt]',   '[앉다]',   '[u-mu-po]'),
      ('a0000000-0000-0000-0000-000000000051'::uuid, 'stand', '서다', 'tumatayo', 'Stand up straight.',          '똑바로 서세요.',              'Tumayo ka nang diretso.',            '[stænd]', '[서다]',   '[tu-ma-ta-yo]'),
      ('a0000000-0000-0000-0000-000000000052'::uuid, 'write', '쓰다', 'magsulat', 'Write a letter to me.',       '나에게 편지를 써줘요.',        'Magsulat ka ng liham para sa akin.', '[raɪt]',  '[쓰다]',   '[mag-su-lat]'),
      ('a0000000-0000-0000-0000-000000000053'::uuid, 'play',  '놀다 / 경기를 하다', 'maglaro', 'Children play happily.', '아이들이 행복하게 놀고 있어요.', 'Naglalaro ang mga bata nang masaya.', '[pleɪ]', '[놀다]', '[mag-la-ro]')
    ) AS values_data(
      id, concept_code, word_ko, word_tl,
      example_en, example_ko, example_tl,
      phonetic_en, phonetic_ko, phonetic_tl
    )
  LOOP
    SELECT id INTO existing_id
    FROM public.study_vocabularies
    WHERE LOWER(concept_code) = LOWER(restored.concept_code)
    LIMIT 1;

    IF existing_id IS NULL THEN
      SELECT id INTO existing_id
      FROM public.study_vocabularies
      WHERE id = restored.id
      LIMIT 1;
    END IF;

    IF existing_id IS NULL THEN
      INSERT INTO public.study_vocabularies (
        id, lesson_id, concept_code, category, difficulty_level,
        word_en, word_ko, word_tl,
        example_en, example_ko, example_tl,
        phonetic_en, phonetic_ko, phonetic_tl
      ) VALUES (
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
      );
    ELSE
      UPDATE public.study_vocabularies
      SET
        lesson_id = 'c0000000-0000-0000-0000-000000000005'::uuid,
        concept_code = restored.concept_code,
        category = 'actions',
        difficulty_level = 'beginner',
        word_en = restored.concept_code,
        word_ko = restored.word_ko,
        word_tl = restored.word_tl,
        example_en = restored.example_en,
        example_ko = restored.example_ko,
        example_tl = restored.example_tl,
        phonetic_en = restored.phonetic_en,
        phonetic_ko = restored.phonetic_ko,
        phonetic_tl = restored.phonetic_tl
      WHERE id = existing_id;
    END IF;
  END LOOP;
END $$;

-- Normalize all existing action rows and attach them to canonical Lesson 5.
UPDATE public.study_vocabularies AS vocabulary
SET
  lesson_id = 'c0000000-0000-0000-0000-000000000005'::uuid,
  category = 'actions',
  difficulty_level = 'beginner'
WHERE LOWER(vocabulary.concept_code) IN (
  'eat', 'drink', 'walk', 'run', 'sit',
  'stand', 'sleep', 'read', 'write', 'play'
);

NOTIFY pgrst, 'reload schema';
