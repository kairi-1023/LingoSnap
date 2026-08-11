-- ============================================================
-- Migration: Add profile columns to public.users
-- display_name / avatar_url are used by the app (authRepository,
-- partnerRepository) but were missing from the versioned schema,
-- which caused user-row upserts to fail and blocked invite code
-- generation (couples.user1_id FK violation).
-- ============================================================

ALTER TABLE public.users
    ADD COLUMN IF NOT EXISTS display_name TEXT,
    ADD COLUMN IF NOT EXISTS avatar_url TEXT;
