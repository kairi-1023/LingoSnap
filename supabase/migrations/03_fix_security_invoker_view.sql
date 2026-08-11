-- Migration 03: Fix Security Definer View Warning for vw_couple_study_words
-- Set security_invoker = true so PostgreSQL enforces RLS policies of the querying user instead of the view creator.

ALTER VIEW public.vw_couple_study_words SET (security_invoker = true);
