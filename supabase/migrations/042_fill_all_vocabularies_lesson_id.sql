-- ============================================================
-- Migration 042: Fill all study_vocabularies.lesson_id (1:N Linkage)
-- Updates lesson_id for all 100 vocabularies by category/concept_code
-- ============================================================

-- Lesson 1: Greetings & Me
UPDATE public.study_vocabularies
SET lesson_id = 'c0000000-0000-0000-0000-000000000001'
WHERE LOWER(category) = 'greetings'
   OR LOWER(concept_code) IN ('hello', 'bye', 'i', 'you', 'name', 'friend', 'happy', 'love', 'like', 'smile')
   OR LOWER(word_en) IN ('hello', 'bye', 'i', 'you', 'name', 'friend', 'happy', 'love', 'like', 'smile');

-- Lesson 2: Family
UPDATE public.study_vocabularies
SET lesson_id = 'c0000000-0000-0000-0000-000000000002'
WHERE LOWER(category) = 'family'
   OR LOWER(concept_code) IN ('family', 'mother', 'father', 'baby', 'brother', 'sister', 'grandma', 'grandpa', 'son', 'daughter')
   OR LOWER(word_en) IN ('family', 'mother', 'father', 'baby', 'brother', 'sister', 'grandma', 'grandpa', 'son', 'daughter');

-- Lesson 3: Home
UPDATE public.study_vocabularies
SET lesson_id = 'c0000000-0000-0000-0000-000000000003'
WHERE LOWER(category) = 'home'
   OR LOWER(concept_code) IN ('house', 'room', 'door', 'window', 'bed', 'chair', 'table', 'lamp', 'key', 'phone')
   OR LOWER(word_en) IN ('house', 'room', 'door', 'window', 'bed', 'chair', 'table', 'lamp', 'key', 'phone');

-- Lesson 4: Food
UPDATE public.study_vocabularies
SET lesson_id = 'c0000000-0000-0000-0000-000000000004'
WHERE LOWER(category) = 'food'
   OR LOWER(concept_code) IN ('food', 'rice', 'bread', 'apple', 'banana', 'egg', 'milk', 'water', 'coffee', 'cake')
   OR LOWER(word_en) IN ('food', 'rice', 'bread', 'apple', 'banana', 'egg', 'milk', 'water', 'coffee', 'cake');

-- Lesson 5: Actions
UPDATE public.study_vocabularies
SET lesson_id = 'c0000000-0000-0000-0000-000000000005'
WHERE LOWER(category) IN ('actions', 'daily_actions', 'movement')
   OR LOWER(concept_code) IN ('sit', 'stand', 'write', 'play', 'eat', 'drink', 'walk', 'run', 'sleep', 'read')
   OR LOWER(word_en) IN ('sit', 'stand', 'write', 'play', 'eat', 'drink', 'walk', 'run', 'sleep', 'read');

-- Lesson 6: Animals
UPDATE public.study_vocabularies
SET lesson_id = 'c0000000-0000-0000-0000-000000000006'
WHERE LOWER(category) = 'animals'
   OR LOWER(concept_code) IN ('dog', 'cat', 'bird', 'fish', 'horse', 'cow', 'pig', 'lion', 'monkey', 'rabbit')
   OR LOWER(word_en) IN ('dog', 'cat', 'bird', 'fish', 'horse', 'cow', 'pig', 'lion', 'monkey', 'rabbit');

-- Lesson 7: Colors
UPDATE public.study_vocabularies
SET lesson_id = 'c0000000-0000-0000-0000-000000000007'
WHERE LOWER(category) = 'colors'
   OR LOWER(concept_code) IN ('red', 'blue', 'green', 'yellow', 'black', 'white', 'pink', 'orange', 'purple', 'brown')
   OR LOWER(word_en) IN ('red', 'blue', 'green', 'yellow', 'black', 'white', 'pink', 'orange', 'purple', 'brown');

-- Lesson 8: Places
UPDATE public.study_vocabularies
SET lesson_id = 'c0000000-0000-0000-0000-000000000008'
WHERE LOWER(category) = 'places'
   OR LOWER(concept_code) IN ('school', 'home', 'store', 'hospital', 'park', 'bank', 'restaurant', 'airport', 'hotel', 'beach')
   OR LOWER(word_en) IN ('school', 'home', 'store', 'hospital', 'park', 'bank', 'restaurant', 'airport', 'hotel', 'beach');

-- Lesson 9: Travel
UPDATE public.study_vocabularies
SET lesson_id = 'c0000000-0000-0000-0000-000000000009'
WHERE LOWER(category) = 'travel'
   OR LOWER(concept_code) IN ('car', 'bus', 'train', 'plane', 'ship', 'road', 'map', 'bag', 'ticket', 'camera')
   OR LOWER(word_en) IN ('car', 'bus', 'train', 'plane', 'ship', 'road', 'map', 'bag', 'ticket', 'camera');

-- Lesson 10: Feelings
UPDATE public.study_vocabularies
SET lesson_id = 'c0000000-0000-0000-0000-000000000010'
WHERE LOWER(category) = 'feelings'
   OR LOWER(concept_code) IN ('good', 'bad', 'sad', 'angry', 'tired', 'hungry', 'thirsty', 'sick', 'busy', 'free')
   OR LOWER(word_en) IN ('good', 'bad', 'sad', 'angry', 'tired', 'hungry', 'thirsty', 'sick', 'busy', 'free');

-- MVP Default Action Lesson Link Sync
UPDATE public.study_vocabularies
SET lesson_id = '11111111-1111-1111-1111-111111111111'
WHERE lesson_id = 'c0000000-0000-0000-0000-000000000005';

NOTIFY pgrst, 'reload schema';
