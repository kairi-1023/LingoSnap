-- ====================================================================
-- Migration 034: Create Public Storage Bucket 'tts-audio' & RLS Policies
-- ====================================================================

-- 1. Create Public Storage Bucket 'tts-audio'
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('tts-audio', 'tts-audio', true, 10485760, ARRAY['audio/mpeg', 'audio/mp3', 'audio/wav'])
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Storage RLS Security Policies for 'tts-audio'
DROP POLICY IF EXISTS "Public Select TTS Audio" ON storage.objects;
CREATE POLICY "Public Select TTS Audio" ON storage.objects FOR SELECT USING (bucket_id = 'tts-audio');

DROP POLICY IF EXISTS "Public Upload TTS Audio" ON storage.objects;
CREATE POLICY "Public Upload TTS Audio" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'tts-audio');

DROP POLICY IF EXISTS "Public Update TTS Audio" ON storage.objects;
CREATE POLICY "Public Update TTS Audio" ON storage.objects FOR UPDATE USING (bucket_id = 'tts-audio');

NOTIFY pgrst, 'reload schema';
