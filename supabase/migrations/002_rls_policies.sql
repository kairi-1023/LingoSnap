-- ============================================================
-- Together Lingo Migration 002: Row Level Security (RLS) Policies
-- Security Boundaries for 1:1 Couple Isolation
-- ============================================================

-- 1. Enable RLS on All Public Tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.couples ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorite_words ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.words ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------
-- Security Helper Function: is_couple_member
-- Checks if the authenticated user belongs to the specified couple_id
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_couple_member(check_couple_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.couples
        WHERE id = check_couple_id
          AND (user1_id = auth.uid() OR user2_id = auth.uid())
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ------------------------------------------------------------
-- 2. Users Table RLS Policies
-- ------------------------------------------------------------
-- Policy 1: Read own user record OR matched partner user record
CREATE POLICY "users_select_policy"
    ON public.users FOR SELECT
    TO authenticated
    USING (
        id = auth.uid() OR 
        current_couple_id IN (
            SELECT id FROM public.couples 
            WHERE user1_id = auth.uid() OR user2_id = auth.uid()
        )
    );

-- Policy 2: Update only own user record
CREATE POLICY "users_update_policy"
    ON public.users FOR UPDATE
    TO authenticated
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

-- Policy 3: Insert own user record on signup
CREATE POLICY "users_insert_policy"
    ON public.users FOR INSERT
    TO authenticated
    WITH CHECK (id = auth.uid());

-- Policy 4: Delete own user record
CREATE POLICY "users_delete_policy"
    ON public.users FOR DELETE
    TO authenticated
    USING (id = auth.uid());

-- ------------------------------------------------------------
-- 3. Couples Table RLS Policies
-- ------------------------------------------------------------
-- Policy 1: Read couple record if user is member (user1 or user2)
CREATE POLICY "couples_select_policy"
    ON public.couples FOR SELECT
    TO authenticated
    USING (user1_id = auth.uid() OR user2_id = auth.uid());

-- Policy 2: Update couple record if user is member (e.g. connecting code)
CREATE POLICY "couples_update_policy"
    ON public.couples FOR UPDATE
    TO authenticated
    USING (user1_id = auth.uid() OR user2_id = auth.uid())
    WITH CHECK (user1_id = auth.uid() OR user2_id = auth.uid());

-- Policy 3: Insert new couple room (user1 must be auth.uid())
CREATE POLICY "couples_insert_policy"
    ON public.couples FOR INSERT
    TO authenticated
    WITH CHECK (user1_id = auth.uid());

-- ------------------------------------------------------------
-- 4. Study Logs Table RLS Policies
-- ------------------------------------------------------------
CREATE POLICY "study_logs_all_policy"
    ON public.study_logs FOR ALL
    TO authenticated
    USING (public.is_couple_member(couple_id))
    WITH CHECK (public.is_couple_member(couple_id) AND user_id = auth.uid());

-- ------------------------------------------------------------
-- 5. Streaks Table RLS Policies
-- ------------------------------------------------------------
CREATE POLICY "streaks_all_policy"
    ON public.streaks FOR ALL
    TO authenticated
    USING (public.is_couple_member(couple_id))
    WITH CHECK (public.is_couple_member(couple_id));

-- ------------------------------------------------------------
-- 6. Shared Diaries Table RLS Policies
-- ------------------------------------------------------------
CREATE POLICY "diaries_select_policy"
    ON public.diaries FOR SELECT
    TO authenticated
    USING (public.is_couple_member(couple_id) AND deleted_at IS NULL);

CREATE POLICY "diaries_insert_policy"
    ON public.diaries FOR INSERT
    TO authenticated
    WITH CHECK (public.is_couple_member(couple_id) AND author_id = auth.uid());

CREATE POLICY "diaries_update_policy"
    ON public.diaries FOR UPDATE
    TO authenticated
    USING (public.is_couple_member(couple_id) AND author_id = auth.uid());

CREATE POLICY "diaries_delete_policy"
    ON public.diaries FOR DELETE
    TO authenticated
    USING (public.is_couple_member(couple_id) AND author_id = auth.uid());

-- ------------------------------------------------------------
-- 7. Favorite Words Table RLS Policies
-- ------------------------------------------------------------
CREATE POLICY "favorite_words_all_policy"
    ON public.favorite_words FOR ALL
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- ------------------------------------------------------------
-- 8. Words (Dictionary) Table RLS Policy
-- ------------------------------------------------------------
CREATE POLICY "words_select_policy"
    ON public.words FOR SELECT
    TO authenticated
    USING (true);
