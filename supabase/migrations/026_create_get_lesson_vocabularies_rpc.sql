-- ============================================================
-- Migration 026: RPC Function for Bypassing Foreign Table 400 Errors
-- Performs DB-level JOIN between ai_lesson_vocabulary and study_vocabularies
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_lesson_vocabularies(p_lesson_id UUID)
RETURNS TABLE (
  id UUID,
  lesson_id UUID,
  vocabulary_id UUID,
  display_order INT,
  word_en VARCHAR,
  word_ko VARCHAR,
  example_en TEXT,
  example_ko TEXT,
  phonetic_en VARCHAR,
  image_url TEXT
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    alv.id,
    alv.lesson_id,
    alv.vocabulary_id,
    alv.display_order,
    sv.word_en,
    sv.word_ko,
    sv.example_en,
    sv.example_ko,
    sv.phonetic_en,
    NULL::TEXT AS image_url
  FROM public.ai_lesson_vocabulary alv
  LEFT JOIN public.study_vocabularies sv ON sv.id = alv.vocabulary_id
  WHERE alv.lesson_id = p_lesson_id
  ORDER BY alv.display_order ASC;
$$;

GRANT EXECUTE ON FUNCTION public.get_lesson_vocabularies(UUID) TO anon, authenticated, service_role, postgres;

NOTIFY pgrst, 'reload schema';
