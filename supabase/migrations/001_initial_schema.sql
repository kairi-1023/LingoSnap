-- ============================================================
-- Together Lingo Migration 001: 3NF Normalized Initial Schema
-- Includes Tables, Constraints, Performance Indexes & Triggers
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------
-- 1. Users Table (Maps 1:1 with Supabase Auth)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    native_lang VARCHAR(10) NOT NULL DEFAULT 'ko' CHECK (native_lang IN ('ko', 'en', 'tl', 'ja', 'zh', 'vi', 'es', 'fr', 'de', 'th', 'id', 'ru')),
    target_lang VARCHAR(10) NOT NULL DEFAULT 'en' CHECK (target_lang IN ('ko', 'en', 'tl', 'ja', 'zh', 'vi', 'es', 'fr', 'de', 'th', 'id', 'ru')),
    current_couple_id UUID,
    push_token TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 2. Couples Table (1:1 Couple Relationship)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.couples (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invite_code VARCHAR(12) UNIQUE NOT NULL CHECK (char_length(invite_code) >= 6),
    user1_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    user2_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT check_different_users CHECK (user1_id <> user2_id)
);

-- Foreign Key Constraint for users.current_couple_id
ALTER TABLE public.users 
    DROP CONSTRAINT IF EXISTS fk_users_couple,
    ADD CONSTRAINT fk_users_couple 
    FOREIGN KEY (current_couple_id) 
    REFERENCES public.couples(id) 
    ON DELETE SET NULL;

-- ------------------------------------------------------------
-- 3. Words Table (Shared Vocabulary Dictionary)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.words (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    word_native TEXT NOT NULL,
    word_target TEXT NOT NULL,
    phonetic TEXT,
    example_sentence TEXT,
    category VARCHAR(50) NOT NULL DEFAULT 'general' CHECK (category IN ('general', 'words', 'expression', 'sentence')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 4. Study Logs Table (Timezone-Safe Daily Study Log)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.study_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    couple_id UUID NOT NULL REFERENCES public.couples(id) ON DELETE CASCADE,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    local_date DATE NOT NULL,
    xp_gained INT NOT NULL DEFAULT 20 CHECK (xp_gained >= 0),
    CONSTRAINT unique_user_daily_study UNIQUE (user_id, local_date)
);

-- ------------------------------------------------------------
-- 5. Streaks Table (1:1 Couple Streak Counter)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.streaks (
    couple_id UUID PRIMARY KEY REFERENCES public.couples(id) ON DELETE CASCADE,
    current_streak INT NOT NULL DEFAULT 0 CHECK (current_streak >= 0),
    last_study_date DATE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 6. Shared Diaries Table (Couple Diary Entries)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.diaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    couple_id UUID NOT NULL REFERENCES public.couples(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL CHECK (char_length(trim(content)) > 0),
    attached_word_ids UUID[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- ------------------------------------------------------------
-- 7. Favorite Words Table (User Saved Vocabulary)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.favorite_words (
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    word_id UUID NOT NULL REFERENCES public.words(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, word_id)
);

-- ============================================================
-- PERFORMANCE INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_users_current_couple ON public.users(current_couple_id);
CREATE INDEX IF NOT EXISTS idx_couples_invite_code ON public.couples(invite_code);
CREATE INDEX IF NOT EXISTS idx_study_logs_user_date ON public.study_logs(user_id, local_date);
CREATE INDEX IF NOT EXISTS idx_study_logs_couple ON public.study_logs(couple_id);
CREATE INDEX IF NOT EXISTS idx_diaries_couple_date ON public.diaries(couple_id, created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_favorite_words_user ON public.favorite_words(user_id);

-- ============================================================
-- AUTOMATED TIMESTAMPTZ TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_users_modtime
BEFORE UPDATE ON public.users
FOR EACH ROW EXECUTE FUNCTION public.update_timestamp_column();

CREATE OR REPLACE TRIGGER update_couples_modtime
BEFORE UPDATE ON public.couples
FOR EACH ROW EXECUTE FUNCTION public.update_timestamp_column();

CREATE OR REPLACE TRIGGER update_diaries_modtime
BEFORE UPDATE ON public.diaries
FOR EACH ROW EXECUTE FUNCTION public.update_timestamp_column();
