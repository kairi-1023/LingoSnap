-- ============================================================
-- Migration 032: Add Tagalog (tl) Data to Existing Vocabularies
-- Updates word_tl, example_tl, phonetic_tl for existing lessons 1..3 and core words
-- ============================================================

-- Lesson 1: Greetings & Me
UPDATE public.study_vocabularies 
SET word_tl = 'kumusta', example_tl = 'Kumusta ka ngayon?', phonetic_tl = '[ku-mus-ta]'
WHERE LOWER(word_en) = 'hello' OR LOWER(concept_code) = 'hello';

UPDATE public.study_vocabularies 
SET word_tl = 'paalam', example_tl = 'Paalam na muna sa iyo.', phonetic_tl = '[pa-a-lam]'
WHERE LOWER(word_en) = 'bye' OR LOWER(concept_code) = 'bye';

UPDATE public.study_vocabularies 
SET word_tl = 'ako', example_tl = 'Ako ay masaya ngayon.', phonetic_tl = '[a-ko]'
WHERE LOWER(word_en) = 'i' OR LOWER(concept_code) = 'i';

UPDATE public.study_vocabularies 
SET word_tl = 'ikaw', example_tl = 'Ikaw ang aking mahal.', phonetic_tl = '[i-kaw]'
WHERE LOWER(word_en) = 'you' OR LOWER(concept_code) = 'you';

UPDATE public.study_vocabularies 
SET word_tl = 'pangalan', example_tl = 'Ano ang iyong pangalan?', phonetic_tl = '[pa-nga-lan]'
WHERE LOWER(word_en) = 'name' OR LOWER(concept_code) = 'name';

UPDATE public.study_vocabularies 
SET word_tl = 'kaibigan', example_tl = 'Mabuting kaibigan kita.', phonetic_tl = '[ka-i-bi-gan]'
WHERE LOWER(word_en) = 'friend' OR LOWER(concept_code) = 'friend';

UPDATE public.study_vocabularies 
SET word_tl = 'masaya', example_tl = 'Masaya ako kasama ka.', phonetic_tl = '[ma-sa-ya]'
WHERE LOWER(word_en) = 'happy' OR LOWER(concept_code) = 'happy';

UPDATE public.study_vocabularies 
SET word_tl = 'pag-ibig', example_tl = 'Ang pag-ibig ay maganda.', phonetic_tl = '[pag-i-big]'
WHERE LOWER(word_en) = 'love' OR LOWER(concept_code) = 'love';

UPDATE public.study_vocabularies 
SET word_tl = 'gusto', example_tl = 'Gusto kita nang sobra.', phonetic_tl = '[gus-to]'
WHERE LOWER(word_en) = 'like' OR LOWER(concept_code) = 'like';

UPDATE public.study_vocabularies 
SET word_tl = 'ngiti', example_tl = 'Maganda ang iyong ngiti.', phonetic_tl = '[ngi-ti]'
WHERE LOWER(word_en) = 'smile' OR LOWER(concept_code) = 'smile';


-- Lesson 2: Family
UPDATE public.study_vocabularies 
SET word_tl = 'pamilya', example_tl = 'Mahal ko ang aking pamilya.', phonetic_tl = '[pa-mil-ya]'
WHERE LOWER(word_en) = 'family' OR LOWER(concept_code) = 'family';

UPDATE public.study_vocabularies 
SET word_tl = 'ina', example_tl = 'Mabait ang aking ina.', phonetic_tl = '[i-na]'
WHERE LOWER(word_en) = 'mother' OR LOWER(concept_code) = 'mother';

UPDATE public.study_vocabularies 
SET word_tl = 'ama', example_tl = 'Masipag ang aking ama.', phonetic_tl = '[a-ma]'
WHERE LOWER(word_en) = 'father' OR LOWER(concept_code) = 'father';

UPDATE public.study_vocabularies 
SET word_tl = 'sanggol', example_tl = 'Natutulog ang cute na sanggol.', phonetic_tl = '[sang-gol]'
WHERE LOWER(word_en) = 'baby' OR LOWER(concept_code) = 'baby';

UPDATE public.study_vocabularies 
SET word_tl = 'kapatid na lalaki', example_tl = 'Mabuti ang aking kapatid na lalaki.', phonetic_tl = '[ka-pa-tid na la-la-ki]'
WHERE LOWER(word_en) = 'brother' OR LOWER(concept_code) = 'brother';

UPDATE public.study_vocabularies 
SET word_tl = 'kapatid na babae', example_tl = 'Maganda ang aking kapatid na babae.', phonetic_tl = '[ka-pa-tid na ba-ba-e]'
WHERE LOWER(word_en) = 'sister' OR LOWER(concept_code) = 'sister';

UPDATE public.study_vocabularies 
SET word_tl = 'lola', example_tl = 'Nagluluto si lola ng masarap.', phonetic_tl = '[lo-la]'
WHERE LOWER(word_en) = 'grandma' OR LOWER(concept_code) = 'grandma';

UPDATE public.study_vocabularies 
SET word_tl = 'lolo', example_tl = 'Mabait ang aking lolo.', phonetic_tl = '[lo-lo]'
WHERE LOWER(word_en) = 'grandpa' OR LOWER(concept_code) = 'grandpa';

UPDATE public.study_vocabularies 
SET word_tl = 'anak na lalaki', example_tl = 'Nagaaral ang aking anak na lalaki.', phonetic_tl = '[a-nak na la-la-ki]'
WHERE LOWER(word_en) = 'son' OR LOWER(concept_code) = 'son';

UPDATE public.study_vocabularies 
SET word_tl = 'anak na babae', example_tl = 'Mabait ang aking anak na babae.', phonetic_tl = '[a-nak na ba-ba-e]'
WHERE LOWER(word_en) = 'daughter' OR LOWER(concept_code) = 'daughter';


-- Lesson 3: Home
UPDATE public.study_vocabularies 
SET word_tl = 'bahay', example_tl = 'Malinis ang aming bahay.', phonetic_tl = '[ba-hay]'
WHERE LOWER(word_en) = 'house' OR LOWER(concept_code) = 'house';

UPDATE public.study_vocabularies 
SET word_tl = 'silid', example_tl = 'Malaki ang aking silid.', phonetic_tl = '[si-lid]'
WHERE LOWER(word_en) = 'room' OR LOWER(concept_code) = 'room';

UPDATE public.study_vocabularies 
SET word_tl = 'pinto', example_tl = 'Isara mo ang pinto.', phonetic_tl = '[pin-to]'
WHERE LOWER(word_en) = 'door' OR LOWER(concept_code) = 'door';

UPDATE public.study_vocabularies 
SET word_tl = 'bintana', example_tl = 'Buksan mo ang bintana.', phonetic_tl = '[bin-ta-na]'
WHERE LOWER(word_en) = 'window' OR LOWER(concept_code) = 'window';

UPDATE public.study_vocabularies 
SET word_tl = 'kama', example_tl = 'Malambot ang aking kama.', phonetic_tl = '[ka-ma]'
WHERE LOWER(word_en) = 'bed' OR LOWER(concept_code) = 'bed';

UPDATE public.study_vocabularies 
SET word_tl = 'upuan', example_tl = 'Umupo ka sa upuan.', phonetic_tl = '[u-pu-an]'
WHERE LOWER(word_en) = 'chair' OR LOWER(concept_code) = 'chair';

UPDATE public.study_vocabularies 
SET word_tl = 'lamesa', example_tl = 'Malinis ang lamesa.', phonetic_tl = '[la-me-sa]'
WHERE LOWER(word_en) = 'table' OR LOWER(concept_code) = 'table';

UPDATE public.study_vocabularies 
SET word_tl = 'ilawan', example_tl = 'Maliwanag ang ilawan.', phonetic_tl = '[i-la-wan]'
WHERE LOWER(word_en) = 'lamp' OR LOWER(concept_code) = 'lamp';

UPDATE public.study_vocabularies 
SET word_tl = 'susi', example_tl = 'Nasaan ang susi?', phonetic_tl = '[su-si]'
WHERE LOWER(word_en) = 'key' OR LOWER(concept_code) = 'key';

UPDATE public.study_vocabularies 
SET word_tl = 'telepono', example_tl = 'Gamitin mo ang telepono.', phonetic_tl = '[te-le-po-no]'
WHERE LOWER(word_en) = 'phone' OR LOWER(concept_code) = 'phone';


-- Extra Core Actions
UPDATE public.study_vocabularies 
SET word_tl = 'magbake', example_tl = 'Ngbabake kami ng tinapay.', phonetic_tl = '[mag-bake]'
WHERE LOWER(word_en) = 'bake' OR LOWER(concept_code) = 'bake';

UPDATE public.study_vocabularies 
SET word_tl = 'maglinis', example_tl = 'Naglilinis ako ng silid.', phonetic_tl = '[mag-li-nis]'
WHERE LOWER(word_en) = 'clean' OR LOWER(concept_code) = 'clean';

UPDATE public.study_vocabularies 
SET word_tl = 'magluto', example_tl = 'Nagluluto siya ng hapunan.', phonetic_tl = '[mag-lu-to]'
WHERE LOWER(word_en) = 'cook' OR LOWER(concept_code) = 'cook';

UPDATE public.study_vocabularies 
SET word_tl = 'tumalon', example_tl = 'Tumatalon ang bata sa saya.', phonetic_tl = '[tu-ma-lon]'
WHERE LOWER(word_en) = 'jump' OR LOWER(concept_code) = 'jump';

NOTIFY pgrst, 'reload schema';
