-- ============================================================
-- Together Lingo Migration 018: Clean Users Table Schema & RLS
-- Based on real db-current.csv table structure
-- ============================================================

-- 1. Ensure updated_at and current_couple_id columns exist on public.users
ALTER TABLE public.users
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW(),
    ADD COLUMN IF NOT EXISTS current_couple_id UUID;

-- 2. Enable Row Level Security (RLS) on public.users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 3. Ensure SELECT RLS Policy for Authenticated Users
DROP POLICY IF EXISTS "users_select_policy" ON public.users;
CREATE POLICY "users_select_policy"
    ON public.users FOR SELECT
    TO authenticated
    USING (id = auth.uid());

-- 4. Ensure INSERT RLS Policy for Authenticated Users
DROP POLICY IF EXISTS "users_insert_policy" ON public.users;
CREATE POLICY "users_insert_policy"
    ON public.users FOR INSERT
    TO authenticated
    WITH CHECK (id = auth.uid());

-- 5. Ensure UPDATE RLS Policy for Authenticated Users
DROP POLICY IF EXISTS "users_update_policy" ON public.users;
CREATE POLICY "users_update_policy"
    ON public.users FOR UPDATE
    TO authenticated
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());
