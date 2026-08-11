-- ============================================================
-- Migration 021: Grant Access & Reload PostgREST Schema Cache
-- Resolves 400 Bad Request on study_vocabularies by clearing PostgREST schema cache
-- ============================================================

-- 1. Grant SELECT & ALL privileges to all Supabase API roles
GRANT ALL ON public.study_vocabularies TO anon, authenticated, service_role, postgres;

-- 2. Notify PostgREST to immediately reload its schema cache
NOTIFY pgrst, 'reload schema';
