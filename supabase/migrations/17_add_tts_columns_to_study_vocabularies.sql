-- Migration: 17_add_tts_columns_to_study_vocabularies.sql
-- Description: Adds TTS (Text-to-Speech) columns to study_vocabularies table
-- for high-quality pre-generated audio file support.

ALTER TABLE public.study_vocabularies
  ADD COLUMN IF NOT EXISTS tts_audio_url TEXT,
  ADD COLUMN IF NOT EXISTS tts_provider TEXT,
  ADD COLUMN IF NOT EXISTS tts_voice_name TEXT,
  ADD COLUMN IF NOT EXISTS tts_generated_at TIMESTAMPTZ;

COMMENT ON COLUMN public.study_vocabularies.tts_audio_url IS 'Supabase Storage URL for pre-generated high-quality TTS audio file (e.g., Google Cloud Chirp 3 HD MP3)';
COMMENT ON COLUMN public.study_vocabularies.tts_provider IS 'TTS provider name (e.g., google_cloud, amazon_polly, azure)';
COMMENT ON COLUMN public.study_vocabularies.tts_voice_name IS 'Voice name used for generation (e.g., ko-KR-Chirp3-HD-Leda)';
COMMENT ON COLUMN public.study_vocabularies.tts_generated_at IS 'Timestamp when the TTS audio file was generated';
