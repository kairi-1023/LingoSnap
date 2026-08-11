-- ============================================================
-- Migration 033: Universal Clean Seed for study_vocabularies
-- Matches exact column schema of study_vocabularies from DB
-- Columns: id, concept_code, category, difficulty_level,
--          word_en, word_ko, word_tl, word_th, word_vi, word_ja,
--          example_en, example_ko, example_tl, example_th, example_vi, example_ja,
--          phonetic_en, phonetic_ko, phonetic_tl, phonetic_th, phonetic_vi, phonetic_ja
-- ============================================================

-- Lesson 1: Greetings & Me
INSERT INTO public.study_vocabularies (
  id, concept_code, category, difficulty_level,
  word_en, word_ko, word_tl, word_th, word_vi, word_ja,
  example_en, example_ko, example_tl, example_th, example_vi, example_ja,
  phonetic_en, phonetic_ko, phonetic_tl, phonetic_th, phonetic_vi, phonetic_ja
)
SELECT 'a0000000-0000-0000-0000-000000000001', 'hello', 'greetings', 'beginner',
  'hello', '안녕', 'kumusta', NULL, NULL, NULL,
  'Hello! How are you doing today?', '안녕하세요! 오늘 어떻게 지내세요?', 'Kumusta ka ngayon?', NULL, NULL, NULL,
  '[həˈləʊ]', '[안녕]', '[ku-mus-ta]', NULL, NULL, NULL
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'hello' OR LOWER(concept_code) = 'hello');

INSERT INTO public.study_vocabularies (
  id, concept_code, category, difficulty_level,
  word_en, word_ko, word_tl, word_th, word_vi, word_ja,
  example_en, example_ko, example_tl, example_th, example_vi, example_ja,
  phonetic_en, phonetic_ko, phonetic_tl, phonetic_th, phonetic_vi, phonetic_ja
)
SELECT 'a0000000-0000-0000-0000-000000000002', 'bye', 'greetings', 'beginner',
  'bye', '잘 가', 'paalam', NULL, NULL, NULL,
  'Bye! See you tomorrow.', '잘 가! 내일 봐.', 'Paalam na muna sa iyo.', NULL, NULL, NULL,
  '[baɪ]', '[잘 가]', '[pa-a-lam]', NULL, NULL, NULL
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'bye' OR LOWER(concept_code) = 'bye');

INSERT INTO public.study_vocabularies (
  id, concept_code, category, difficulty_level,
  word_en, word_ko, word_tl, word_th, word_vi, word_ja,
  example_en, example_ko, example_tl, example_th, example_vi, example_ja,
  phonetic_en, phonetic_ko, phonetic_tl, phonetic_th, phonetic_vi, phonetic_ja
)
SELECT 'a0000000-0000-0000-0000-000000000003', 'i', 'greetings', 'beginner',
  'i', '나', 'ako', NULL, NULL, NULL,
  'I am happy today.', '나는 오늘 기쁘다.', 'Ako ay masaya ngayon.', NULL, NULL, NULL,
  '[aɪ]', '[나]', '[a-ko]', NULL, NULL, NULL
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'i' OR LOWER(concept_code) = 'i');

INSERT INTO public.study_vocabularies (
  id, concept_code, category, difficulty_level,
  word_en, word_ko, word_tl, word_th, word_vi, word_ja,
  example_en, example_ko, example_tl, example_th, example_vi, example_ja,
  phonetic_en, phonetic_ko, phonetic_tl, phonetic_th, phonetic_vi, phonetic_ja
)
SELECT 'a0000000-0000-0000-0000-000000000004', 'you', 'greetings', 'beginner',
  'you', '너', 'ikaw', NULL, NULL, NULL,
  'You are my dear partner.', '너는 나의 소중한 연인이다.', 'Ikaw ang aking mahal.', NULL, NULL, NULL,
  '[juː]', '[너]', '[i-kaw]', NULL, NULL, NULL
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'you' OR LOWER(concept_code) = 'you');

INSERT INTO public.study_vocabularies (
  id, concept_code, category, difficulty_level,
  word_en, word_ko, word_tl, word_th, word_vi, word_ja,
  example_en, example_ko, example_tl, example_th, example_vi, example_ja,
  phonetic_en, phonetic_ko, phonetic_tl, phonetic_th, phonetic_vi, phonetic_ja
)
SELECT 'a0000000-0000-0000-0000-000000000005', 'name', 'greetings', 'beginner',
  'name', '이름', 'pangalan', NULL, NULL, NULL,
  'What is your name?', '당신의 이름은 무엇인가요?', 'Ano ang iyong pangalan?', NULL, NULL, NULL,
  '[neɪm]', '[이름]', '[pa-nga-lan]', NULL, NULL, NULL
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'name' OR LOWER(concept_code) = 'name');

INSERT INTO public.study_vocabularies (
  id, concept_code, category, difficulty_level,
  word_en, word_ko, word_tl, word_th, word_vi, word_ja,
  example_en, example_ko, example_tl, example_th, example_vi, example_ja,
  phonetic_en, phonetic_ko, phonetic_tl, phonetic_th, phonetic_vi, phonetic_ja
)
SELECT 'a0000000-0000-0000-0000-000000000006', 'friend', 'greetings', 'beginner',
  'friend', '친구', 'kaibigan', NULL, NULL, NULL,
  'We are best friends.', '우리는 베스트 친구이다.', 'Mabuting kaibigan kita.', NULL, NULL, NULL,
  '[frend]', '[친구]', '[ka-i-bi-gan]', NULL, NULL, NULL
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'friend' OR LOWER(concept_code) = 'friend');

INSERT INTO public.study_vocabularies (
  id, concept_code, category, difficulty_level,
  word_en, word_ko, word_tl, word_th, word_vi, word_ja,
  example_en, example_ko, example_tl, example_th, example_vi, example_ja,
  phonetic_en, phonetic_ko, phonetic_tl, phonetic_th, phonetic_vi, phonetic_ja
)
SELECT 'a0000000-0000-0000-0000-000000000007', 'happy', 'greetings', 'beginner',
  'happy', '행복한', 'masaya', NULL, NULL, NULL,
  'I am happy together with you.', '너와 함께 있어서 행복해.', 'Masaya ako kasama ka.', NULL, NULL, NULL,
  '[ˈhæpi]', '[행복한]', '[ma-sa-ya]', NULL, NULL, NULL
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'happy' OR LOWER(concept_code) = 'happy');

INSERT INTO public.study_vocabularies (
  id, concept_code, category, difficulty_level,
  word_en, word_ko, word_tl, word_th, word_vi, word_ja,
  example_en, example_ko, example_tl, example_th, example_vi, example_ja,
  phonetic_en, phonetic_ko, phonetic_tl, phonetic_th, phonetic_vi, phonetic_ja
)
SELECT 'a0000000-0000-0000-0000-000000000008', 'love', 'greetings', 'beginner',
  'love', '사랑', 'pag-ibig', NULL, NULL, NULL,
  'Love makes life wonderful.', '사랑은 삶을 아름답게 만든다.', 'Ang pag-ibig ay maganda.', NULL, NULL, NULL,
  '[lʌv]', '[사랑]', '[pag-i-big]', NULL, NULL, NULL
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'love' OR LOWER(concept_code) = 'love');

INSERT INTO public.study_vocabularies (
  id, concept_code, category, difficulty_level,
  word_en, word_ko, word_tl, word_th, word_vi, word_ja,
  example_en, example_ko, example_tl, example_th, example_vi, example_ja,
  phonetic_en, phonetic_ko, phonetic_tl, phonetic_th, phonetic_vi, phonetic_ja
)
SELECT 'a0000000-0000-0000-0000-000000000009', 'like', 'greetings', 'beginner',
  'like', '좋아하다', 'gusto', NULL, NULL, NULL,
  'I like spending time with you.', '너와 시간 보내는 것이 좋아.', 'Gusto kita nang sobra.', NULL, NULL, NULL,
  '[laɪk]', '[좋아하다]', '[gus-to]', NULL, NULL, NULL
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'like' OR LOWER(concept_code) = 'like');

INSERT INTO public.study_vocabularies (
  id, concept_code, category, difficulty_level,
  word_en, word_ko, word_tl, word_th, word_vi, word_ja,
  example_en, example_ko, example_tl, example_th, example_vi, example_ja,
  phonetic_en, phonetic_ko, phonetic_tl, phonetic_th, phonetic_vi, phonetic_ja
)
SELECT 'a0000000-0000-0000-0000-000000000010', 'smile', 'greetings', 'beginner',
  'smile', '미소', 'ngiti', NULL, NULL, NULL,
  'Your smile warms my heart.', '당신의 미소가 내 마음을 따뜻하게 해요.', 'Maganda ang iyong ngiti.', NULL, NULL, NULL,
  '[smaɪl]', '[미소]', '[ngi-ti]', NULL, NULL, NULL
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'smile' OR LOWER(concept_code) = 'smile');


-- Lesson 2: Family
INSERT INTO public.study_vocabularies (
  id, concept_code, category, difficulty_level,
  word_en, word_ko, word_tl, word_th, word_vi, word_ja,
  example_en, example_ko, example_tl, example_th, example_vi, example_ja,
  phonetic_en, phonetic_ko, phonetic_tl, phonetic_th, phonetic_vi, phonetic_ja
)
SELECT 'a0000000-0000-0000-0000-000000000011', 'family', 'family', 'beginner',
  'family', '가족', 'pamilya', NULL, NULL, NULL,
  'I love my warm family.', '나는 따뜻한 내 가족을 사랑한다.', 'Mahal ko ang aking pamilya.', NULL, NULL, NULL,
  '[ˈfæməli]', '[가족]', '[pa-mil-ya]', NULL, NULL, NULL
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'family' OR LOWER(concept_code) = 'family');

INSERT INTO public.study_vocabularies (
  id, concept_code, category, difficulty_level,
  word_en, word_ko, word_tl, word_th, word_vi, word_ja,
  example_en, example_ko, example_tl, example_th, example_vi, example_ja,
  phonetic_en, phonetic_ko, phonetic_tl, phonetic_th, phonetic_vi, phonetic_ja
)
SELECT 'a0000000-0000-0000-0000-000000000012', 'mother', 'family', 'beginner',
  'mother', '어머니', 'ina', NULL, NULL, NULL,
  'My mother cooks delicious food.', '우리 어머니는 맛있는 음식을 만든다.', 'Mabait ang aking ina.', NULL, NULL, NULL,
  '[ˈmʌðər]', '[어머니]', '[i-na]', NULL, NULL, NULL
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'mother' OR LOWER(concept_code) = 'mother');

INSERT INTO public.study_vocabularies (
  id, concept_code, category, difficulty_level,
  word_en, word_ko, word_tl, word_th, word_vi, word_ja,
  example_en, example_ko, example_tl, example_th, example_vi, example_ja,
  phonetic_en, phonetic_ko, phonetic_tl, phonetic_th, phonetic_vi, phonetic_ja
)
SELECT 'a0000000-0000-0000-0000-000000000013', 'father', 'family', 'beginner',
  'father', '아버지', 'ama', NULL, NULL, NULL,
  'My father is hardworking.', '우리 아버지는 근면하시다.', 'Masipag ang aking ama.', NULL, NULL, NULL,
  '[ˈfɑːðər]', '[아버지]', '[a-ma]', NULL, NULL, NULL
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'father' OR LOWER(concept_code) = 'father');

INSERT INTO public.study_vocabularies (
  id, concept_code, category, difficulty_level,
  word_en, word_ko, word_tl, word_th, word_vi, word_ja,
  example_en, example_ko, example_tl, example_th, example_vi, example_ja,
  phonetic_en, phonetic_ko, phonetic_tl, phonetic_th, phonetic_vi, phonetic_ja
)
SELECT 'a0000000-0000-0000-0000-000000000014', 'baby', 'family', 'beginner',
  'baby', '아기', 'sanggol', NULL, NULL, NULL,
  'The cute baby is sleeping.', '귀여운 아기가 자고 있다.', 'Natutulog ang cute na sanggol.', NULL, NULL, NULL,
  '[ˈbeɪbi]', '[아기]', '[sang-gol]', NULL, NULL, NULL
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'baby' OR LOWER(concept_code) = 'baby');

INSERT INTO public.study_vocabularies (
  id, concept_code, category, difficulty_level,
  word_en, word_ko, word_tl, word_th, word_vi, word_ja,
  example_en, example_ko, example_tl, example_th, example_vi, example_ja,
  phonetic_en, phonetic_ko, phonetic_tl, phonetic_th, phonetic_vi, phonetic_ja
)
SELECT 'a0000000-0000-0000-0000-000000000015', 'brother', 'family', 'beginner',
  'brother', '형제/남동생', 'kapatid na lalaki', NULL, NULL, NULL,
  'My brother plays games with me.', '형제가 나와 게임을 한다.', 'Mabuti ang aking kapatid na lalaki.', NULL, NULL, NULL,
  '[ˈbrʌðər]', '[브라더]', '[ka-pa-tid na la-la-ki]', NULL, NULL, NULL
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'brother' OR LOWER(concept_code) = 'brother');

INSERT INTO public.study_vocabularies (
  id, concept_code, category, difficulty_level,
  word_en, word_ko, word_tl, word_th, word_vi, word_ja,
  example_en, example_ko, example_tl, example_th, example_vi, example_ja,
  phonetic_en, phonetic_ko, phonetic_tl, phonetic_th, phonetic_vi, phonetic_ja
)
SELECT 'a0000000-0000-0000-0000-000000000016', 'sister', 'family', 'beginner',
  'sister', '자매/여동생', 'kapatid na babae', NULL, NULL, NULL,
  'My sister is very kind.', '내 자매는 매우 친절하다.', 'Maganda ang aking kapatid na babae.', NULL, NULL, NULL,
  '[ˈsɪstər]', '[시스터]', '[ka-pa-tid na ba-ba-e]', NULL, NULL, NULL
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'sister' OR LOWER(concept_code) = 'sister');

INSERT INTO public.study_vocabularies (
  id, concept_code, category, difficulty_level,
  word_en, word_ko, word_tl, word_th, word_vi, word_ja,
  example_en, example_ko, example_tl, example_th, example_vi, example_ja,
  phonetic_en, phonetic_ko, phonetic_tl, phonetic_th, phonetic_vi, phonetic_ja
)
SELECT 'a0000000-0000-0000-0000-000000000017', 'grandma', 'family', 'beginner',
  'grandma', '할머니', 'lola', NULL, NULL, NULL,
  'Grandma tells interesting stories.', '할머니께서 흥미로운 이야기를 해주신다.', 'Nagluluto si lola ng masarap.', NULL, NULL, NULL,
  '[ˈɡrænmɑː]', '[할머니]', '[lo-la]', NULL, NULL, NULL
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'grandma' OR LOWER(concept_code) = 'grandma');

INSERT INTO public.study_vocabularies (
  id, concept_code, category, difficulty_level,
  word_en, word_ko, word_tl, word_th, word_vi, word_ja,
  example_en, example_ko, example_tl, example_th, example_vi, example_ja,
  phonetic_en, phonetic_ko, phonetic_tl, phonetic_th, phonetic_vi, phonetic_ja
)
SELECT 'a0000000-0000-0000-0000-000000000018', 'grandpa', 'family', 'beginner',
  'grandpa', '할아버지', 'lolo', NULL, NULL, NULL,
  'Grandpa loves walking in park.', '할아버지께서는 공원 산책을 좋아하신다.', 'Mabait ang aking lolo.', NULL, NULL, NULL,
  '[ˈɡrænpɑː]', '[할아버지]', '[lo-lo]', NULL, NULL, NULL
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'grandpa' OR LOWER(concept_code) = 'grandpa');

INSERT INTO public.study_vocabularies (
  id, concept_code, category, difficulty_level,
  word_en, word_ko, word_tl, word_th, word_vi, word_ja,
  example_en, example_ko, example_tl, example_th, example_vi, example_ja,
  phonetic_en, phonetic_ko, phonetic_tl, phonetic_th, phonetic_vi, phonetic_ja
)
SELECT 'a0000000-0000-0000-0000-000000000019', 'son', 'family', 'beginner',
  'son', '아들', 'anak na lalaki', NULL, NULL, NULL,
  'My son studies hard.', '내 아들은 열심히 공부한다.', 'Nagaaral ang aking anak na lalaki.', NULL, NULL, NULL,
  '[sʌn]', '[아들]', '[a-nak na la-la-ki]', NULL, NULL, NULL
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'son' OR LOWER(concept_code) = 'son');

INSERT INTO public.study_vocabularies (
  id, concept_code, category, difficulty_level,
  word_en, word_ko, word_tl, word_th, word_vi, word_ja,
  example_en, example_ko, example_tl, example_th, example_vi, example_ja,
  phonetic_en, phonetic_ko, phonetic_tl, phonetic_th, phonetic_vi, phonetic_ja
)
SELECT 'a0000000-0000-0000-0000-000000000020', 'daughter', 'family', 'beginner',
  'daughter', '딸', 'anak na babae', NULL, NULL, NULL,
  'My daughter sings wonderfully.', '내 딸은 노랫소리가 훌륭하다.', 'Mabait ang aking anak na babae.', NULL, NULL, NULL,
  '[ˈdɔːtər]', '[딸]', '[a-nak na ba-ba-e]', NULL, NULL, NULL
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'daughter' OR LOWER(concept_code) = 'daughter');

-- Lesson 3: Home
INSERT INTO public.study_vocabularies (
  id, concept_code, category, difficulty_level,
  word_en, word_ko, word_tl, word_th, word_vi, word_ja,
  example_en, example_ko, example_tl, example_th, example_vi, example_ja,
  phonetic_en, phonetic_ko, phonetic_tl, phonetic_th, phonetic_vi, phonetic_ja
)
SELECT 'a0000000-0000-0000-0000-000000000021', 'house', 'home', 'beginner',
  'house', '집', 'bahay', NULL, NULL, NULL,
  'Our house is clean and cozy.', '우리 집은 깨끗하고 아늑하다.', 'Malinis ang aming bahay.', NULL, NULL, NULL,
  '[haʊs]', '[집]', '[ba-hay]', NULL, NULL, NULL
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'house' OR LOWER(concept_code) = 'house');

INSERT INTO public.study_vocabularies (
  id, concept_code, category, difficulty_level,
  word_en, word_ko, word_tl, word_th, word_vi, word_ja,
  example_en, example_ko, example_tl, example_th, example_vi, example_ja,
  phonetic_en, phonetic_ko, phonetic_tl, phonetic_th, phonetic_vi, phonetic_ja
)
SELECT 'a0000000-0000-0000-0000-000000000022', 'room', 'home', 'beginner',
  'room', '방', 'silid', NULL, NULL, NULL,
  'My room is bright.', '내 방은 밝다.', 'Malaki ang aking silid.', NULL, NULL, NULL,
  '[ruːm]', '[룸]', '[si-lid]', NULL, NULL, NULL
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'room' OR LOWER(concept_code) = 'room');

INSERT INTO public.study_vocabularies (
  id, concept_code, category, difficulty_level,
  word_en, word_ko, word_tl, word_th, word_vi, word_ja,
  example_en, example_ko, example_tl, example_th, example_vi, example_ja,
  phonetic_en, phonetic_ko, phonetic_tl, phonetic_th, phonetic_vi, phonetic_ja
)
SELECT 'a0000000-0000-0000-0000-000000000023', 'door', 'home', 'beginner',
  'door', '문', 'pinto', NULL, NULL, NULL,
  'Close the front door please.', '현관문을 닫아주세요.', 'Isara mo ang pinto.', NULL, NULL, NULL,
  '[dɔːr]', '[도어]', '[pin-to]', NULL, NULL, NULL
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'door' OR LOWER(concept_code) = 'door');

INSERT INTO public.study_vocabularies (
  id, concept_code, category, difficulty_level,
  word_en, word_ko, word_tl, word_th, word_vi, word_ja,
  example_en, example_ko, example_tl, example_th, example_vi, example_ja,
  phonetic_en, phonetic_ko, phonetic_tl, phonetic_th, phonetic_vi, phonetic_ja
)
SELECT 'a0000000-0000-0000-0000-000000000024', 'window', 'home', 'beginner',
  'window', '창문', 'bintana', NULL, NULL, NULL,
  'Open the window for fresh air.', '환기를 위해 창문을 열어라.', 'Buksan mo ang bintana.', NULL, NULL, NULL,
  '[ˈwɪndəʊ]', '[윈도우]', '[bin-ta-na]', NULL, NULL, NULL
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'window' OR LOWER(concept_code) = 'window');

INSERT INTO public.study_vocabularies (
  id, concept_code, category, difficulty_level,
  word_en, word_ko, word_tl, word_th, word_vi, word_ja,
  example_en, example_ko, example_tl, example_th, example_vi, example_ja,
  phonetic_en, phonetic_ko, phonetic_tl, phonetic_th, phonetic_vi, phonetic_ja
)
SELECT 'a0000000-0000-0000-0000-000000000025', 'bed', 'home', 'beginner',
  'bed', '침대', 'kama', NULL, NULL, NULL,
  'The soft bed is comfortable.', '부드러운 침대가 편안하다.', 'Malambot ang aking kama.', NULL, NULL, NULL,
  '[bed]', '[침대]', '[ka-ma]', NULL, NULL, NULL
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'bed' OR LOWER(concept_code) = 'bed');

INSERT INTO public.study_vocabularies (
  id, concept_code, category, difficulty_level,
  word_en, word_ko, word_tl, word_th, word_vi, word_ja,
  example_en, example_ko, example_tl, example_th, example_vi, example_ja,
  phonetic_en, phonetic_ko, phonetic_tl, phonetic_th, phonetic_vi, phonetic_ja
)
SELECT 'a0000000-0000-0000-0000-000000000026', 'chair', 'home', 'beginner',
  'chair', '의자', 'upuan', NULL, NULL, NULL,
  'Sit on the comfortable chair.', '편안한 의자에 앉으세요.', 'Umupo ka sa upuan.', NULL, NULL, NULL,
  '[tʃer]', '[체어]', '[u-pu-an]', NULL, NULL, NULL
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'chair' OR LOWER(concept_code) = 'chair');

INSERT INTO public.study_vocabularies (
  id, concept_code, category, difficulty_level,
  word_en, word_ko, word_tl, word_th, word_vi, word_ja,
  example_en, example_ko, example_tl, example_th, example_vi, example_ja,
  phonetic_en, phonetic_ko, phonetic_tl, phonetic_th, phonetic_vi, phonetic_ja
)
SELECT 'a0000000-0000-0000-0000-000000000027', 'table', 'home', 'beginner',
  'table', '탁자/식탁', 'lamesa', NULL, NULL, NULL,
  'Dinner is set on table.', '식탁에 저녁이 차려져 있다.', 'Malinis ang lamesa.', NULL, NULL, NULL,
  '[ˈteɪbl]', '[테이블]', '[la-me-sa]', NULL, NULL, NULL
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'table' OR LOWER(concept_code) = 'table');

INSERT INTO public.study_vocabularies (
  id, concept_code, category, difficulty_level,
  word_en, word_ko, word_tl, word_th, word_vi, word_ja,
  example_en, example_ko, example_tl, example_th, example_vi, example_ja,
  phonetic_en, phonetic_ko, phonetic_tl, phonetic_th, phonetic_vi, phonetic_ja
)
SELECT 'a0000000-0000-0000-0000-000000000028', 'lamp', 'home', 'beginner',
  'lamp', '스탠드 조명', 'ilawan', NULL, NULL, NULL,
  'Turn on night desk lamp.', '야간 책상 조명을 켜세요.', 'Maliwanag ang ilawan.', NULL, NULL, NULL,
  '[læmp]', '[램프]', '[i-la-wan]', NULL, NULL, NULL
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'lamp' OR LOWER(concept_code) = 'lamp');

INSERT INTO public.study_vocabularies (
  id, concept_code, category, difficulty_level,
  word_en, word_ko, word_tl, word_th, word_vi, word_ja,
  example_en, example_ko, example_tl, example_th, example_vi, example_ja,
  phonetic_en, phonetic_ko, phonetic_tl, phonetic_th, phonetic_vi, phonetic_ja
)
SELECT 'a0000000-0000-0000-0000-000000000029', 'key', 'home', 'beginner',
  'key', '열쇠', 'susi', NULL, NULL, NULL,
  'I lost my house key.', '나는 집 열쇠를 잃어버렸다.', 'Nasaan ang susi?', NULL, NULL, NULL,
  '[kiː]', '[키]', '[su-si]', NULL, NULL, NULL
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'key' OR LOWER(concept_code) = 'key');

INSERT INTO public.study_vocabularies (
  id, concept_code, category, difficulty_level,
  word_en, word_ko, word_tl, word_th, word_vi, word_ja,
  example_en, example_ko, example_tl, example_th, example_vi, example_ja,
  phonetic_en, phonetic_ko, phonetic_tl, phonetic_th, phonetic_vi, phonetic_ja
)
SELECT 'a0000000-0000-0000-0000-000000000030', 'phone', 'home', 'beginner',
  'phone', '전화기', 'telepono', NULL, NULL, NULL,
  'Answer the calling phone.', '걸려오는 전화를 받으세요.', 'Gamitin mo ang telepono.', NULL, NULL, NULL,
  '[foʊn]', '[폰]', '[te-le-po-no]', NULL, NULL, NULL
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'phone' OR LOWER(concept_code) = 'phone');

NOTIFY pgrst, 'reload schema';
