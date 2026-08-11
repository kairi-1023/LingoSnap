-- ============================================================
-- Migration 035: Allow Public Update on study_vocabularies
-- Permits updating tts_audio_url and other metadata fields
-- ============================================================

ALTER TABLE public.study_vocabularies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public all on study_vocabularies" ON public.study_vocabularies;
CREATE POLICY "Allow public all on study_vocabularies" 
ON public.study_vocabularies 
FOR ALL 
USING (true) 
WITH CHECK (true);

GRANT ALL ON public.study_vocabularies TO anon, authenticated, service_role, postgres;

NOTIFY pgrst, 'reload schema';
