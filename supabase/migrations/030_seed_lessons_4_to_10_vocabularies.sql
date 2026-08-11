-- ============================================================
-- Migration 030: Seed Vocabularies & Mappings for Lessons 4 to 10
-- Languages: English, Korean, Tagalog (en, ko, tl)
-- ============================================================

-- 1. Insert Vocabularies into public.study_vocabularies

-- Lesson 4: Food
INSERT INTO public.study_vocabularies (id, concept_code, category, difficulty_level, word_en, word_ko, word_tl, example_en, example_ko, example_tl, phonetic_en, phonetic_ko, phonetic_tl)
SELECT 'a0000000-0000-0000-0000-000000000041', 'food', 'food', 'beginner', 'food', '음식', 'pagkain', 'I love good food.', '나는 맛있는 음식을 좋아한다.', 'Gusto ko ng masarap na pagkain.', '[fuːd]', '[푸드]', '[pag-ka-in]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'food' OR id = 'a0000000-0000-0000-0000-000000000041');

INSERT INTO public.study_vocabularies (id, concept_code, category, difficulty_level, word_en, word_ko, word_tl, example_en, example_ko, example_tl, phonetic_en, phonetic_ko, phonetic_tl)
SELECT 'a0000000-0000-0000-0000-000000000042', 'rice', 'food', 'beginner', 'rice', '밥', 'kanin', 'We eat rice every day.', '우리는 매일 밥을 먹는다.', 'Kumakain kami ng kanin araw-araw.', '[raɪs]', '[라이스]', '[ka-nin]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'rice' OR id = 'a0000000-0000-0000-0000-000000000042');

INSERT INTO public.study_vocabularies (id, concept_code, category, difficulty_level, word_en, word_ko, word_tl, example_en, example_ko, example_tl, phonetic_en, phonetic_ko, phonetic_tl)
SELECT 'a0000000-0000-0000-0000-000000000043', 'bread', 'food', 'beginner', 'bread', '빵', 'tinapay', 'Fresh bread is delicious.', '갓 구운 빵은 맛있다.', 'Masarap ang bagong tinapay.', '[bred]', '[브레드]', '[ti-na-pay]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'bread' OR id = 'a0000000-0000-0000-0000-000000000043');

INSERT INTO public.study_vocabularies (id, concept_code, category, difficulty_level, word_en, word_ko, word_tl, example_en, example_ko, example_tl, phonetic_en, phonetic_ko, phonetic_tl)
SELECT 'a0000000-0000-0000-0000-000000000044', 'apple', 'food', 'beginner', 'apple', '사과', 'mansanas', 'An apple a day is good for health.', '하루 사과 한 개는 건강에 좋다.', 'Ang mansanas ay mabuti sa kalusugan.', '[ˈæpl]', '[애플]', '[man-sa-nas]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'apple' OR id = 'a0000000-0000-0000-0000-000000000044');

INSERT INTO public.study_vocabularies (id, concept_code, category, difficulty_level, word_en, word_ko, word_tl, example_en, example_ko, example_tl, phonetic_en, phonetic_ko, phonetic_tl)
SELECT 'a0000000-0000-0000-0000-000000000045', 'banana', 'food', 'beginner', 'banana', '바나나', 'saging', 'Monkeys like bananas.', '원숭이는 바나나를 좋아한다.', 'Gusto ng unggoy ang saging.', '[bəˈnænə]', '[바나나]', '[sa-ging]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'banana' OR id = 'a0000000-0000-0000-0000-000000000045');

INSERT INTO public.study_vocabularies (id, concept_code, category, difficulty_level, word_en, word_ko, word_tl, example_en, example_ko, example_tl, phonetic_en, phonetic_ko, phonetic_tl)
SELECT 'a0000000-0000-0000-0000-000000000046', 'egg', 'food', 'beginner', 'egg', '계란', 'itlog', 'I eat a boiled egg.', '나는 삶은 계란을 먹는다.', 'Kumakain ako ng pinakukulang itlog.', '[eɡ]', '[에그]', '[it-log]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'egg' OR id = 'a0000000-0000-0000-0000-000000000046');

INSERT INTO public.study_vocabularies (id, concept_code, category, difficulty_level, word_en, word_ko, word_tl, example_en, example_ko, example_tl, phonetic_en, phonetic_ko, phonetic_tl)
SELECT 'a0000000-0000-0000-0000-000000000047', 'milk', 'food', 'beginner', 'milk', '우유', 'gatas', 'Drink a glass of warm milk.', '따뜻한 우유 한 잔을 마셔라.', 'Uminom ng isang basong mainit na gatas.', '[mɪlk]', '[밀크]', '[ga-tas]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'milk' OR id = 'a0000000-0000-0000-0000-000000000047');

INSERT INTO public.study_vocabularies (id, concept_code, category, difficulty_level, word_en, word_ko, word_tl, example_en, example_ko, example_tl, phonetic_en, phonetic_ko, phonetic_tl)
SELECT 'a0000000-0000-0000-0000-000000000048', 'water', 'food', 'beginner', 'water', '물', 'tubig', 'Please give me cold water.', '시원한 물 좀 주세요.', 'Bigyan mo ako ng malamig na tubig.', '[ˈwɔːtər]', '[워터]', '[tu-big]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'water' OR id = 'a0000000-0000-0000-0000-000000000048');

INSERT INTO public.study_vocabularies (id, concept_code, category, difficulty_level, word_en, word_ko, word_tl, example_en, example_ko, example_tl, phonetic_en, phonetic_ko, phonetic_tl)
SELECT 'a0000000-0000-0000-0000-000000000049', 'cake', 'food', 'beginner', 'cake', '케이크', 'cake', 'We prepare a birthday cake.', '우리는 생일 케이크를 준비한다.', 'Naghahanda kami ng cake sa kaarawan.', '[keɪk]', '[케이크]', '[keyk]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'cake' OR id = 'a0000000-0000-0000-0000-000000000049');

-- Lesson 5: Actions
INSERT INTO public.study_vocabularies (id, concept_code, category, difficulty_level, word_en, word_ko, word_tl, example_en, example_ko, example_tl, phonetic_en, phonetic_ko, phonetic_tl)
SELECT 'a0000000-0000-0000-0000-000000000050', 'sit', 'actions', 'beginner', 'sit', '앉다', 'umupo', 'Sit down on the chair.', '의자에 앉으세요.', 'Umupo ka sa upuan.', '[sɪt]', '[싯]', '[u-mu-po]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'sit' OR id = 'a0000000-0000-0000-0000-000000000050');

INSERT INTO public.study_vocabularies (id, concept_code, category, difficulty_level, word_en, word_ko, word_tl, example_en, example_ko, example_tl, phonetic_en, phonetic_ko, phonetic_tl)
SELECT 'a0000000-0000-0000-0000-000000000051', 'stand', 'actions', 'beginner', 'stand', '서다', 'tumayo', 'Please stand up together.', '모두 일어나 주세요.', 'Tumayo tayong lahat.', '[stænd]', '[스탠드]', '[tu-ma-yo]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'stand' OR id = 'a0000000-0000-0000-0000-000000000051');

INSERT INTO public.study_vocabularies (id, concept_code, category, difficulty_level, word_en, word_ko, word_tl, example_en, example_ko, example_tl, phonetic_en, phonetic_ko, phonetic_tl)
SELECT 'a0000000-0000-0000-0000-000000000052', 'write', 'actions', 'beginner', 'write', '쓰다', 'magsulat', 'I write a letter to my partner.', '나는 연인에게 편지를 쓴다.', 'Nagsusulat ako ng liham sa aking kasama.', '[raɪt]', '[라이트]', '[mag-su-lat]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'write' OR id = 'a0000000-0000-0000-0000-000000000052');

INSERT INTO public.study_vocabularies (id, concept_code, category, difficulty_level, word_en, word_ko, word_tl, example_en, example_ko, example_tl, phonetic_en, phonetic_ko, phonetic_tl)
SELECT 'a0000000-0000-0000-0000-000000000053', 'play', 'actions', 'beginner', 'play', '놀다', 'maglaro', 'Children play in the yard.', '아이들이 마당에서 논다.', 'Naglalaro ang mga bata sa bakuran.', '[pleɪ]', '[플레이]', '[mag-la-ro]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'play' OR id = 'a0000000-0000-0000-0000-000000000053');

-- Lesson 6: Animals
INSERT INTO public.study_vocabularies (id, concept_code, category, difficulty_level, word_en, word_ko, word_tl, example_en, example_ko, example_tl, phonetic_en, phonetic_ko, phonetic_tl)
SELECT 'a0000000-0000-0000-0000-000000000054', 'dog', 'animals', 'beginner', 'dog', '개', 'aso', 'The cute dog barks loudly.', '귀여운 개가 씩씩하게 짖는다.', 'Tumatahol ang cute na aso.', '[dɔːɡ]', '[도그]', '[a-so]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'dog' OR id = 'a0000000-0000-0000-0000-000000000054');

INSERT INTO public.study_vocabularies (id, concept_code, category, difficulty_level, word_en, word_ko, word_tl, example_en, example_ko, example_tl, phonetic_en, phonetic_ko, phonetic_tl)
SELECT 'a0000000-0000-0000-0000-000000000055', 'cat', 'animals', 'beginner', 'cat', '고양이', 'pusa', 'My cat is sleeping on the sofa.', '내 고양이는 소파 위에서 자고 있다.', 'Natutulog ang pusa ko sa sopa.', '[kæt]', '[캣]', '[pu-sa]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'cat' OR id = 'a0000000-0000-0000-0000-000000000055');

INSERT INTO public.study_vocabularies (id, concept_code, category, difficulty_level, word_en, word_ko, word_tl, example_en, example_ko, example_tl, phonetic_en, phonetic_ko, phonetic_tl)
SELECT 'a0000000-0000-0000-0000-000000000056', 'bird', 'animals', 'beginner', 'bird', '새', 'ibon', 'A blue bird sings on the tree.', '파란 새가 나무 위에서 노래한다.', 'Kumakanta ang asul na ibon sa puno.', '[bɜːrd]', '[버드]', '[i-bon]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'bird' OR id = 'a0000000-0000-0000-0000-000000000056');

INSERT INTO public.study_vocabularies (id, concept_code, category, difficulty_level, word_en, word_ko, word_tl, example_en, example_ko, example_tl, phonetic_en, phonetic_ko, phonetic_tl)
SELECT 'a0000000-0000-0000-0000-000000000057', 'fish', 'animals', 'beginner', 'fish', '물고기', 'isda', 'Fish swim freely in the lake.', '물고기가 호수에서 자유롭게 수영한다.', 'Lumaloy ang isda sa lawa.', '[fɪʃ]', '[피시]', '[is-da]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'fish' OR id = 'a0000000-0000-0000-0000-000000000057');

INSERT INTO public.study_vocabularies (id, concept_code, category, difficulty_level, word_en, word_ko, word_tl, example_en, example_ko, example_tl, phonetic_en, phonetic_ko, phonetic_tl)
SELECT 'a0000000-0000-0000-0000-000000000058', 'horse', 'animals', 'beginner', 'horse', '말', 'kabayo', 'The horse runs fast across field.', '말이 들판을 빠르게 달린다.', 'Mabilis na tumatakbo ang kabayo sa bukid.', '[hɔːrs]', '[호스]', '[ka-ba-yo]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'horse' OR id = 'a0000000-0000-0000-0000-000000000058');

INSERT INTO public.study_vocabularies (id, concept_code, category, difficulty_level, word_en, word_ko, word_tl, example_en, example_ko, example_tl, phonetic_en, phonetic_ko, phonetic_tl)
SELECT 'a0000000-0000-0000-0000-000000000059', 'cow', 'animals', 'beginner', 'cow', '소', 'baka', 'Cows give us fresh milk.', '소는 우리에게 신선한 우유를 준다.', 'Nagbibigay ang baka ng sariwang gatas.', '[kaʊ]', '[카우]', '[ba-ka]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'cow' OR id = 'a0000000-0000-0000-0000-000000000059');

INSERT INTO public.study_vocabularies (id, concept_code, category, difficulty_level, word_en, word_ko, word_tl, example_en, example_ko, example_tl, phonetic_en, phonetic_ko, phonetic_tl)
SELECT 'a0000000-0000-0000-0000-000000000060', 'pig', 'animals', 'beginner', 'pig', '돼지', 'baboy', 'The little pig is eating grass.', '작은 돼지가 풀을 먹고 있다.', 'Kumakain ng damo ang maliit na baboy.', '[pɪɡ]', '[피그]', '[ba-boy]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'pig' OR id = 'a0000000-0000-0000-0000-000000000060');

INSERT INTO public.study_vocabularies (id, concept_code, category, difficulty_level, word_en, word_ko, word_tl, example_en, example_ko, example_tl, phonetic_en, phonetic_ko, phonetic_tl)
SELECT 'a0000000-0000-0000-0000-000000000061', 'lion', 'animals', 'beginner', 'lion', '사자', 'leon', 'The lion is the king of beasts.', '사자는 백수의 왕이다.', 'Ang leon ay hari ng mga hayop.', '[ˈlaɪən]', '[라이언]', '[le-on]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'lion' OR id = 'a0000000-0000-0000-0000-000000000061');

INSERT INTO public.study_vocabularies (id, concept_code, category, difficulty_level, word_en, word_ko, word_tl, example_en, example_ko, example_tl, phonetic_en, phonetic_ko, phonetic_tl)
SELECT 'a0000000-0000-0000-0000-000000000062', 'monkey', 'animals', 'beginner', 'monkey', '원숭이', 'unggoy', 'The monkey jumps on branches.', '원숭이가 나뭇가지를 뛰어다닌다.', 'Tumatalon ang unggoy sa sanga.', '[ˈmʌŋki]', '[멍키]', '[ung-goy]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'monkey' OR id = 'a0000000-0000-0000-0000-000000000062');

INSERT INTO public.study_vocabularies (id, concept_code, category, difficulty_level, word_en, word_ko, word_tl, example_en, example_ko, example_tl, phonetic_en, phonetic_ko, phonetic_tl)
SELECT 'a0000000-0000-0000-0000-000000000063', 'rabbit', 'animals', 'beginner', 'rabbit', '토끼', 'kuneho', 'The white rabbit eats carrots.', '하얀 토끼가 당근을 먹는다.', 'Kumakain ng karot ang puting kuneho.', '[ˈræbɪt]', '[래빗]', '[ku-ne-ho]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'rabbit' OR id = 'a0000000-0000-0000-0000-000000000063');

-- Lesson 7: Colors
INSERT INTO public.study_vocabularies (id, concept_code, category, difficulty_level, word_en, word_ko, word_tl, example_en, example_ko, example_tl, phonetic_en, phonetic_ko, phonetic_tl)
SELECT 'a0000000-0000-0000-0000-000000000064', 'red', 'colors', 'beginner', 'red', '빨간색', 'pula', 'She wears a bright red dress.', '그녀는 밝은 빨간색 드레스를 입는다.', 'Nakasuot siya ng pulang damit.', '[red]', '[레드]', '[pu-la]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'red' OR id = 'a0000000-0000-0000-0000-000000000064');

INSERT INTO public.study_vocabularies (id, concept_code, category, difficulty_level, word_en, word_ko, word_tl, example_en, example_ko, example_tl, phonetic_en, phonetic_ko, phonetic_tl)
SELECT 'a0000000-0000-0000-0000-000000000065', 'blue', 'colors', 'beginner', 'blue', '파란색', 'asul', 'The clear sky is deep blue.', '맑은 하늘이 깊은 파란색이다.', 'Ang malinaw na langit ay asul.', '[bluː]', '[블루]', '[a-sul]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'blue' OR id = 'a0000000-0000-0000-0000-000000000065');

INSERT INTO public.study_vocabularies (id, concept_code, category, difficulty_level, word_en, word_ko, word_tl, example_en, example_ko, example_tl, phonetic_en, phonetic_ko, phonetic_tl)
SELECT 'a0000000-0000-0000-0000-000000000066', 'green', 'colors', 'beginner', 'green', '초록색', 'berde', 'Leaves turn green in spring.', '봄에는 나뭇잎이 초록색이 된다.', 'Nagiging berde ang mga dahon.', '[ɡriːn]', '[그린]', '[ber-de]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'green' OR id = 'a0000000-0000-0000-0000-000000000066');

INSERT INTO public.study_vocabularies (id, concept_code, category, difficulty_level, word_en, word_ko, word_tl, example_en, example_ko, example_tl, phonetic_en, phonetic_ko, phonetic_tl)
SELECT 'a0000000-0000-0000-0000-000000000067', 'yellow', 'colors', 'beginner', 'yellow', '노란색', 'dilaw', 'Sunflowers are bright yellow.', '해바라기는 밝은 노란색이다.', 'Ang mga sunflower ay dilaw.', '[ˈjeləʊ]', '[옐로우]', '[di-law]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'yellow' OR id = 'a0000000-0000-0000-0000-000000000067');

INSERT INTO public.study_vocabularies (id, concept_code, category, difficulty_level, word_en, word_ko, word_tl, example_en, example_ko, example_tl, phonetic_en, phonetic_ko, phonetic_tl)
SELECT 'a0000000-0000-0000-0000-000000000068', 'black', 'colors', 'beginner', 'black', '검은색', 'itim', 'He has stylish black shoes.', '그는 멋진 검은색 구두를 신는다.', 'Mayroon siyang itim na sapatos.', '[blæk]', '[블랙]', '[i-tim]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'black' OR id = 'a0000000-0000-0000-0000-000000000068');

INSERT INTO public.study_vocabularies (id, concept_code, category, difficulty_level, word_en, word_ko, word_tl, example_en, example_ko, example_tl, phonetic_en, phonetic_ko, phonetic_tl)
SELECT 'a0000000-0000-0000-0000-000000000069', 'white', 'colors', 'beginner', 'white', '하얀색', 'puti', 'Snow falls pure white.', '눈이 순백색으로 내린다.', 'Bumabagsak ang puting niyebe.', '[waɪt]', '[화이트]', '[pu-ti]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'white' OR id = 'a0000000-0000-0000-0000-000000000069');

INSERT INTO public.study_vocabularies (id, concept_code, category, difficulty_level, word_en, word_ko, word_tl, example_en, example_ko, example_tl, phonetic_en, phonetic_ko, phonetic_tl)
SELECT 'a0000000-0000-0000-0000-000000000070', 'pink', 'colors', 'beginner', 'pink', '분홍색', 'rosas', 'Cherry blossoms are soft pink.', '벚꽃은 은은한 분홍색이다.', 'Ang mga cherry blossom ay rosas.', '[pɪŋk]', '[핑크]', '[ro-sas]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'pink' OR id = 'a0000000-0000-0000-0000-000000000070');

INSERT INTO public.study_vocabularies (id, concept_code, category, difficulty_level, word_en, word_ko, word_tl, example_en, example_ko, example_tl, phonetic_en, phonetic_ko, phonetic_tl)
SELECT 'a0000000-0000-0000-0000-000000000071', 'orange', 'colors', 'beginner', 'orange', '주황색', 'kahel', 'The sunset shows orange light.', '석양이 주황색 빛을 띤다.', 'Ang paglubog ng araw ay kahel.', '[ˈɔːrɪndʒ]', '[오렌지]', '[ka-hel]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'orange' OR id = 'a0000000-0000-0000-0000-000000000071');

INSERT INTO public.study_vocabularies (id, concept_code, category, difficulty_level, word_en, word_ko, word_tl, example_en, example_ko, example_tl, phonetic_en, phonetic_ko, phonetic_tl)
SELECT 'a0000000-0000-0000-0000-000000000072', 'purple', 'colors', 'beginner', 'purple', '보라색', 'ube', 'Grapes have rich purple color.', '포도는 진한 보라색이다.', 'Ang mga ubas ay kulay ube.', '[ˈpɜːrpl]', '[퍼플]', '[u-be]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'purple' OR id = 'a0000000-0000-0000-0000-000000000072');

INSERT INTO public.study_vocabularies (id, concept_code, category, difficulty_level, word_en, word_ko, word_tl, example_en, example_ko, example_tl, phonetic_en, phonetic_ko, phonetic_tl)
SELECT 'a0000000-0000-0000-0000-000000000073', 'brown', 'colors', 'beginner', 'brown', '갈색', 'kayumanggi', 'The teddy bear is soft brown.', '곰 인형은 부드러운 갈색이다.', 'Ang teddy bear ay kayumanggi.', '[braʊn]', '[브라운]', '[ka-yu-mang-gi]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'brown' OR id = 'a0000000-0000-0000-0000-000000000073');

-- Lesson 8: Places
INSERT INTO public.study_vocabularies (id, concept_code, category, difficulty_level, word_en, word_ko, word_tl, example_en, example_ko, example_tl, phonetic_en, phonetic_ko, phonetic_tl)
SELECT 'a0000000-0000-0000-0000-000000000074', 'school', 'places', 'beginner', 'school', '학교', 'paaralan', 'Students study hard at school.', '학생들이 학교에서 열공한다.', 'Nagaaral ang mga bata sa paaralan.', '[skuːl]', '[스쿨]', '[pa-a-ra-lan]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'school' OR id = 'a0000000-0000-0000-0000-000000000074');

INSERT INTO public.study_vocabularies (id, concept_code, category, difficulty_level, word_en, word_ko, word_tl, example_en, example_ko, example_tl, phonetic_en, phonetic_ko, phonetic_tl)
SELECT 'a0000000-0000-0000-0000-000000000075', 'home', 'places', 'beginner', 'home', '집', 'bahay', 'Home is where love lives.', '집은 사랑이 머무는 곳이다.', 'Ang bahay ay naroon ang pagmamahal.', '[hoʊm]', '[홈]', '[ba-hay]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'home' OR id = 'a0000000-0000-0000-0000-000000000075');

INSERT INTO public.study_vocabularies (id, concept_code, category, difficulty_level, word_en, word_ko, word_tl, example_en, example_ko, example_tl, phonetic_en, phonetic_ko, phonetic_tl)
SELECT 'a0000000-0000-0000-0000-000000000076', 'store', 'places', 'beginner', 'store', '가게', 'tindahan', 'I buy snacks at the local store.', '나는 동네 가게에서 간식을 산다.', 'Bumibili ako ng meryenda sa tindahan.', '[stɔːr]', '[스토어]', '[tin-da-han]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'store' OR id = 'a0000000-0000-0000-0000-000000000076');

INSERT INTO public.study_vocabularies (id, concept_code, category, difficulty_level, word_en, word_ko, word_tl, example_en, example_ko, example_tl, phonetic_en, phonetic_ko, phonetic_tl)
SELECT 'a0000000-0000-0000-0000-000000000077', 'hospital', 'places', 'beginner', 'hospital', '병원', 'ospital', 'Doctors work in hospital.', '의사들이 병원에서 일한다.', 'Nagtatrabaho ang mga doktor sa ospital.', '[ˈhɑːspɪtl]', '[호스피털]', '[os-pi-tal]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'hospital' OR id = 'a0000000-0000-0000-0000-000000000077');

INSERT INTO public.study_vocabularies (id, concept_code, category, difficulty_level, word_en, word_ko, word_tl, example_en, example_ko, example_tl, phonetic_en, phonetic_ko, phonetic_tl)
SELECT 'a0000000-0000-0000-0000-000000000078', 'park', 'places', 'beginner', 'park', '공원', 'parke', 'We take a walk in green park.', '우리는 초록빛 공원에서 산책한다.', 'Naglalakad kami sa parke.', '[pɑːrk]', '[파크]', '[par-ke]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'park' OR id = 'a0000000-0000-0000-0000-000000000078');

INSERT INTO public.study_vocabularies (id, concept_code, category, difficulty_level, word_en, word_ko, word_tl, example_en, example_ko, example_tl, phonetic_en, phonetic_ko, phonetic_tl)
SELECT 'a0000000-0000-0000-0000-000000000079', 'bank', 'places', 'beginner', 'bank', '은행', 'bangko', 'I save money in the bank.', '나는 은행에 돈을 저축한다.', 'Nag-iipon ako ng pera sa bangko.', '[bæŋk]', '[뱅크]', '[bang-ko]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'bank' OR id = 'a0000000-0000-0000-0000-000000000079');

INSERT INTO public.study_vocabularies (id, concept_code, category, difficulty_level, word_en, word_ko, word_tl, example_en, example_ko, example_tl, phonetic_en, phonetic_ko, phonetic_tl)
SELECT 'a0000000-0000-0000-0000-000000000080', 'restaurant', 'places', 'beginner', 'restaurant', '식당', 'kainan', 'Let us eat dinner at restaurant.', '근사한 식당에서 저녁을 먹자.', 'Kumain tayo sa kainan.', '[ˈrestrɑːnt]', '[레스토랑]', '[ka-i-nan]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'restaurant' OR id = 'a0000000-0000-0000-0000-000000000080');

INSERT INTO public.study_vocabularies (id, concept_code, category, difficulty_level, word_en, word_ko, word_tl, example_en, example_ko, example_tl, phonetic_en, phonetic_ko, phonetic_tl)
SELECT 'a0000000-0000-0000-0000-000000000081', 'airport', 'places', 'beginner', 'airport', '공항', 'paliparan', 'We arrive early at airport.', '우리는 공항에 일찍 도착한다.', 'Dumating kami sa paliparan.', '[ˈerpɔːrt]', '[에어포트]', '[pa-li-pa-ran]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'airport' OR id = 'a0000000-0000-0000-0000-000000000081');

INSERT INTO public.study_vocabularies (id, concept_code, category, difficulty_level, word_en, word_ko, word_tl, example_en, example_ko, example_tl, phonetic_en, phonetic_ko, phonetic_tl)
SELECT 'a0000000-0000-0000-0000-000000000082', 'hotel', 'places', 'beginner', 'hotel', '호텔', 'hotel', 'The beach hotel has great view.', '해변 호텔은 전망이 훌륭하다.', 'Maganda ang tanawin sa hotel.', '[hoʊˈtel]', '[호텔]', '[ho-tel]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'hotel' OR id = 'a0000000-0000-0000-0000-000000000082');

INSERT INTO public.study_vocabularies (id, concept_code, category, difficulty_level, word_en, word_ko, word_tl, example_en, example_ko, example_tl, phonetic_en, phonetic_ko, phonetic_tl)
SELECT 'a0000000-0000-0000-0000-000000000083', 'beach', 'places', 'beginner', 'beach', '해변', 'baybayin', 'Waves crash gently on beach.', '파도가 해변에 잔잔히 친다.', 'Humahampas ang alon sa baybayin.', '[biːtʃ]', '[비치]', '[bay-ba-yin]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'beach' OR id = 'a0000000-0000-0000-0000-000000000083');

-- Lesson 9: Travel
INSERT INTO public.study_vocabularies (id, concept_code, category, difficulty_level, word_en, word_ko, word_tl, example_en, example_ko, example_tl, phonetic_en, phonetic_ko, phonetic_tl)
SELECT 'a0000000-0000-0000-0000-000000000084', 'car', 'travel', 'beginner', 'car', '자동차', 'kotse', 'We drive a comfortable car.', '우리는 편안한 자동차를 운전한다.', 'Nagmamaneho kami ng kotse.', '[kɑːr]', '[카]', '[kot-se]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'car' OR id = 'a0000000-0000-0000-0000-000000000084');

INSERT INTO public.study_vocabularies (id, concept_code, category, difficulty_level, word_en, word_ko, word_tl, example_en, example_ko, example_tl, phonetic_en, phonetic_ko, phonetic_tl)
SELECT 'a0000000-0000-0000-0000-000000000085', 'bus', 'travel', 'beginner', 'bus', '버스', 'bus', 'Take the city bus to center.', '시내버스를 타고 도심으로 가자.', 'Sumakay ng bus patungong sentro.', '[bʌs]', '[버스]', '[bas]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'bus' OR id = 'a0000000-0000-0000-0000-000000000085');

INSERT INTO public.study_vocabularies (id, concept_code, category, difficulty_level, word_en, word_ko, word_tl, example_en, example_ko, example_tl, phonetic_en, phonetic_ko, phonetic_tl)
SELECT 'a0000000-0000-0000-0000-000000000086', 'train', 'travel', 'beginner', 'train', '기차', 'tren', 'The speed train departs on time.', '고속열차가 제시간에 출발한다.', 'Umaalis sa oras ang tren.', '[treɪn]', '[트레인]', '[tren]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'train' OR id = 'a0000000-0000-0000-0000-000000000086');

INSERT INTO public.study_vocabularies (id, concept_code, category, difficulty_level, word_en, word_ko, word_tl, example_en, example_ko, example_tl, phonetic_en, phonetic_ko, phonetic_tl)
SELECT 'a0000000-0000-0000-0000-000000000087', 'plane', 'travel', 'beginner', 'plane', '비행기', 'eroplano', 'The plane flies above clouds.', '비행기가 구름 위를 난다.', 'Lumalipad ang eroplano.', '[pleɪn]', '[플레인]', '[e-ro-pla-no]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'plane' OR id = 'a0000000-0000-0000-0000-000000000087');

INSERT INTO public.study_vocabularies (id, concept_code, category, difficulty_level, word_en, word_ko, word_tl, example_en, example_ko, example_tl, phonetic_en, phonetic_ko, phonetic_tl)
SELECT 'a0000000-0000-0000-0000-000000000088', 'ship', 'travel', 'beginner', 'ship', '배', 'barko', 'A large ship sails on ocean.', '큰 배가 바다를 항해한다.', 'Bumabiyahe ang barko sa dagat.', '[ʃɪp]', '[쉽]', '[bar-ko]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'ship' OR id = 'a0000000-0000-0000-0000-000000000088');

INSERT INTO public.study_vocabularies (id, concept_code, category, difficulty_level, word_en, word_ko, word_tl, example_en, example_ko, example_tl, phonetic_en, phonetic_ko, phonetic_tl)
SELECT 'a0000000-0000-0000-0000-000000000089', 'road', 'travel', 'beginner', 'road', '길', 'kalsada', 'Follow this long winding road.', '이 긴 길을 따라가라.', 'Sundin ang kalsadang ito.', '[roʊd]', '[로드]', '[kal-sa-da]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'road' OR id = 'a0000000-0000-0000-0000-000000000089');

INSERT INTO public.study_vocabularies (id, concept_code, category, difficulty_level, word_en, word_ko, word_tl, example_en, example_ko, example_tl, phonetic_en, phonetic_ko, phonetic_tl)
SELECT 'a0000000-0000-0000-0000-000000000090', 'map', 'travel', 'beginner', 'map', '지도', 'mapa', 'Check the travel map together.', '함께 여행 지도를 확인하자.', 'Tingnan natin ang mapa.', '[mæp]', '[맵]', '[ma-pa]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'map' OR id = 'a0000000-0000-0000-0000-000000000090');

INSERT INTO public.study_vocabularies (id, concept_code, category, difficulty_level, word_en, word_ko, word_tl, example_en, example_ko, example_tl, phonetic_en, phonetic_ko, phonetic_tl)
SELECT 'a0000000-0000-0000-0000-000000000091', 'bag', 'travel', 'beginner', 'bag', '가방', 'bag', 'Pack luggage in travel bag.', '여행 가방에 짐을 싸세요.', 'I-impake ang gamit sa bag.', '[bæɡ]', '[백]', '[bag]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'bag' OR id = 'a0000000-0000-0000-0000-000000000091');

INSERT INTO public.study_vocabularies (id, concept_code, category, difficulty_level, word_en, word_ko, word_tl, example_en, example_ko, example_tl, phonetic_en, phonetic_ko, phonetic_tl)
SELECT 'a0000000-0000-0000-0000-000000000092', 'ticket', 'travel', 'beginner', 'ticket', '티켓', 'tiket', 'Show concert ticket at gate.', '게이트에서 티켓을 보여주세요.', 'Ipakita ang tiket sa pinto.', '[ˈtɪkɪt]', '[티켓]', '[ti-ket]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'ticket' OR id = 'a0000000-0000-0000-0000-000000000092');

INSERT INTO public.study_vocabularies (id, concept_code, category, difficulty_level, word_en, word_ko, word_tl, example_en, example_ko, example_tl, phonetic_en, phonetic_ko, phonetic_tl)
SELECT 'a0000000-0000-0000-0000-000000000093', 'camera', 'travel', 'beginner', 'camera', '카메라', 'kamera', 'Take photos with camera.', '카메라로 사진을 찍으세요.', 'Kumuha ng larawan gamit ang kamera.', '[ˈkæmrə]', '[카메라]', '[ka-me-ra]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'camera' OR id = 'a0000000-0000-0000-0000-000000000093');

-- Lesson 10: Feelings
INSERT INTO public.study_vocabularies (id, concept_code, category, difficulty_level, word_en, word_ko, word_tl, example_en, example_ko, example_tl, phonetic_en, phonetic_ko, phonetic_tl)
SELECT 'a0000000-0000-0000-0000-000000000094', 'good', 'feelings', 'beginner', 'good', '좋은', 'mabuti', 'Have a good day today.', '오늘 좋은 하루 보내세요.', 'Magkaroon ng mabuting araw.', '[ɡʊd]', '[굿]', '[ma-bu-ti]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'good' OR id = 'a0000000-0000-0000-0000-000000000094');

INSERT INTO public.study_vocabularies (id, concept_code, category, difficulty_level, word_en, word_ko, word_tl, example_en, example_ko, example_tl, phonetic_en, phonetic_ko, phonetic_tl)
SELECT 'a0000000-0000-0000-0000-000000000095', 'bad', 'feelings', 'beginner', 'bad', '나쁜', 'masama', 'Do not feel bad about it.', '그것에 대해 기분 나빠하지 마세요.', 'Huwag kang malungkot.', '[bæd]', '[배드]', '[ma-sa-ma]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'bad' OR id = 'a0000000-0000-0000-0000-000000000095');

INSERT INTO public.study_vocabularies (id, concept_code, category, difficulty_level, word_en, word_ko, word_tl, example_en, example_ko, example_tl, phonetic_en, phonetic_ko, phonetic_tl)
SELECT 'a0000000-0000-0000-0000-000000000096', 'sad', 'feelings', 'beginner', 'sad', '슬픈', 'malungkot', 'She feels sad saying bye.', '그녀는 작별 인사를 하며 슬퍼한다.', 'Nalulungkot siya.', '[sæd]', '[새드]', '[ma-lung-kot]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'sad' OR id = 'a0000000-0000-0000-0000-000000000096');

INSERT INTO public.study_vocabularies (id, concept_code, category, difficulty_level, word_en, word_ko, word_tl, example_en, example_ko, example_tl, phonetic_en, phonetic_ko, phonetic_tl)
SELECT 'a0000000-0000-0000-0000-000000000097', 'angry', 'feelings', 'beginner', 'angry', '화난', 'galit', 'Calm down when angry.', '화가 날 때는 마음을 가라앉히세요.', 'Magpakalma kapag galit ka.', '[ˈæŋɡri]', '[앵그리]', '[ga-lit]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'angry' OR id = 'a0000000-0000-0000-0000-000000000097');

INSERT INTO public.study_vocabularies (id, concept_code, category, difficulty_level, word_en, word_ko, word_tl, example_en, example_ko, example_tl, phonetic_en, phonetic_ko, phonetic_tl)
SELECT 'a0000000-0000-0000-0000-000000000098', 'tired', 'feelings', 'beginner', 'tired', '피곤한', 'pagod', 'I am tired after work.', '나는 일 마치고 피곤하다.', 'Pagod ako pagkatapos magtrabaho.', '[ˈtaɪərd]', '[타이어드]', '[pa-god]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'tired' OR id = 'a0000000-0000-0000-0000-000000000098');

INSERT INTO public.study_vocabularies (id, concept_code, category, difficulty_level, word_en, word_ko, word_tl, example_en, example_ko, example_tl, phonetic_en, phonetic_ko, phonetic_tl)
SELECT 'a0000000-0000-0000-0000-000000000099', 'hungry', 'feelings', 'beginner', 'hungry', '배고픈', 'gutom', 'We are hungry let us eat.', '배고프다 밥 먹으러 가자.', 'Gutom na kami kumain tayo.', '[ˈhʌŋɡri]', '[헝그리]', '[gu-tom]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'hungry' OR id = 'a0000000-0000-0000-0000-000000000099');

INSERT INTO public.study_vocabularies (id, concept_code, category, difficulty_level, word_en, word_ko, word_tl, example_en, example_ko, example_tl, phonetic_en, phonetic_ko, phonetic_tl)
SELECT 'a0000000-0000-0000-0000-000000000100', 'thirsty', 'feelings', 'beginner', 'thirsty', '목마른', 'uhaw', 'I am thirsty after running.', '달리기를 하니 목이 마르다.', 'Nauuhaw ako pagkatapos tumakbo.', '[ˈθɜːrsti]', '[서스티]', '[u-haw]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'thirsty' OR id = 'a0000000-0000-0000-0000-000000000100');

INSERT INTO public.study_vocabularies (id, concept_code, category, difficulty_level, word_en, word_ko, word_tl, example_en, example_ko, example_tl, phonetic_en, phonetic_ko, phonetic_tl)
SELECT 'a0000000-0000-0000-0000-000000000101', 'sick', 'feelings', 'beginner', 'sick', '아픈', 'may sakit', 'Take rest when sick.', '몸이 아플 때는 휴식을 취하세요.', 'Magpahinga kapag may sakit.', '[sɪk]', '[식]', '[may sa-kit]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'sick' OR id = 'a0000000-0000-0000-0000-000000000101');

INSERT INTO public.study_vocabularies (id, concept_code, category, difficulty_level, word_en, word_ko, word_tl, example_en, example_ko, example_tl, phonetic_en, phonetic_ko, phonetic_tl)
SELECT 'a0000000-0000-0000-0000-000000000102', 'busy', 'feelings', 'beginner', 'busy', '바쁜', 'alala', 'I am very busy today.', '나는 오늘 매우 바쁘다.', 'Napakabusy ko ngayon.', '[ˈbɪzi]', '[비지]', '[bi-zi]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'busy' OR id = 'a0000000-0000-0000-0000-0000000000102');

INSERT INTO public.study_vocabularies (id, concept_code, category, difficulty_level, word_en, word_ko, word_tl, example_en, example_ko, example_tl, phonetic_en, phonetic_ko, phonetic_tl)
SELECT 'a0000000-0000-0000-0000-000000000103', 'free', 'feelings', 'beginner', 'free', '한가한', 'malaya', 'Are you free this weekend?', '이번 주말에 한가한가요?', 'Malaya ka ba ngayong katapusan ng linggo?', '[friː]', '[프리]', '[ma-la-ya]'
WHERE NOT EXISTS (SELECT 1 FROM public.study_vocabularies WHERE LOWER(word_en) = 'free' OR id = 'a0000000-0000-0000-0000-000000000103');


-- 2. Connect Vocabularies to Lessons 4 to 10 in public.ai_lesson_vocabulary
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
