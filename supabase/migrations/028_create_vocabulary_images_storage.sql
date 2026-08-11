-- ====================================================================
-- 1. Create Public Storage Bucket 'vocabulary-images'
-- ====================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('vocabulary-images', 'vocabulary-images', true, 10485760, ARRAY['image/webp', 'image/png', 'image/jpeg'])
ON CONFLICT (id) DO UPDATE SET public = true;

-- ====================================================================
-- 2. Storage RLS Security Policies for 'vocabulary-images'
-- ====================================================================
DROP POLICY IF EXISTS "Public Select Vocabulary Images" ON storage.objects;

DROP POLICY IF EXISTS "Public Upload Vocabulary Images" ON storage.objects;
CREATE POLICY "Public Upload Vocabulary Images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'vocabulary-images');

DROP POLICY IF EXISTS "Public Update Vocabulary Images" ON storage.objects;
CREATE POLICY "Public Update Vocabulary Images" ON storage.objects FOR UPDATE USING (bucket_id = 'vocabulary-images');

-- ====================================================================
-- 3. Step 1: Add image_url Column to study_vocabularies Table First
-- ====================================================================
ALTER TABLE public.study_vocabularies ADD COLUMN IF NOT EXISTS image_url TEXT;

-- ====================================================================
-- 4. Update image_url in study_vocabularies for 25 WebP Images
-- ====================================================================
UPDATE public.study_vocabularies SET image_url = 'https://ghdoqflateritxmnlnwa.supabase.co/storage/v1/object/public/vocabulary-images/baby.webp' WHERE LOWER(word_en) = 'baby' OR LOWER(concept_code) LIKE '%baby%';
UPDATE public.study_vocabularies SET image_url = 'https://ghdoqflateritxmnlnwa.supabase.co/storage/v1/object/public/vocabulary-images/brother.webp' WHERE LOWER(word_en) = 'brother' OR LOWER(concept_code) LIKE '%brother%';
UPDATE public.study_vocabularies SET image_url = 'https://ghdoqflateritxmnlnwa.supabase.co/storage/v1/object/public/vocabulary-images/bye.webp' WHERE LOWER(word_en) = 'bye' OR LOWER(word_en) LIKE '%goodbye%' OR LOWER(concept_code) LIKE '%bye%';
UPDATE public.study_vocabularies SET image_url = 'https://ghdoqflateritxmnlnwa.supabase.co/storage/v1/object/public/vocabulary-images/daughter.webp' WHERE LOWER(word_en) = 'daughter' OR LOWER(concept_code) LIKE '%daughter%';
UPDATE public.study_vocabularies SET image_url = 'https://ghdoqflateritxmnlnwa.supabase.co/storage/v1/object/public/vocabulary-images/door.webp' WHERE LOWER(word_en) = 'door' OR LOWER(concept_code) LIKE '%door%';
UPDATE public.study_vocabularies SET image_url = 'https://ghdoqflateritxmnlnwa.supabase.co/storage/v1/object/public/vocabulary-images/eat.webp' WHERE LOWER(word_en) = 'eat' OR LOWER(concept_code) LIKE '%eat%';
UPDATE public.study_vocabularies SET image_url = 'https://ghdoqflateritxmnlnwa.supabase.co/storage/v1/object/public/vocabulary-images/family.webp' WHERE LOWER(word_en) = 'family' OR LOWER(concept_code) LIKE '%family%';
UPDATE public.study_vocabularies SET image_url = 'https://ghdoqflateritxmnlnwa.supabase.co/storage/v1/object/public/vocabulary-images/father.webp' WHERE LOWER(word_en) = 'father' OR LOWER(concept_code) LIKE '%father%';
UPDATE public.study_vocabularies SET image_url = 'https://ghdoqflateritxmnlnwa.supabase.co/storage/v1/object/public/vocabulary-images/friend.webp' WHERE LOWER(word_en) = 'friend' OR LOWER(concept_code) LIKE '%friend%';
UPDATE public.study_vocabularies SET image_url = 'https://ghdoqflateritxmnlnwa.supabase.co/storage/v1/object/public/vocabulary-images/grandma.webp' WHERE LOWER(word_en) = 'grandma' OR LOWER(concept_code) LIKE '%grandma%';
UPDATE public.study_vocabularies SET image_url = 'https://ghdoqflateritxmnlnwa.supabase.co/storage/v1/object/public/vocabulary-images/grandpa.webp' WHERE LOWER(word_en) = 'grandpa' OR LOWER(concept_code) LIKE '%grandpa%';
UPDATE public.study_vocabularies SET image_url = 'https://ghdoqflateritxmnlnwa.supabase.co/storage/v1/object/public/vocabulary-images/happy.webp' WHERE LOWER(word_en) = 'happy' OR LOWER(concept_code) LIKE '%happy%';
UPDATE public.study_vocabularies SET image_url = 'https://ghdoqflateritxmnlnwa.supabase.co/storage/v1/object/public/vocabulary-images/hello.webp' WHERE LOWER(word_en) = 'hello' OR LOWER(concept_code) LIKE '%hello%';
UPDATE public.study_vocabularies SET image_url = 'https://ghdoqflateritxmnlnwa.supabase.co/storage/v1/object/public/vocabulary-images/house.webp' WHERE LOWER(word_en) = 'house' OR LOWER(concept_code) LIKE '%house%';
UPDATE public.study_vocabularies SET image_url = 'https://ghdoqflateritxmnlnwa.supabase.co/storage/v1/object/public/vocabulary-images/i.webp' WHERE LOWER(word_en) = 'i' OR LOWER(concept_code) LIKE '%i%';
UPDATE public.study_vocabularies SET image_url = 'https://ghdoqflateritxmnlnwa.supabase.co/storage/v1/object/public/vocabulary-images/like.webp' WHERE LOWER(word_en) = 'like' OR LOWER(concept_code) LIKE '%like%';
UPDATE public.study_vocabularies SET image_url = 'https://ghdoqflateritxmnlnwa.supabase.co/storage/v1/object/public/vocabulary-images/love.webp' WHERE LOWER(word_en) = 'love' OR LOWER(concept_code) LIKE '%love%';
UPDATE public.study_vocabularies SET image_url = 'https://ghdoqflateritxmnlnwa.supabase.co/storage/v1/object/public/vocabulary-images/mother.webp' WHERE LOWER(word_en) = 'mother' OR LOWER(concept_code) LIKE '%mother%';
UPDATE public.study_vocabularies SET image_url = 'https://ghdoqflateritxmnlnwa.supabase.co/storage/v1/object/public/vocabulary-images/name.webp' WHERE LOWER(word_en) = 'name' OR LOWER(concept_code) LIKE '%name%';
UPDATE public.study_vocabularies SET image_url = 'https://ghdoqflateritxmnlnwa.supabase.co/storage/v1/object/public/vocabulary-images/room.webp' WHERE LOWER(word_en) = 'room' OR LOWER(concept_code) LIKE '%room%';
UPDATE public.study_vocabularies SET image_url = 'https://ghdoqflateritxmnlnwa.supabase.co/storage/v1/object/public/vocabulary-images/sister.webp' WHERE LOWER(word_en) = 'sister' OR LOWER(concept_code) LIKE '%sister%';
UPDATE public.study_vocabularies SET image_url = 'https://ghdoqflateritxmnlnwa.supabase.co/storage/v1/object/public/vocabulary-images/smile.webp' WHERE LOWER(word_en) = 'smile' OR LOWER(concept_code) LIKE '%smile%';
UPDATE public.study_vocabularies SET image_url = 'https://ghdoqflateritxmnlnwa.supabase.co/storage/v1/object/public/vocabulary-images/son.webp' WHERE LOWER(word_en) = 'son' OR LOWER(concept_code) LIKE '%son%';
UPDATE public.study_vocabularies SET image_url = 'https://ghdoqflateritxmnlnwa.supabase.co/storage/v1/object/public/vocabulary-images/windows.webp' WHERE LOWER(word_en) LIKE '%window%' OR LOWER(concept_code) LIKE '%window%';
UPDATE public.study_vocabularies SET image_url = 'https://ghdoqflateritxmnlnwa.supabase.co/storage/v1/object/public/vocabulary-images/you.webp' WHERE LOWER(word_en) = 'you' OR LOWER(concept_code) LIKE '%you%';

-- Also update ai_lessons image_url if lesson title matches
UPDATE public.ai_lessons SET image_url = 'https://ghdoqflateritxmnlnwa.supabase.co/storage/v1/object/public/vocabulary-images/family.webp' WHERE LOWER(title) LIKE '%family%' OR LOWER(title) LIKE '%home%';

NOTIFY pgrst, 'reload schema';
