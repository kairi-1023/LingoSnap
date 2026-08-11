-- ============================================================
-- Migration 038: Full Schema Creation & 100 Vocabularies 1:N Linkage
-- (Ensures lesson_id column exists on public.study_vocabularies)
-- ============================================================

-- 1. public.ai_lessons 테이블 생성 보장
CREATE TABLE IF NOT EXISTS public.ai_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  title VARCHAR(150) NOT NULL,
  title_ko VARCHAR(150),
  title_en VARCHAR(150),
  description TEXT,
  description_ko TEXT,
  description_en TEXT,
  image_url TEXT,
  ai_caption TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- 2. public.study_vocabularies 테이블 생성 보장
CREATE TABLE IF NOT EXISTS public.study_vocabularies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  concept_code VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL DEFAULT 'daily',
  difficulty_level VARCHAR(10) NOT NULL DEFAULT 'A1',
  display_order INT DEFAULT 0,
  word_en TEXT,
  word_ko TEXT,
  word_tl TEXT,
  word_th TEXT,
  word_vi TEXT,
  word_ja TEXT,
  example_en TEXT,
  example_ko TEXT,
  example_tl TEXT,
  example_th TEXT,
  example_vi TEXT,
  example_ja TEXT,
  phonetic_en TEXT,
  phonetic_ko TEXT,
  phonetic_tl TEXT,
  phonetic_th TEXT,
  phonetic_vi TEXT,
  phonetic_ja TEXT,
  image_url TEXT,
  image_source VARCHAR(50) DEFAULT 'manual',
  image_prompt TEXT,
  tts_audio_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Ensure lesson_id column exists on public.study_vocabularies
ALTER TABLE public.study_vocabularies
  ADD COLUMN IF NOT EXISTS lesson_id UUID REFERENCES public.ai_lessons(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 0;

-- 4. Enable RLS and Grant Permissions
ALTER TABLE public.ai_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_vocabularies ENABLE ROW LEVEL SECURITY;

GRANT ALL ON public.ai_lessons TO anon, authenticated, service_role, postgres;
GRANT ALL ON public.study_vocabularies TO anon, authenticated, service_role, postgres;

DROP POLICY IF EXISTS "Public ai_lessons read access" ON public.ai_lessons;
CREATE POLICY "Public ai_lessons read access" ON public.ai_lessons FOR SELECT TO authenticated, anon USING (true);

DROP POLICY IF EXISTS "Public study_vocabularies read access" ON public.study_vocabularies;
CREATE POLICY "Public study_vocabularies read access" ON public.study_vocabularies FOR SELECT TO authenticated, anon USING (true);

-- 5. Seed 10 Lessons into public.ai_lessons
INSERT INTO public.ai_lessons (id, user_id, title, title_ko, title_en, description, description_ko, description_en, image_url, ai_caption)
VALUES
  ('c0000000-0000-0000-0000-000000000001', NULL, 'Lesson 1: Greetings & Me', '인사와 나', 'Greetings & Me', 'Basic Greetings & Self', '기초 인사와 자기소개', 'Basic Greetings & Self', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c', 'Greetings'),
  ('c0000000-0000-0000-0000-000000000002', NULL, 'Lesson 2: Family', '가족', 'Family', 'Family Words', '가족 단어', 'Family Words', 'https://images.unsplash.com/photo-1511895426328-dc8714191300', 'Family'),
  ('c0000000-0000-0000-0000-000000000003', NULL, 'Lesson 3: Home', '집과 사물', 'Home', 'Home & Objects', '집 및 주변 사물', 'Home & Objects', 'https://images.unsplash.com/photo-1513694203232-719a280e022f', 'Home'),
  ('c0000000-0000-0000-0000-000000000004', NULL, 'Lesson 4: Food', '음식', 'Food', 'Food & Drinks', '음식 및 음료', 'Food & Drinks', 'https://images.unsplash.com/photo-1498837167922-ddd27525d352', 'Food'),
  ('c0000000-0000-0000-0000-000000000005', NULL, 'Lesson 5: Actions', '기초 일상 행동', 'Actions', 'Daily Actions', '기초 일상 행동 10선', 'Daily Actions', 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8', 'Actions'),
  ('c0000000-0000-0000-0000-000000000006', NULL, 'Lesson 6: Animals', '동물', 'Animals', 'Animal Names', '동물 이름', 'Animal Names', 'https://images.unsplash.com/photo-1543466835-00a7907e9de1', 'Animals'),
  ('c0000000-0000-0000-0000-000000000007', NULL, 'Lesson 7: Colors', '색깔', 'Colors', 'Basic Colors', '기본 색깔 표현', 'Basic Colors', 'https://images.unsplash.com/photo-1502691876148-a84978e59af8', 'Colors'),
  ('c0000000-0000-0000-0000-000000000008', NULL, 'Lesson 8: Places', '주변 장소', 'Places', 'Common Places', '자주 가는 장소', 'Common Places', 'https://images.unsplash.com/photo-1519501025264-65ba15a82390', 'Places'),
  ('c0000000-0000-0000-0000-000000000009', NULL, 'Lesson 9: Travel', '여행 필수', 'Travel', 'Travel Essentials', '여행 필수 단어', 'Travel Essentials', 'https://images.unsplash.com/photo-1488646953014-85cb44e25828', 'Travel'),
  ('c0000000-0000-0000-0000-000000000010', NULL, 'Lesson 10: Feelings', '감정과 상태', 'Feelings', 'Feelings & States', '기분 및 상태 표현', 'Feelings & States', 'https://images.unsplash.com/photo-1499209974431-9dac3ada00d7', 'Feelings')
ON CONFLICT (id) DO UPDATE SET
  title_ko = EXCLUDED.title_ko,
  title_en = EXCLUDED.title_en,
  description_ko = EXCLUDED.description_ko,
  description_en = EXCLUDED.description_en;

INSERT INTO public.ai_lessons (id, user_id, title, title_ko, title_en, description, description_ko, description_en, image_url, ai_caption)
VALUES ('11111111-1111-1111-1111-111111111111', NULL, 'Beginner Daily Actions', '기초 일상 행동', 'Beginner Daily Actions', 'Daily Actions', '기초 일상 행동 10선', 'Daily Actions', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c', 'Daily Actions')
ON CONFLICT (id) DO UPDATE SET title_ko = EXCLUDED.title_ko;

-- 6. Seed Vocabularies into public.study_vocabularies
INSERT INTO public.study_vocabularies (id, lesson_id, concept_code, category, difficulty_level, display_order, word_en, word_ko, word_tl, example_en, example_ko, example_tl, phonetic_en, phonetic_ko, phonetic_tl) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'hello', 'greetings', 'beginner', 1, 'hello', '안녕', 'kumusta', 'Hello! How are you doing today?', '안녕하세요! 오늘 어떻게 지내세요?', 'Kumusta ka ngayon?', '[həˈləʊ]', '[안녕]', '[ku-mus-ta]'),
  ('a0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 'bye', 'greetings', 'beginner', 2, 'bye', '잘 가', 'paalam', 'Bye! See you tomorrow.', '잘 가! 내일 봐.', 'Paalam na muna sa iyo.', '[baɪ]', '[잘 가]', '[pa-a-lam]'),
  ('a0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000001', 'i', 'greetings', 'beginner', 3, 'i', '나', 'ako', 'I am happy today.', '나는 오늘 기쁘다.', 'Ako ay masaya ngayon.', '[aɪ]', '[나]', '[a-ko]'),
  ('a0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000001', 'you', 'greetings', 'beginner', 4, 'you', '너', 'ikaw', 'You are my dear partner.', '너는 나의 소중한 연인이다.', 'Ikaw ang aking mahal.', '[juː]', '[너]', '[i-kaw]'),
  ('a0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000001', 'name', 'greetings', 'beginner', 5, 'name', '이름', 'pangalan', 'What is your name?', '당신의 이름은 무엇인가요?', 'Ano ang iyong pangalan?', '[neɪm]', '[이름]', '[pa-nga-lan]'),
  ('a0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000001', 'friend', 'greetings', 'beginner', 6, 'friend', '친구', 'kaibigan', 'We are best friends.', '우리는 베스트 친구이다.', 'Mabuting kaibigan kita.', '[frend]', '[친구]', '[ka-i-bi-gan]'),
  ('a0000000-0000-0000-0000-000000000007', 'c0000000-0000-0000-0000-000000000001', 'happy', 'greetings', 'beginner', 7, 'happy', '행복한', 'masaya', 'I am happy together with you.', '너와 함께 있어서 행복해.', 'Masaya ako kasama ka.', '[ˈhæpi]', '[행복한]', '[ma-sa-ya]'),
  ('a0000000-0000-0000-0000-000000000008', 'c0000000-0000-0000-0000-000000000001', 'love', 'greetings', 'beginner', 8, 'love', '사랑', 'pag-ibig', 'Love makes life wonderful.', '사랑은 삶을 아름답게 만든다.', 'Ang pag-ibig ay maganda.', '[lʌv]', '[사랑]', '[pag-i-big]'),
  ('a0000000-0000-0000-0000-000000000009', 'c0000000-0000-0000-0000-000000000001', 'like', 'greetings', 'beginner', 9, 'like', '좋아하다', 'gusto', 'I like spending time with you.', '너와 시간 보내는 것이 좋아.', 'Gusto kita nang sobra.', '[laɪk]', '[좋아하다]', '[gus-to]'),
  ('a0000000-0000-0000-0000-000000000010', 'c0000000-0000-0000-0000-000000000001', 'smile', 'greetings', 'beginner', 10, 'smile', '미소', 'ngiti', 'Your smile warms my heart.', '당신의 미소가 내 마음을 따뜻하게 해요.', 'Maganda ang iyong ngiti.', '[smaɪl]', '[미소]', '[ngi-ti]'),

  ('a0000000-0000-0000-0000-000000000011', 'c0000000-0000-0000-0000-000000000002', 'family', 'family', 'beginner', 1, 'family', '가족', 'pamilya', 'I love my warm family.', '나는 따뜻한 내 가족을 사랑한다.', 'Mahal ko ang aking pamilya.', '[ˈfæməli]', '[가족]', '[pa-mil-ya]'),
  ('a0000000-0000-0000-0000-000000000012', 'c0000000-0000-0000-0000-000000000002', 'mother', 'family', 'beginner', 2, 'mother', '어머니', 'ina', 'My mother cooks delicious food.', '우리 어머니는 맛있는 음식을 만든다.', 'Mabait ang aking ina.', '[ˈmʌðər]', '[어머니]', '[i-na]'),
  ('a0000000-0000-0000-0000-000000000013', 'c0000000-0000-0000-0000-000000000002', 'father', 'family', 'beginner', 3, 'father', '아버지', 'ama', 'My father is hardworking.', '우리 아버지는 근면하시다.', 'Masipag ang aking ama.', '[ˈfɑːðər]', '[아버지]', '[a-ma]'),
  ('a0000000-0000-0000-0000-000000000014', 'c0000000-0000-0000-0000-000000000002', 'baby', 'family', 'beginner', 4, 'baby', '아기', 'sanggol', 'The cute baby is sleeping.', '귀여운 아기가 자고 있다.', 'Natutulog ang cute na sanggol.', '[ˈbeɪbi]', '[아기]', '[sang-gol]'),
  ('a0000000-0000-0000-0000-000000000015', 'c0000000-0000-0000-0000-000000000002', 'brother', 'family', 'beginner', 5, 'brother', '형제/남동생', 'kapatid na lalaki', 'My brother plays games with me.', '형제가 나와 게임을 한다.', 'Mabuti ang aking kapatid na lalaki.', '[ˈbrʌðər]', '[브라더]', '[ka-pa-tid na la-la-ki]'),
  ('a0000000-0000-0000-0000-000000000016', 'c0000000-0000-0000-0000-000000000002', 'sister', 'family', 'beginner', 6, 'sister', '자매/여동생', 'kapatid na babae', 'My sister is very kind.', '내 자매는 매우 친절하다.', 'Maganda ang aking kapatid na babae.', '[ˈsɪstər]', '[시스터]', '[ka-pa-tid na ba-ba-e]'),
  ('a0000000-0000-0000-0000-000000000017', 'c0000000-0000-0000-0000-000000000002', 'grandma', 'family', 'beginner', 7, 'grandma', '할머니', 'lola', 'Grandma tells interesting stories.', '할머니께서 흥미로운 이야기를 해주신다.', 'Nagluluto si lola ng masarap.', '[ˈɡrænmɑː]', '[할머니]', '[lo-la]'),
  ('a0000000-0000-0000-0000-000000000018', 'c0000000-0000-0000-0000-000000000002', 'grandpa', 'family', 'beginner', 8, 'grandpa', '할아버지', 'lolo', 'Grandpa loves walking in park.', '할아버지께서는 공원 산책을 좋아하신다.', 'Mabait ang aking lolo.', '[ˈɡrænpɑː]', '[할아버지]', '[lo-lo]'),
  ('a0000000-0000-0000-0000-000000000019', 'c0000000-0000-0000-0000-000000000002', 'son', 'family', 'beginner', 9, 'son', '아들', 'anak na lalaki', 'My son studies hard.', '내 아들은 열심히 공부한다.', 'Nagaaral ang aking anak na lalaki.', '[sʌn]', '[아들]', '[a-nak na la-la-ki]'),
  ('a0000000-0000-0000-0000-000000000020', 'c0000000-0000-0000-0000-000000000002', 'daughter', 'family', 'beginner', 10, 'daughter', '딸', 'anak na babae', 'My daughter sings wonderfully.', '내 딸은 노랫소리가 훌륭하다.', 'Mabait ang aking anak na babae.', '[ˈdɔːtər]', '[딸]', '[a-nak na ba-ba-e]'),

  ('a0000000-0000-0000-0000-000000000021', 'c0000000-0000-0000-0000-000000000003', 'house', 'home', 'beginner', 1, 'house', '집', 'bahay', 'Our house is clean and cozy.', '우리 집은 깨끗하고 아늑하다.', 'Malinis ang aming bahay.', '[haʊs]', '[집]', '[ba-hay]'),
  ('a0000000-0000-0000-0000-000000000022', 'c0000000-0000-0000-0000-000000000003', 'room', 'home', 'beginner', 2, 'room', '방', 'silid', 'My room is bright.', '내 방은 밝다.', 'Malaki ang aking silid.', '[ruːm]', '[룸]', '[si-lid]'),
  ('a0000000-0000-0000-0000-000000000023', 'c0000000-0000-0000-0000-000000000003', 'door', 'home', 'beginner', 3, 'door', '문', 'pinto', 'Close the front door please.', '현관문을 닫아주세요.', 'Isara mo ang pinto.', '[dɔːr]', '[도어]', '[pin-to]'),
  ('a0000000-0000-0000-0000-000000000024', 'c0000000-0000-0000-0000-000000000003', 'window', 'home', 'beginner', 4, 'window', '창문', 'bintana', 'Open the window for fresh air.', '환기를 위해 창문을 열어라.', 'Buksan mo ang bintana.', '[ˈwɪndəʊ]', '[윈도우]', '[bin-ta-na]'),
  ('a0000000-0000-0000-0000-000000000025', 'c0000000-0000-0000-0000-000000000003', 'bed', 'home', 'beginner', 5, 'bed', '침대', 'kama', 'The soft bed is comfortable.', '부드러운 침대가 편안하다.', 'Malambot ang aking kama.', '[bed]', '[침대]', '[ka-ma]'),
  ('a0000000-0000-0000-0000-000000000026', 'c0000000-0000-0000-0000-000000000003', 'chair', 'home', 'beginner', 6, 'chair', '의자', 'upuan', 'Sit on the comfortable chair.', '편안한 의자에 앉으세요.', 'Umupo ka sa upuan.', '[tʃer]', '[체어]', '[u-pu-an]'),
  ('a0000000-0000-0000-0000-000000000027', 'c0000000-0000-0000-0000-000000000003', 'table', 'home', 'beginner', 7, 'table', '탁자/식탁', 'lamesa', 'Dinner is set on table.', '식탁에 저녁이 차려져 있다.', 'Malinis ang lamesa.', '[ˈteɪbl]', '[테이블]', '[la-me-sa]'),
  ('a0000000-0000-0000-0000-000000000028', 'c0000000-0000-0000-0000-000000000003', 'lamp', 'home', 'beginner', 8, 'lamp', '스탠드 조명', 'ilawan', 'Turn on night desk lamp.', '야간 책상 조명을 켜세요.', 'Maliwanag ang ilawan.', '[læmp]', '[램프]', '[i-la-wan]'),
  ('a0000000-0000-0000-0000-000000000029', 'c0000000-0000-0000-0000-000000000003', 'key', 'home', 'beginner', 9, 'key', '열쇠', 'susi', 'I lost my house key.', '나는 집 열쇠를 잃어버렸다.', 'Nasaan ang susi?', '[kiː]', '[키]', '[su-si]'),
  ('a0000000-0000-0000-0000-000000000030', 'c0000000-0000-0000-0000-000000000003', 'phone', 'home', 'beginner', 10, 'phone', '전화기', 'telepono', 'Answer the calling phone.', '걸려오는 전화를 받으세요.', 'Gamitin mo ang telepono.', '[foʊn]', '[폰]', '[te-le-po-no]'),

  ('a0000000-0000-0000-0000-000000000041', 'c0000000-0000-0000-0000-000000000004', 'food', 'food', 'beginner', 1, 'food', '음식', 'pagkain', 'I love good food.', '나는 맛있는 음식을 좋아한다.', 'Gusto ko ng masarap na pagkain.', '[fuːd]', '[푸드]', '[pag-ka-in]'),
  ('a0000000-0000-0000-0000-000000000042', 'c0000000-0000-0000-0000-000000000004', 'rice', 'food', 'beginner', 2, 'rice', '밥', 'kanin', 'We eat rice every day.', '우리는 매일 밥을 먹는다.', 'Kumakain kami ng kanin araw-araw.', '[raɪs]', '[라이스]', '[ka-nin]'),
  ('a0000000-0000-0000-0000-000000000043', 'c0000000-0000-0000-0000-000000000004', 'bread', 'food', 'beginner', 3, 'bread', '빵', 'tinapay', 'Fresh bread is delicious.', '갓 구운 빵은 맛있다.', 'Masarap ang bagong tinapay.', '[bred]', '[브레드]', '[ti-na-pay]'),
  ('a0000000-0000-0000-0000-000000000044', 'c0000000-0000-0000-0000-000000000004', 'apple', 'food', 'beginner', 4, 'apple', '사과', 'mansanas', 'An apple a day is good for health.', '하루 사과 한 개는 건강에 좋다.', 'Ang mansanas ay mabuti sa kalusugan.', '[ˈæpl]', '[애플]', '[man-sa-nas]'),
  ('a0000000-0000-0000-0000-000000000045', 'c0000000-0000-0000-0000-000000000004', 'banana', 'food', 'beginner', 5, 'banana', '바나나', 'saging', 'Monkeys like bananas.', '원숭이는 바나나를 좋아한다.', 'Gusto ng unggoy ang saging.', '[bəˈnænə]', '[바나나]', '[sa-ging]'),
  ('a0000000-0000-0000-0000-000000000046', 'c0000000-0000-0000-0000-000000000004', 'egg', 'food', 'beginner', 6, 'egg', '계란', 'itlog', 'I eat a boiled egg.', '나는 삶은 계란을 먹는다.', 'Kumakain ako ng pinakukulang itlog.', '[eɡ]', '[에그]', '[it-log]'),
  ('a0000000-0000-0000-0000-000000000047', 'c0000000-0000-0000-0000-000000000004', 'milk', 'food', 'beginner', 7, 'milk', '우유', 'gatas', 'Drink a glass of warm milk.', '따뜻한 우유 한 잔을 마셔라.', 'Uminom ng isang basong mainit na gatas.', '[mɪlk]', '[밀크]', '[ga-tas]'),
  ('a0000000-0000-0000-0000-000000000048', 'c0000000-0000-0000-0000-000000000004', 'water', 'food', 'beginner', 8, 'water', '물', 'tubig', 'Please give me cold water.', '시원한 물 좀 주세요.', 'Bigyan mo ako ng malamig na tubig.', '[ˈwɔːtər]', '[워터]', '[tu-big]'),
  ('a0000000-0000-0000-0000-000000000049', 'c0000000-0000-0000-0000-000000000004', 'cake', 'food', 'beginner', 9, 'cake', '케이크', 'cake', 'We prepare a birthday cake.', '우리는 생일 케이크를 준비한다.', 'Naghahanda kami ng cake sa kaarawan.', '[keɪk]', '[케이크]', '[keyk]'),
  ('a0000000-0000-0000-0000-000000000050', 'c0000000-0000-0000-0000-000000000005', 'sit', 'actions', 'beginner', 1, 'sit', '앉다', 'umupo', 'Sit down on the chair.', '의자에 앉으세요.', 'Umupo ka sa upuan.', '[sɪt]', '[싯]', '[u-mu-po]'),

  ('a0000000-0000-0000-0000-000000000051', 'c0000000-0000-0000-0000-000000000005', 'stand', 'actions', 'beginner', 2, 'stand', '서다', 'tumayo', 'Please stand up together.', '모두 일어나 주세요.', 'Tumayo tayong lahat.', '[stænd]', '[스탠드]', '[tu-ma-yo]'),
  ('a0000000-0000-0000-0000-000000000052', 'c0000000-0000-0000-0000-000000000005', 'write', 'actions', 'beginner', 3, 'write', '쓰다', 'magsulat', 'I write a letter to my partner.', '나는 연인에게 편지를 쓴다.', 'Nagsusulat ako ng liham sa aking kasama.', '[raɪt]', '[라이트]', '[mag-su-lat]'),
  ('a0000000-0000-0000-0000-000000000053', 'c0000000-0000-0000-0000-000000000005', 'play', 'actions', 'beginner', 4, 'play', '놀다', 'maglaro', 'Children play in the yard.', '아이들이 마당에서 논다.', 'Naglalaro ang mga bata sa bakuran.', '[pleɪ]', '[플레이]', '[mag-la-ro]'),
  ('a0000000-0000-0000-0000-000000000054', 'c0000000-0000-0000-0000-000000000006', 'dog', 'animals', 'beginner', 1, 'dog', '개', 'aso', 'The cute dog barks loudly.', '귀여운 개가 씩씩하게 짖는다.', 'Tumatahol ang cute na aso.', '[dɔːɡ]', '[도그]', '[a-so]'),
  ('a0000000-0000-0000-0000-000000000055', 'c0000000-0000-0000-0000-000000000006', 'cat', 'animals', 'beginner', 2, 'cat', '고양이', 'pusa', 'My cat is sleeping on the sofa.', '내 고양이는 소파 위에서 자고 있다.', 'Natutulog ang pusa ko sa sopa.', '[kæt]', '[캣]', '[pu-sa]'),
  ('a0000000-0000-0000-0000-000000000056', 'c0000000-0000-0000-0000-000000000006', 'bird', 'animals', 'beginner', 3, 'bird', '새', 'ibon', 'A blue bird sings on the tree.', '파란 새가 나무 위에서 노래한다.', 'Kumakanta ang asul na ibon sa puno.', '[bɜːrd]', '[버드]', '[i-bon]'),
  ('a0000000-0000-0000-0000-000000000057', 'c0000000-0000-0000-0000-000000000006', 'fish', 'animals', 'beginner', 4, 'fish', '물고기', 'isda', 'Fish swim freely in the lake.', '물고기가 호수에서 자유롭게 수영한다.', 'Lumaloy ang isda sa lawa.', '[fɪʃ]', '[피시]', '[is-da]'),
  ('a0000000-0000-0000-0000-000000000058', 'c0000000-0000-0000-0000-000000000006', 'horse', 'animals', 'beginner', 5, 'horse', '말', 'kabayo', 'The horse runs fast across field.', '말이 들판을 빠르게 달린다.', 'Mabilis na tumatakbo ang kabayo sa bukid.', '[hɔːrs]', '[호스]', '[ka-ba-yo]'),
  ('a0000000-0000-0000-0000-000000000059', 'c0000000-0000-0000-0000-000000000006', 'cow', 'animals', 'beginner', 6, 'cow', '소', 'baka', 'Cows give us fresh milk.', '소는 우리에게 신선한 우유를 준다.', 'Nagbibigay ang baka ng sariwang gatas.', '[kaʊ]', '[카우]', '[ba-ka]'),
  ('a0000000-0000-0000-0000-000000000060', 'c0000000-0000-0000-0000-000000000006', 'pig', 'animals', 'beginner', 7, 'pig', '돼지', 'baboy', 'The little pig is eating grass.', '작은 돼지가 풀을 먹고 있다.', 'Kumakain ng damo ang maliit na baboy.', '[pɪɡ]', '[피그]', '[ba-boy]'),

  ('a0000000-0000-0000-0000-000000000061', 'c0000000-0000-0000-0000-000000000006', 'lion', 'animals', 'beginner', 8, 'lion', '사자', 'leon', 'The lion is the king of beasts.', '사자는 백수의 왕이다.', 'Ang leon ay hari ng mga hayop.', '[ˈlaɪən]', '[라이언]', '[le-on]'),
  ('a0000000-0000-0000-0000-000000000062', 'c0000000-0000-0000-0000-000000000006', 'monkey', 'animals', 'beginner', 9, 'monkey', '원숭이', 'unggoy', 'The monkey jumps on branches.', '원숭이가 나뭇가지를 뛰어다닌다.', 'Tumatalon ang unggoy sa sanga.', '[ˈmʌŋki]', '[멍키]', '[ung-goy]'),
  ('a0000000-0000-0000-0000-000000000063', 'c0000000-0000-0000-0000-000000000006', 'rabbit', 'animals', 'beginner', 10, 'rabbit', '토끼', 'kuneho', 'The white rabbit eats carrots.', '하얀 토끼가 당근을 먹는다.', 'Kumakain ng karot ang puting kuneho.', '[ˈræbɪt]', '[래빗]', '[ku-ne-ho]'),
  ('a0000000-0000-0000-0000-000000000064', 'c0000000-0000-0000-0000-000000000007', 'red', 'colors', 'beginner', 1, 'red', '빨간색', 'pula', 'She wears a bright red dress.', '그녀는 밝은 빨간색 드레스를 입는다.', 'Nakasuot siya ng pulang damit.', '[red]', '[레드]', '[pu-la]'),
  ('a0000000-0000-0000-0000-000000000065', 'c0000000-0000-0000-0000-000000000007', 'blue', 'colors', 'beginner', 2, 'blue', '파란색', 'asul', 'The clear sky is deep blue.', '맑은 하늘이 깊은 파란색이다.', 'Ang malinaw na langit ay asul.', '[bluː]', '[블루]', '[a-sul]'),
  ('a0000000-0000-0000-0000-000000000066', 'c0000000-0000-0000-0000-000000000007', 'green', 'colors', 'beginner', 3, 'green', '초록색', 'berde', 'Leaves turn green in spring.', '봄에는 나뭇잎이 초록색이 된다.', 'Nagiging berde ang mga dahon.', '[ɡriːn]', '[그린]', '[ber-de]'),
  ('a0000000-0000-0000-0000-000000000067', 'c0000000-0000-0000-0000-000000000007', 'yellow', 'colors', 'beginner', 4, 'yellow', '노란색', 'dilaw', 'Sunflowers are bright yellow.', '해바라기는 밝은 노란색이다.', 'Ang mga sunflower ay dilaw.', '[ˈjeləʊ]', '[옐로우]', '[di-law]'),
  ('a0000000-0000-0000-0000-000000000068', 'c0000000-0000-0000-0000-000000000007', 'black', 'colors', 'beginner', 5, 'black', '검은색', 'itim', 'He has stylish black shoes.', '그는 멋진 검은색 구두를 신는다.', 'Mayroon siyang itim na sapatos.', '[blæk]', '[블랙]', '[i-tim]'),
  ('a0000000-0000-0000-0000-000000000069', 'c0000000-0000-0000-0000-000000000007', 'white', 'colors', 'beginner', 6, 'white', '하얀색', 'puti', 'Snow falls pure white.', '눈이 순백색으로 내린다.', 'Bumabagsak ang puting niyebe.', '[waɪt]', '[화이트]', '[pu-ti]'),
  ('a0000000-0000-0000-0000-000000000070', 'c0000000-0000-0000-0000-000000000007', 'pink', 'colors', 'beginner', 7, 'pink', '분홍색', 'rosas', 'Cherry blossoms are soft pink.', '벚꽃은 은은한 분홍색이다.', 'Ang mga cherry blossom ay rosas.', '[pɪŋk]', '[핑크]', '[ro-sas]'),

  ('a0000000-0000-0000-0000-000000000071', 'c0000000-0000-0000-0000-000000000007', 'orange', 'colors', 'beginner', 8, 'orange', '주황색', 'kahel', 'The sunset shows orange light.', '석양이 주황색 빛을 띤다.', 'Ang paglubog ng araw ay kahel.', '[ˈɔːrɪndʒ]', '[오렌지]', '[ka-hel]'),
  ('a0000000-0000-0000-0000-000000000072', 'c0000000-0000-0000-0000-000000000007', 'purple', 'colors', 'beginner', 9, 'purple', '보라색', 'ube', 'Grapes have rich purple color.', '포도는 진한 보라색이다.', 'Ang mga ubas ay kulay ube.', '[ˈpɜːrpl]', '[퍼플]', '[u-be]'),
  ('a0000000-0000-0000-0000-000000000073', 'c0000000-0000-0000-0000-000000000007', 'brown', 'colors', 'beginner', 10, 'brown', '갈색', 'kayumanggi', 'The teddy bear is soft brown.', '곰 인형은 부드러운 갈색이다.', 'Ang teddy bear ay kayumanggi.', '[braʊn]', '[브라운]', '[ka-yu-mang-gi]'),
  ('a0000000-0000-0000-0000-000000000074', 'c0000000-0000-0000-0000-000000000008', 'school', 'places', 'beginner', 1, 'school', '학교', 'paaralan', 'Students study hard at school.', '학생들이 학교에서 열공한다.', 'Nagaaral ang mga bata sa paaralan.', '[skuːl]', '[스쿨]', '[pa-a-ra-lan]'),
  ('a0000000-0000-0000-0000-000000000075', 'c0000000-0000-0000-0000-000000000008', 'home', 'places', 'beginner', 2, 'home', '집', 'bahay', 'Home is where love lives.', '집은 사랑이 머무는 곳이다.', 'Ang bahay ay naroon ang pagmamahal.', '[hoʊm]', '[홈]', '[ba-hay]'),
  ('a0000000-0000-0000-0000-000000000076', 'c0000000-0000-0000-0000-000000000008', 'store', 'places', 'beginner', 3, 'store', '상점/가게', 'tindahan', 'Buy snacks at the store.', '가게에서 간식을 사다.', 'Bumili ka ng pagkain sa tindahan.', '[stɔːr]', '[스토어]', '[tin-da-han]'),
  ('a0000000-0000-0000-0000-000000000077', 'c0000000-0000-0000-0000-000000000008', 'hospital', 'places', 'beginner', 4, 'hospital', '병원', 'ospital', 'Doctors care patients at hospital.', '의사들이 병원에서 환자를 보살핀다.', 'Nasa ospital ang doktor.', '[ˈhɑːspɪtl]', '[하스피털]', '[os-pi-tal]'),
  ('a0000000-0000-0000-0000-000000000078', 'c0000000-0000-0000-0000-000000000008', 'park', 'places', 'beginner', 5, 'park', '공원', 'parke', 'Children run happily in park.', '아이들이 공원에서 즐겁게 뛴다.', 'Masaya ang mga bata sa parke.', '[pɑːrk]', '[파크]', '[par-ke]'),
  ('a0000000-0000-0000-0000-000000000079', 'c0000000-0000-0000-0000-000000000008', 'bank', 'places', 'beginner', 6, 'bank', '은행', 'bangko', 'Deposit savings in the bank.', '은행에 저축금을 예금하세요.', 'Nasa bangko ang pera.', '[bæŋk]', '[뱅크]', '[bang-ko]'),
  ('a0000000-0000-0000-0000-000000000080', 'c0000000-0000-0000-0000-000000000008', 'restaurant', 'places', 'beginner', 7, 'restaurant', '식당/레스토랑', 'kainan', 'Eat dinner at nice restaurant.', '근사한 식당에서 저녁을 먹는다.', 'Kumain tayo sa kainan.', '[ˈrestərɑːnt]', '[레스토랑]', '[ka-i-nan]'),

  ('a0000000-0000-0000-0000-000000000081', 'c0000000-0000-0000-0000-000000000008', 'airport', 'places', 'beginner', 8, 'airport', '공항', 'paliparan', 'We arrive at the international airport.', '우리는 국제공항에 도착한다.', 'Nasa paliparan ang eroplano.', '[ˈerpɔːrt]', '[에어포트]', '[pa-li-pa-ran]'),
  ('a0000000-0000-0000-0000-000000000082', 'c0000000-0000-0000-0000-000000000008', 'hotel', 'places', 'beginner', 9, 'hotel', '호텔', 'hotele', 'Stay at a comfortable hotel.', '편안한 호텔에 머무르다.', 'Masarap matulog sa hotele.', '[hoʊˈtel]', '[호텔]', '[ho-te-le]'),
  ('a0000000-0000-0000-0000-000000000083', 'c0000000-0000-0000-0000-000000000008', 'beach', 'places', 'beginner', 10, 'beach', '해변/바닷가', 'baybayin', 'Walk along sunny sandy beach.', '햇살 가득한 모래 해변을 걷는다.', 'Maganda ang baybayin.', '[biːtʃ]', '[비치]', '[bay-ba-yin]'),
  ('a0000000-0000-0000-0000-000000000084', 'c0000000-0000-0000-0000-000000000009', 'car', 'travel', 'beginner', 1, 'car', '자동차', 'kotse', 'Drive a fast red car.', '빠른 빨간 자동차를 운전한다.', 'Maganda ang pulang kotse.', '[kɑːr]', '[카]', '[kot-se]'),
  ('a0000000-0000-0000-0000-000000000085', 'c0000000-0000-0000-0000-000000000009', 'bus', 'travel', 'beginner', 2, 'bus', '버스', 'bus', 'Take the morning city bus.', '아침 시내 버스를 타다.', 'Sumakay ka sa bus.', '[bʌs]', '[버스]', '[bas]'),
  ('a0000000-0000-0000-0000-000000000086', 'c0000000-0000-0000-0000-000000000009', 'train', 'travel', 'beginner', 3, 'train', '기차', 'tren', 'The train departs on time.', '기차가 제시간에 출발한다.', 'Mabilis ang tren.', '[treɪn]', '[트레인]', '[tren]'),
  ('a0000000-0000-0000-0000-000000000087', 'c0000000-0000-0000-0000-000000000009', 'plane', 'travel', 'beginner', 4, 'plane', '비행기', 'eroplano', 'The airplane flies high in sky.', '비행기가 하늘 높이 날아간다.', 'Mataas ang eroplano.', '[pleɪn]', '[플레인]', '[e-ro-pla-no]'),
  ('a0000000-0000-0000-0000-000000000088', 'c0000000-0000-0000-0000-000000000009', 'ship', 'travel', 'beginner', 5, 'ship', '배/선박', 'barko', 'A large ship sails ocean.', '대한 선박이 바다를 항해한다.', 'Malaki ang barko.', '[ʃɪp]', '[쉽]', '[bar-ko]'),
  ('a0000000-0000-0000-0000-000000000089', 'c0000000-0000-0000-0000-000000000009', 'road', 'travel', 'beginner', 6, 'road', '도로/길', 'daan', 'Cross the wide quiet road.', '넓고 조용한 도로를 건너다.', 'Malapad ang daan.', '[roʊd]', '[로드]', '[da-an]'),
  ('a0000000-0000-0000-0000-000000000090', 'c0000000-0000-0000-0000-000000000009', 'map', 'travel', 'beginner', 7, 'map', '지도', 'mapa', 'Check the travel route on map.', '지도에서 여행 경로를 확인한다.', 'Tingnan mo ang mapa.', '[mæp]', '[맵]', '[ma-pa]'),

  ('a0000000-0000-0000-0000-000000000091', 'c0000000-0000-0000-0000-000000000009', 'bag', 'travel', 'beginner', 8, 'bag', '가방', 'bag', 'Pack travel heavy backpack bag.', '여행 무거운 배낭 가방을 싸다.', 'Dalahin mo ang bag.', '[bæɡ]', '[백]', '[bag]'),
  ('a0000000-0000-0000-0000-000000000092', 'c0000000-0000-0000-0000-000000000009', 'ticket', 'travel', 'beginner', 9, 'ticket', '표/티켓', 'tiket', 'Show your flight boarding ticket.', '탑승 티켓을 제시하세요.', 'Hawak mo ang tiket.', '[ˈtɪkɪt]', '[티켓]', '[ti-ket]'),
  ('a0000000-0000-0000-0000-000000000093', 'c0000000-0000-0000-0000-000000000009', 'camera', 'travel', 'beginner', 10, 'camera', '카메라', 'kamera', 'Take photos with digital camera.', '디지털 카메라인 사진을 찍다.', 'Kunan mo ng litrato gamit ang kamera.', '[ˈkæmrə]', '[카메라]', '[ka-me-ra]'),
  ('a0000000-0000-0000-0000-000000000094', 'c0000000-0000-0000-0000-000000000010', 'good', 'feelings', 'beginner', 1, 'good', '좋은/훌륭한', 'mabuti', 'Feel good in fresh morning.', '상쾌한 아침에 기분이 좋다.', 'Mabuti ang pakiramdam.', '[ɡʊd]', '[굿]', '[ma-bu-ti]'),
  ('a0000000-0000-0000-0000-000000000095', 'c0000000-0000-0000-0000-000000000010', 'bad', 'feelings', 'beginner', 2, 'bad', '나쁜/안좋은', 'masama', 'Not feeling bad today.', '오늘 기분이 나쁘지 않다.', 'Hindi masama ang pakiramdam.', '[bæd]', '[배드]', '[ma-sa-ma]'),
  ('a0000000-0000-0000-0000-000000000096', 'c0000000-0000-0000-0000-000000000010', 'sad', 'feelings', 'beginner', 3, 'sad', '슬픈', 'malungkot', 'Wipe away sad tears.', '슬픈 눈물을 닦아내다.', 'Huwag kang malungkot.', '[sæd]', '[새드]', '[ma-lung-kot]'),
  ('a0000000-0000-0000-0000-000000000097', 'c0000000-0000-0000-0000-000000000010', 'angry', 'feelings', 'beginner', 4, 'angry', '화난', 'galit', 'Stay calm don''t get angry.', '화내지 말고 침착하세요.', 'Huwag kang magagalit.', '[ˈæŋɡri]', '[앵그리]', '[ga-lit]'),
  ('a0000000-0000-0000-0000-000000000098', 'c0000000-0000-0000-0000-000000000010', 'tired', 'feelings', 'beginner', 5, 'tired', '피곤한', 'pagod', 'Rest well when feeling tired.', '피곤할 때 잘 쉬어라.', 'Pagod ako ngayon.', '[ˈtaɪərd]', '[타이어드]', '[pa-god]'),
  ('a0000000-0000-0000-0000-000000000099', 'c0000000-0000-0000-0000-000000000010', 'hungry', 'feelings', 'beginner', 6, 'hungry', '배고픈', 'gutom', 'Eat warm food when hungry.', '배고플 때 따뜻한 음식을 먹다.', 'Gutom na ako.', '[ˈhʌŋɡri]', '[헝그리]', '[gu-tom]'),
  ('a0000000-0000-0000-0000-000000000000', 'c0000000-0000-0000-0000-000000000010', 'thirsty', 'feelings', 'beginner', 7, 'thirsty', '목마른', 'nauuhaw', 'Drink water when thirsty.', '목마를 때 물을 마신다.', 'Nauuhaw ako.', '[ˈθɜːrsti]', '[써스티]', '[na-u-u-haw]')
ON CONFLICT (id) DO UPDATE SET
  lesson_id = EXCLUDED.lesson_id,
  display_order = EXCLUDED.display_order;

-- 7. 대표 첫 레슨과 5번 레슨 동사 연결 동기화
UPDATE public.study_vocabularies
SET lesson_id = '11111111-1111-1111-1111-111111111111'
WHERE lesson_id = 'c0000000-0000-0000-0000-000000000005';

-- 8. PostgREST 스키마 캐시 갱신
NOTIFY pgrst, 'reload schema';
