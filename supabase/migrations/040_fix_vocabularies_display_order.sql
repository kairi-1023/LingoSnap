-- ============================================================
-- Migration 040: Fix study_vocabularies.display_order (1 to 10)
-- Sets sequential display_order from 1 to 10 for all 100 vocabularies
-- ============================================================

-- Lesson 1: Greetings & Me
UPDATE public.study_vocabularies SET display_order = 1 WHERE LOWER(concept_code) = 'hello' OR LOWER(word_en) = 'hello';
UPDATE public.study_vocabularies SET display_order = 2 WHERE LOWER(concept_code) = 'bye' OR LOWER(word_en) = 'bye';
UPDATE public.study_vocabularies SET display_order = 3 WHERE LOWER(concept_code) = 'i' OR LOWER(word_en) = 'i';
UPDATE public.study_vocabularies SET display_order = 4 WHERE LOWER(concept_code) = 'you' OR LOWER(word_en) = 'you';
UPDATE public.study_vocabularies SET display_order = 5 WHERE LOWER(concept_code) = 'name' OR LOWER(word_en) = 'name';
UPDATE public.study_vocabularies SET display_order = 6 WHERE LOWER(concept_code) = 'friend' OR LOWER(word_en) = 'friend';
UPDATE public.study_vocabularies SET display_order = 7 WHERE LOWER(concept_code) = 'happy' OR LOWER(word_en) = 'happy';
UPDATE public.study_vocabularies SET display_order = 8 WHERE LOWER(concept_code) = 'love' OR LOWER(word_en) = 'love';
UPDATE public.study_vocabularies SET display_order = 9 WHERE LOWER(concept_code) = 'like' OR LOWER(word_en) = 'like';
UPDATE public.study_vocabularies SET display_order = 10 WHERE LOWER(concept_code) = 'smile' OR LOWER(word_en) = 'smile';

-- Lesson 2: Family
UPDATE public.study_vocabularies SET display_order = 1 WHERE LOWER(concept_code) = 'family' OR LOWER(word_en) = 'family';
UPDATE public.study_vocabularies SET display_order = 2 WHERE LOWER(concept_code) = 'mother' OR LOWER(word_en) = 'mother';
UPDATE public.study_vocabularies SET display_order = 3 WHERE LOWER(concept_code) = 'father' OR LOWER(word_en) = 'father';
UPDATE public.study_vocabularies SET display_order = 4 WHERE LOWER(concept_code) = 'baby' OR LOWER(word_en) = 'baby';
UPDATE public.study_vocabularies SET display_order = 5 WHERE LOWER(concept_code) = 'brother' OR LOWER(word_en) = 'brother';
UPDATE public.study_vocabularies SET display_order = 6 WHERE LOWER(concept_code) = 'sister' OR LOWER(word_en) = 'sister';
UPDATE public.study_vocabularies SET display_order = 7 WHERE LOWER(concept_code) = 'grandma' OR LOWER(word_en) = 'grandma';
UPDATE public.study_vocabularies SET display_order = 8 WHERE LOWER(concept_code) = 'grandpa' OR LOWER(word_en) = 'grandpa';
UPDATE public.study_vocabularies SET display_order = 9 WHERE LOWER(concept_code) = 'son' OR LOWER(word_en) = 'son';
UPDATE public.study_vocabularies SET display_order = 10 WHERE LOWER(concept_code) = 'daughter' OR LOWER(word_en) = 'daughter';

-- Lesson 3: Home
UPDATE public.study_vocabularies SET display_order = 1 WHERE LOWER(concept_code) = 'house' OR LOWER(word_en) = 'house';
UPDATE public.study_vocabularies SET display_order = 2 WHERE LOWER(concept_code) = 'room' OR LOWER(word_en) = 'room';
UPDATE public.study_vocabularies SET display_order = 3 WHERE LOWER(concept_code) = 'door' OR LOWER(word_en) = 'door';
UPDATE public.study_vocabularies SET display_order = 4 WHERE LOWER(concept_code) = 'window' OR LOWER(word_en) = 'window';
UPDATE public.study_vocabularies SET display_order = 5 WHERE LOWER(concept_code) = 'bed' OR LOWER(word_en) = 'bed';
UPDATE public.study_vocabularies SET display_order = 6 WHERE LOWER(concept_code) = 'chair' OR LOWER(word_en) = 'chair';
UPDATE public.study_vocabularies SET display_order = 7 WHERE LOWER(concept_code) = 'table' OR LOWER(word_en) = 'table';
UPDATE public.study_vocabularies SET display_order = 8 WHERE LOWER(concept_code) = 'lamp' OR LOWER(word_en) = 'lamp';
UPDATE public.study_vocabularies SET display_order = 9 WHERE LOWER(concept_code) = 'key' OR LOWER(word_en) = 'key';
UPDATE public.study_vocabularies SET display_order = 10 WHERE LOWER(concept_code) = 'phone' OR LOWER(word_en) = 'phone';

-- Lesson 4: Food
UPDATE public.study_vocabularies SET display_order = 1 WHERE LOWER(concept_code) = 'food' OR LOWER(word_en) = 'food';
UPDATE public.study_vocabularies SET display_order = 2 WHERE LOWER(concept_code) = 'rice' OR LOWER(word_en) = 'rice';
UPDATE public.study_vocabularies SET display_order = 3 WHERE LOWER(concept_code) = 'bread' OR LOWER(word_en) = 'bread';
UPDATE public.study_vocabularies SET display_order = 4 WHERE LOWER(concept_code) = 'apple' OR LOWER(word_en) = 'apple';
UPDATE public.study_vocabularies SET display_order = 5 WHERE LOWER(concept_code) = 'banana' OR LOWER(word_en) = 'banana';
UPDATE public.study_vocabularies SET display_order = 6 WHERE LOWER(concept_code) = 'egg' OR LOWER(word_en) = 'egg';
UPDATE public.study_vocabularies SET display_order = 7 WHERE LOWER(concept_code) = 'milk' OR LOWER(word_en) = 'milk';
UPDATE public.study_vocabularies SET display_order = 8 WHERE LOWER(concept_code) = 'water' OR LOWER(word_en) = 'water';
UPDATE public.study_vocabularies SET display_order = 9 WHERE LOWER(concept_code) = 'coffee' OR LOWER(word_en) = 'coffee';
UPDATE public.study_vocabularies SET display_order = 10 WHERE LOWER(concept_code) = 'cake' OR LOWER(word_en) = 'cake';

-- Lesson 5: Actions
UPDATE public.study_vocabularies SET display_order = 1 WHERE LOWER(concept_code) = 'sit' OR LOWER(word_en) = 'sit';
UPDATE public.study_vocabularies SET display_order = 2 WHERE LOWER(concept_code) = 'stand' OR LOWER(word_en) = 'stand';
UPDATE public.study_vocabularies SET display_order = 3 WHERE LOWER(concept_code) = 'write' OR LOWER(word_en) = 'write';
UPDATE public.study_vocabularies SET display_order = 4 WHERE LOWER(concept_code) = 'play' OR LOWER(word_en) = 'play';
UPDATE public.study_vocabularies SET display_order = 5 WHERE LOWER(concept_code) = 'eat' OR LOWER(word_en) = 'eat';
UPDATE public.study_vocabularies SET display_order = 6 WHERE LOWER(concept_code) = 'drink' OR LOWER(word_en) = 'drink';
UPDATE public.study_vocabularies SET display_order = 7 WHERE LOWER(concept_code) = 'walk' OR LOWER(word_en) = 'walk';
UPDATE public.study_vocabularies SET display_order = 8 WHERE LOWER(concept_code) = 'run' OR LOWER(word_en) = 'run';
UPDATE public.study_vocabularies SET display_order = 9 WHERE LOWER(concept_code) = 'sleep' OR LOWER(word_en) = 'sleep';
UPDATE public.study_vocabularies SET display_order = 10 WHERE LOWER(concept_code) = 'read' OR LOWER(word_en) = 'read';

-- Lesson 6: Animals
UPDATE public.study_vocabularies SET display_order = 1 WHERE LOWER(concept_code) = 'dog' OR LOWER(word_en) = 'dog';
UPDATE public.study_vocabularies SET display_order = 2 WHERE LOWER(concept_code) = 'cat' OR LOWER(word_en) = 'cat';
UPDATE public.study_vocabularies SET display_order = 3 WHERE LOWER(concept_code) = 'bird' OR LOWER(word_en) = 'bird';
UPDATE public.study_vocabularies SET display_order = 4 WHERE LOWER(concept_code) = 'fish' OR LOWER(word_en) = 'fish';
UPDATE public.study_vocabularies SET display_order = 5 WHERE LOWER(concept_code) = 'horse' OR LOWER(word_en) = 'horse';
UPDATE public.study_vocabularies SET display_order = 6 WHERE LOWER(concept_code) = 'cow' OR LOWER(word_en) = 'cow';
UPDATE public.study_vocabularies SET display_order = 7 WHERE LOWER(concept_code) = 'pig' OR LOWER(word_en) = 'pig';
UPDATE public.study_vocabularies SET display_order = 8 WHERE LOWER(concept_code) = 'lion' OR LOWER(word_en) = 'lion';
UPDATE public.study_vocabularies SET display_order = 9 WHERE LOWER(concept_code) = 'monkey' OR LOWER(word_en) = 'monkey';
UPDATE public.study_vocabularies SET display_order = 10 WHERE LOWER(concept_code) = 'rabbit' OR LOWER(word_en) = 'rabbit';

-- Lesson 7: Colors
UPDATE public.study_vocabularies SET display_order = 1 WHERE LOWER(concept_code) = 'red' OR LOWER(word_en) = 'red';
UPDATE public.study_vocabularies SET display_order = 2 WHERE LOWER(concept_code) = 'blue' OR LOWER(word_en) = 'blue';
UPDATE public.study_vocabularies SET display_order = 3 WHERE LOWER(concept_code) = 'green' OR LOWER(word_en) = 'green';
UPDATE public.study_vocabularies SET display_order = 4 WHERE LOWER(concept_code) = 'yellow' OR LOWER(word_en) = 'yellow';
UPDATE public.study_vocabularies SET display_order = 5 WHERE LOWER(concept_code) = 'black' OR LOWER(word_en) = 'black';
UPDATE public.study_vocabularies SET display_order = 6 WHERE LOWER(concept_code) = 'white' OR LOWER(word_en) = 'white';
UPDATE public.study_vocabularies SET display_order = 7 WHERE LOWER(concept_code) = 'pink' OR LOWER(word_en) = 'pink';
UPDATE public.study_vocabularies SET display_order = 8 WHERE LOWER(concept_code) = 'orange' OR LOWER(word_en) = 'orange';
UPDATE public.study_vocabularies SET display_order = 9 WHERE LOWER(concept_code) = 'purple' OR LOWER(word_en) = 'purple';
UPDATE public.study_vocabularies SET display_order = 10 WHERE LOWER(concept_code) = 'brown' OR LOWER(word_en) = 'brown';

-- Lesson 8: Places
UPDATE public.study_vocabularies SET display_order = 1 WHERE LOWER(concept_code) = 'school' OR LOWER(word_en) = 'school';
UPDATE public.study_vocabularies SET display_order = 2 WHERE LOWER(concept_code) = 'home' OR LOWER(word_en) = 'home';
UPDATE public.study_vocabularies SET display_order = 3 WHERE LOWER(concept_code) = 'store' OR LOWER(word_en) = 'store';
UPDATE public.study_vocabularies SET display_order = 4 WHERE LOWER(concept_code) = 'hospital' OR LOWER(word_en) = 'hospital';
UPDATE public.study_vocabularies SET display_order = 5 WHERE LOWER(concept_code) = 'park' OR LOWER(word_en) = 'park';
UPDATE public.study_vocabularies SET display_order = 6 WHERE LOWER(concept_code) = 'bank' OR LOWER(word_en) = 'bank';
UPDATE public.study_vocabularies SET display_order = 7 WHERE LOWER(concept_code) = 'restaurant' OR LOWER(word_en) = 'restaurant';
UPDATE public.study_vocabularies SET display_order = 8 WHERE LOWER(concept_code) = 'airport' OR LOWER(word_en) = 'airport';
UPDATE public.study_vocabularies SET display_order = 9 WHERE LOWER(concept_code) = 'hotel' OR LOWER(word_en) = 'hotel';
UPDATE public.study_vocabularies SET display_order = 10 WHERE LOWER(concept_code) = 'beach' OR LOWER(word_en) = 'beach';

-- Lesson 9: Travel
UPDATE public.study_vocabularies SET display_order = 1 WHERE LOWER(concept_code) = 'car' OR LOWER(word_en) = 'car';
UPDATE public.study_vocabularies SET display_order = 2 WHERE LOWER(concept_code) = 'bus' OR LOWER(word_en) = 'bus';
UPDATE public.study_vocabularies SET display_order = 3 WHERE LOWER(concept_code) = 'train' OR LOWER(word_en) = 'train';
UPDATE public.study_vocabularies SET display_order = 4 WHERE LOWER(concept_code) = 'plane' OR LOWER(word_en) = 'plane';
UPDATE public.study_vocabularies SET display_order = 5 WHERE LOWER(concept_code) = 'ship' OR LOWER(word_en) = 'ship';
UPDATE public.study_vocabularies SET display_order = 6 WHERE LOWER(concept_code) = 'road' OR LOWER(word_en) = 'road';
UPDATE public.study_vocabularies SET display_order = 7 WHERE LOWER(concept_code) = 'map' OR LOWER(word_en) = 'map';
UPDATE public.study_vocabularies SET display_order = 8 WHERE LOWER(concept_code) = 'bag' OR LOWER(word_en) = 'bag';
UPDATE public.study_vocabularies SET display_order = 9 WHERE LOWER(concept_code) = 'ticket' OR LOWER(word_en) = 'ticket';
UPDATE public.study_vocabularies SET display_order = 10 WHERE LOWER(concept_code) = 'camera' OR LOWER(word_en) = 'camera';

-- Lesson 10: Feelings
UPDATE public.study_vocabularies SET display_order = 1 WHERE LOWER(concept_code) = 'good' OR LOWER(word_en) = 'good';
UPDATE public.study_vocabularies SET display_order = 2 WHERE LOWER(concept_code) = 'bad' OR LOWER(word_en) = 'bad';
UPDATE public.study_vocabularies SET display_order = 3 WHERE LOWER(concept_code) = 'sad' OR LOWER(word_en) = 'sad';
UPDATE public.study_vocabularies SET display_order = 4 WHERE LOWER(concept_code) = 'angry' OR LOWER(word_en) = 'angry';
UPDATE public.study_vocabularies SET display_order = 5 WHERE LOWER(concept_code) = 'tired' OR LOWER(word_en) = 'tired';
UPDATE public.study_vocabularies SET display_order = 6 WHERE LOWER(concept_code) = 'hungry' OR LOWER(word_en) = 'hungry';
UPDATE public.study_vocabularies SET display_order = 7 WHERE LOWER(concept_code) = 'thirsty' OR LOWER(word_en) = 'thirsty';
UPDATE public.study_vocabularies SET display_order = 8 WHERE LOWER(concept_code) = 'sick' OR LOWER(word_en) = 'sick';
UPDATE public.study_vocabularies SET display_order = 9 WHERE LOWER(concept_code) = 'busy' OR LOWER(word_en) = 'busy';
UPDATE public.study_vocabularies SET display_order = 10 WHERE LOWER(concept_code) = 'free' OR LOWER(word_en) = 'free';

NOTIFY pgrst, 'reload schema';
