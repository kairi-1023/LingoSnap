-- Migration 17: Add TTS audio columns to study_vocabularies
-- Supports high-quality pre-generated TTS audio file storage for Chirp 3 HD / Neural TTS

ALTER TABLE IF EXISTS public.study_vocabularies
  ADD COLUMN IF NOT EXISTS tts_audio_url TEXT,
  ADD COLUMN IF NOT EXISTS tts_provider TEXT,
  ADD COLUMN IF NOT EXISTS tts_voice_name TEXT,
  ADD COLUMN IF NOT EXISTS tts_generated_at TIMESTAMPTZ;

-- Index for future lookups by tts_provider
CREATE INDEX IF NOT EXISTS idx_study_vocabularies_tts
  ON public.study_vocabularies (tts_provider)
  WHERE tts_provider IS NOT NULL;

COMMENT ON COLUMN public.study_vocabularies.tts_audio_url IS 'Supabase Storage URL or CDN URL for pre-generated high-quality TTS audio file';
COMMENT ON COLUMN public.study_vocabularies.tts_provider IS 'TTS provider identifier (e.g. google_chirp3, amazon_polly, openai_tts)';
COMMENT ON COLUMN public.study_vocabularies.tts_voice_name IS 'Voice name used for generation (e.g. en-US-Chirp3-HD-Aoede)';
COMMENT ON COLUMN public.study_vocabularies.tts_generated_at IS 'Timestamp when the TTS audio was generated';
