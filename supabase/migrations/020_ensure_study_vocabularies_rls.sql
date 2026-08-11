-- ============================================================
-- Migration 020: Grant SELECT on study_vocabularies Foreign Table/View
-- ============================================================

-- Grant SELECT privileges to anon, authenticated, and service_role
-- (RLS is not applicable to foreign tables or views)
GRANT SELECT ON public.study_vocabularies TO anon, authenticated, service_role;
