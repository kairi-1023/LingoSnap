-- ============================================================
-- Migration 039: High-Quality Multilingual Examples Upgrade
-- Upgrades study_vocabularies with warm, practical 3-language examples (EN, KO, TL)
-- ============================================================

-- Lesson 1: Greetings & Me
UPDATE public.study_vocabularies SET
  example_en = 'Hello, my love! How was your day?',
  example_ko = '안녕, 내 사랑! 오늘 하루 어땠어?',
  example_tl = 'Kumusta, mahal ko! Kumusta ang araw mo?'
WHERE LOWER(concept_code) = 'hello' OR LOWER(word_en) = 'hello';

UPDATE public.study_vocabularies SET
  example_en = 'Bye for now! See you tonight at home.',
  example_ko = '잘 가! 오늘 저녁 집에서 봐.',
  example_tl = 'Paalam muna! Magkita tayo mamaya sa bahay.'
WHERE LOWER(concept_code) = 'bye' OR LOWER(word_en) = 'bye';

UPDATE public.study_vocabularies SET
  example_en = 'I am so happy whenever I am with you.',
  example_ko = '나는 너와 함께 있을 때 항상 행복해.',
  example_tl = 'Ako ay sobrang masaya kapag kasama kita.'
WHERE LOWER(concept_code) = 'i' OR LOWER(word_en) = 'i';

UPDATE public.study_vocabularies SET
  example_en = 'You are the most precious person in my life.',
  example_ko = '너는 내 삶에서 가장 소중한 사람이야.',
  example_tl = 'Ikaw ang pinakamahalagang tao sa buhay ko.'
WHERE LOWER(concept_code) = 'you' OR LOWER(word_en) = 'you';

UPDATE public.study_vocabularies SET
  example_en = 'What is your nickname for me?',
  example_ko = '나를 부르는 애칭 이름이 뭐야?',
  example_tl = 'Ano ang palayaw mo sa akin?'
WHERE LOWER(concept_code) = 'name' OR LOWER(word_en) = 'name';

UPDATE public.study_vocabularies SET
  example_en = 'You are my lover and my best friend.',
  example_ko = '너는 나의 연인이자 가장 친한 친구야.',
  example_tl = 'Ikaw ang mahal ko at matalik kong kaibigan.'
WHERE LOWER(concept_code) = 'friend' OR LOWER(word_en) = 'friend';

UPDATE public.study_vocabularies SET
  example_en = 'I feel warm and happy when we smile together.',
  example_ko = '함께 웃을 때 마음이 따뜻하고 행복해.',
  example_tl = 'Masaya ako kapag sabay tayong ngumingiti.'
WHERE LOWER(concept_code) = 'happy' OR LOWER(word_en) = 'happy';

UPDATE public.study_vocabularies SET
  example_en = 'Our love gets deeper every single day.',
  example_ko = '우리의 사랑은 매일 더욱 깊어져.',
  example_tl = 'Lalong lumalalim ang pag-ibig natin araw-araw.'
WHERE LOWER(concept_code) = 'love' OR LOWER(word_en) = 'love';

UPDATE public.study_vocabularies SET
  example_en = 'I like making delicious coffee for you.',
  example_ko = '너를 위해 맛있는 커피 만드는 걸 좋아해.',
  example_tl = 'Gusto kong magtimpla ng masarap na kape para sa iyo.'
WHERE LOWER(concept_code) = 'like' OR LOWER(word_en) = 'like';

UPDATE public.study_vocabularies SET
  example_en = 'Your sweet smile lights up my whole morning.',
  example_ko = '너의 달콤한 미소가 내 아침을 환하게 밝혀줘.',
  example_tl = 'Ang tamis ng ngiti mo ay nagpapasaya sa umaga ko.'
WHERE LOWER(concept_code) = 'smile' OR LOWER(word_en) = 'smile';

-- Lesson 2: Family
UPDATE public.study_vocabularies SET
  example_en = 'We are building a warm and loving family.',
  example_ko = '우리는 따뜻하고 사랑스러운 가족을 가꿔가고 있어.',
  example_tl = 'Bumubuo tayo ng mainit at mapagmahal na pamilya.'
WHERE LOWER(concept_code) = 'family' OR LOWER(word_en) = 'family';

UPDATE public.study_vocabularies SET
  example_en = 'My mother sent us a heartwarming gift.',
  example_ko = '어머니께서 우리에게 따뜻한 선물을 보내주셨어.',
  example_tl = 'Nagpadala ang aking ina ng nakaka-touch na regalo sa atin.'
WHERE LOWER(concept_code) = 'mother' OR LOWER(word_en) = 'mother';

UPDATE public.study_vocabularies SET
  example_en = 'My father greeted you with a big smile.',
  example_ko = '아버지가 널 환한 미소로 맞아주셨어.',
  example_tl = 'Bumatid ang aking ama sa iyo na may malaking ngiti.'
WHERE LOWER(concept_code) = 'father' OR LOWER(word_en) = 'father';

UPDATE public.study_vocabularies SET
  example_en = 'The baby is sleeping peacefully in the crib.',
  example_ko = '아기가 요람에서 온화하게 자고 있어.',
  example_tl = 'Payapang natutulog ang sanggol sa duyan.'
WHERE LOWER(concept_code) = 'baby' OR LOWER(word_en) = 'baby';

UPDATE public.study_vocabularies SET
  example_en = 'My brother invited us to dinner this weekend.',
  example_ko = '형제가 이번 주말에 우리를 저녁 식사에 초대했어.',
  example_tl = 'Inimbita tayo ng kapatid ko sa hapunan ngayong linggo.'
WHERE LOWER(concept_code) = 'brother' OR LOWER(word_en) = 'brother';

UPDATE public.study_vocabularies SET
  example_en = 'My sister loves chatting with you.',
  example_ko = '여동생이 너와 수다 떠는 걸 아주 좋아해.',
  example_tl = 'Gusto ng kapatid kong babae na makipagkwentuhan sa iyo.'
WHERE LOWER(concept_code) = 'sister' OR LOWER(word_en) = 'sister';

UPDATE public.study_vocabularies SET
  example_en = 'Grandma cooked a delicious homemade meal for us.',
  example_ko = '할머니께서 우리를 위해 맛있는 집밥을 해주셨어.',
  example_tl = 'Nagluto si lola ng masarap na pagkain para sa atin.'
WHERE LOWER(concept_code) = 'grandma' OR LOWER(word_en) = 'grandma';

UPDATE public.study_vocabularies SET
  example_en = 'Grandpa shared wonderful stories with us.',
  example_ko = '할아버지께서 흥미진진한 옛날 이야기를 해주셨어.',
  example_tl = 'Nagkwento si lolo ng mga magagandang kwento sa atin.'
WHERE LOWER(concept_code) = 'grandpa' OR LOWER(word_en) = 'grandpa';

UPDATE public.study_vocabularies SET
  example_en = 'Our son is playing happily in the garden.',
  example_ko = '우리 아들이 정원에서 신나게 놀고 있어.',
  example_tl = 'Masayang naglalaro ang ating anak na lalaki sa hardin.'
WHERE LOWER(concept_code) = 'son' OR LOWER(word_en) = 'son';

UPDATE public.study_vocabularies SET
  example_en = 'Our daughter sang a beautiful song for us.',
  example_ko = '우리 딸이 우리를 위해 예쁜 노래를 불러줬어.',
  example_tl = 'Kumanta ang ating anak na babae ng magandang kanta.'
WHERE LOWER(concept_code) = 'daughter' OR LOWER(word_en) = 'daughter';

-- Lesson 3: Home
UPDATE public.study_vocabularies SET
  example_en = 'Our house feels so cozy and full of warmth.',
  example_ko = '우리 집은 참 아늑하고 따뜻함으로 가득해.',
  example_tl = 'Ang aming bahay ay napaka-cozy at puno ng init.'
WHERE LOWER(concept_code) = 'house' OR LOWER(word_en) = 'house';

UPDATE public.study_vocabularies SET
  example_en = 'Let''s clean our bedroom together this afternoon.',
  example_ko = '오늘 오후에 침실 방을 함께 청소하자.',
  example_tl = 'Maglinis tayo ng ating silid ngayong hapon.'
WHERE LOWER(concept_code) = 'room' OR LOWER(word_en) = 'room';

UPDATE public.study_vocabularies SET
  example_en = 'Please lock the front door before going to bed.',
  example_ko = '잠들기 전에 현관문을 꼭 잠가줘.',
  example_tl = 'Pakisara ang pinto bago matulog.'
WHERE LOWER(concept_code) = 'door' OR LOWER(word_en) = 'door';

UPDATE public.study_vocabularies SET
  example_en = 'Open the window to feel the cool breeze.',
  example_ko = '시원한 바람을 쐬게 창문을 열어보자.',
  example_tl = 'Buksan ang bintana para sa malamig na hangin.'
WHERE LOWER(concept_code) = 'window' OR LOWER(word_en) = 'window';

UPDATE public.study_vocabularies SET
  example_en = 'Our bed is soft and comfortable for resting.',
  example_ko = '우리 침대는 푹신해서 쉬기에 정말 편안해.',
  example_tl = 'Malambot at komportable ang ating kama.'
WHERE LOWER(concept_code) = 'bed' OR LOWER(word_en) = 'bed';

UPDATE public.study_vocabularies SET
  example_en = 'Sit on this comfortable chair and relax.',
  example_ko = '이 편안한 의자에 앉아서 편하게 쉬어.',
  example_tl = 'Umupo ka sa komportableng upuan na ito at magpahinga.'
WHERE LOWER(concept_code) = 'chair' OR LOWER(word_en) = 'chair';

UPDATE public.study_vocabularies SET
  example_en = 'Dinner is ready on the dining table.',
  example_ko = '식탁 위에 맛있는 저녁이 차려져 있어.',
  example_tl = 'Nakatabla na ang hapunan sa lamesa.'
WHERE LOWER(concept_code) = 'table' OR LOWER(word_en) = 'table';

UPDATE public.study_vocabularies SET
  example_en = 'Turn on the soft lamp light beside the bed.',
  example_ko = '침대 옆 은은한 스탠드 조명을 켜줘.',
  example_tl = 'Buksan ang ilawan sa tabi ng kama.'
WHERE LOWER(concept_code) = 'lamp' OR LOWER(word_en) = 'lamp';

UPDATE public.study_vocabularies SET
  example_en = 'I left the house key on the table.',
  example_ko = '탁자 위에 집 열쇠를 두고 나왔어.',
  example_tl = 'Iniwan ko ang susi ng bahay sa lamesa.'
WHERE LOWER(concept_code) = 'key' OR LOWER(word_en) = 'key';

UPDATE public.study_vocabularies SET
  example_en = 'Your phone is ringing on the sofa.',
  example_ko = '소파 위에서 네 전화기가 울리고 있어.',
  example_tl = 'Tumutunog ang telepono mo sa sopa.'
WHERE LOWER(concept_code) = 'phone' OR LOWER(word_en) = 'phone';

-- Lesson 4: Food
UPDATE public.study_vocabularies SET
  example_en = 'This cooked food smells so delicious!',
  example_ko = '이 요리된 음식 냄새가 정말 구수하고 맛있다!',
  example_tl = 'Napakasarap ng amoy ng pagkaing ito!'
WHERE LOWER(concept_code) = 'food' OR LOWER(word_en) = 'food';

UPDATE public.study_vocabularies SET
  example_en = 'Freshly cooked warm rice is ready.',
  example_ko = '갓 지은 따뜻한 밥이 완성되었어.',
  example_tl = 'Handa na ang mainit na bagong lutong kanin.'
WHERE LOWER(concept_code) = 'rice' OR LOWER(word_en) = 'rice';

UPDATE public.study_vocabularies SET
  example_en = 'Let me buy fresh bread from the bakery.',
  example_ko = '빵집에서 갓 구운 빵을 사 올게.',
  example_tl = 'Bibili ako ng bagong tinapay sa bakeshop.'
WHERE LOWER(concept_code) = 'bread' OR LOWER(word_en) = 'bread';

UPDATE public.study_vocabularies SET
  example_en = 'Eating a sweet red apple in the morning is healthy.',
  example_ko = '아침에 달콤한 빨간 사과를 먹으면 건강에 좋아.',
  example_tl = 'Mabuti sa kalusugan ang kumain ng mansanas sa umaga.'
WHERE LOWER(concept_code) = 'apple' OR LOWER(word_en) = 'apple';

UPDATE public.study_vocabularies SET
  example_en = 'Let''s make a sweet banana smoothie together.',
  example_ko = '함께 달콤한 바나나 스무디를 만들자.',
  example_tl = 'Gawa tayo ng matamis na banana smoothie.'
WHERE LOWER(concept_code) = 'banana' OR LOWER(word_en) = 'banana';

UPDATE public.study_vocabularies SET
  example_en = 'I fried two fresh eggs for breakfast.',
  example_ko = '아침 식사로 신선한 계란 프라이 두 개를 만들었어.',
  example_tl = 'Nagluto ako ng dalawang itlog para sa almusal.'
WHERE LOWER(concept_code) = 'egg' OR LOWER(word_en) = 'egg';

UPDATE public.study_vocabularies SET
  example_en = 'Drink a warm glass of milk before sleeping.',
  example_ko = '자기 전에 따뜻한 우유 한 잔 마셔.',
  example_tl = 'Uminom ng mainit na gatas bago matulog.'
WHERE LOWER(concept_code) = 'milk' OR LOWER(word_en) = 'milk';

UPDATE public.study_vocabularies SET
  example_en = 'Please drink plenty of fresh water today.',
  example_ko = '오늘 시원한 물을 많이 마셔줘.',
  example_tl = 'Uminom ka ng maraming tubig ngayon.'
WHERE LOWER(concept_code) = 'water' OR LOWER(word_en) = 'water';

UPDATE public.study_vocabularies SET
  example_en = 'Let''s enjoy a hot cup of coffee together.',
  example_ko = '함께 따뜻한 커피 한 잔의 여유를 즐기자.',
  example_tl = 'Magkape tayo nang sabay.'
WHERE LOWER(concept_code) = 'coffee' OR LOWER(word_en) = 'coffee';

UPDATE public.study_vocabularies SET
  example_en = 'I bought a sweet chocolate cake for our celebration.',
  example_ko = '우리 기념일을 위해 달콤한 초콜릿 케이크를 샀어.',
  example_tl = 'Bumili ako ng matamis na cake para sa selebrasyon natin.'
WHERE LOWER(concept_code) = 'cake' OR LOWER(word_en) = 'cake';

-- Lesson 5: Actions
UPDATE public.study_vocabularies SET
  example_en = 'Let''s eat a delicious dinner together tonight.',
  example_ko = '오늘 저녁에 함께 맛있는 저녁 식사를 먹자.',
  example_tl = 'Kumain tayo ng masarap na hapunan ngayong gabi.'
WHERE LOWER(concept_code) = 'eat' OR LOWER(word_en) = 'eat';

UPDATE public.study_vocabularies SET
  example_en = 'Would you like to drink fresh juice with me?',
  example_ko = '나랑 같이 시원한 주스 마실래?',
  example_tl = 'Gusto mo bang uminom ng juice kasama ko?'
WHERE LOWER(concept_code) = 'drink' OR LOWER(word_en) = 'drink';

UPDATE public.study_vocabularies SET
  example_en = 'Sleep well and have sweet dreams, my love.',
  example_ko = '푹 자고 좋은 꿈 꿔, 내 사랑.',
  example_tl = 'Matulog ka nang mahimbing at magkaroon ng magandang panaginip.'
WHERE LOWER(concept_code) = 'sleep' OR LOWER(word_en) = 'sleep';

UPDATE public.study_vocabularies SET
  example_en = 'I will cook your favorite meal tonight.',
  example_ko = '오늘 밤 네가 제일 좋아하는 요리를 해줄게.',
  example_tl = 'Magluluto ako ng paborito mong pagkain ngayong gabi.'
WHERE LOWER(concept_code) = 'cook' OR LOWER(word_en) = 'cook';

UPDATE public.study_vocabularies SET
  example_en = 'Let''s bake sweet cookies together on Sunday.',
  example_ko = '일요일에 같이 달콤한 쿠키를 굽자.',
  example_tl = 'Maghurno tayo ng matamis na cookies sa Linggo.'
WHERE LOWER(concept_code) = 'bake' OR LOWER(word_en) = 'bake';

UPDATE public.study_vocabularies SET
  example_en = 'Let''s run together in the fresh morning air.',
  example_ko = '상쾌한 아침 공기를 마시며 같이 달리자.',
  example_tl = 'Tumakbo tayo nang sabay sa sariwang hangin sa umaga.'
WHERE LOWER(concept_code) = 'run' OR LOWER(word_en) = 'run';

UPDATE public.study_vocabularies SET
  example_en = 'I love taking a peaceful walk with you at sunset.',
  example_ko = '노을 질 때 너와 평화롭게 걷는 시간을 사랑해.',
  example_tl = 'Gusto kong maglakad kasama ka sa paglubog ng araw.'
WHERE LOWER(concept_code) = 'walk' OR LOWER(word_en) = 'walk';

UPDATE public.study_vocabularies SET
  example_en = 'The children jump with excitement in the park.',
  example_ko = '아이들이 공원에서 신나서 폴짝 뛰어놀아.',
  example_tl = 'Tumatalon ang mga bata sa tuwa sa parke.'
WHERE LOWER(concept_code) = 'jump' OR LOWER(word_en) = 'jump';

UPDATE public.study_vocabularies SET
  example_en = 'Let''s clean our cozy living room together.',
  example_ko = '우리 아늑한 거실을 같이 청소하자.',
  example_tl = 'Maglinis tayo ng ating sala.'
WHERE LOWER(concept_code) = 'clean' OR LOWER(word_en) = 'clean';

UPDATE public.study_vocabularies SET
  example_en = 'I read an inspiring book beside you on the sofa.',
  example_ko = '소파에서 네 옆에 앉아 감동적인 책을 읽고 있어.',
  example_tl = 'Nagbabasa ako ng magandang libro sa tabi mo sa sopa.'
WHERE LOWER(concept_code) = 'read' OR LOWER(word_en) = 'read';

NOTIFY pgrst, 'reload schema';
