-- Migration: 15_ensure_study_vocabularies_rls_public.sql
-- Description: Ensures study_vocabularies table has full RLS read/write access for anon, authenticated, and service_role

ALTER TABLE public.study_vocabularies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public all on study_vocabularies" ON public.study_vocabularies;
DROP POLICY IF EXISTS "Allow public read on study_vocabularies" ON public.study_vocabularies;

CREATE POLICY "Allow public all on study_vocabularies" 
ON public.study_vocabularies 
FOR ALL 
USING (true) 
WITH CHECK (true);

GRANT ALL ON public.study_vocabularies TO anon, authenticated, service_role;
