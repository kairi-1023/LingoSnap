-- ====================================================================
-- Complete Missing Tables, Views, RLS Policies and Schema Cache Reload
-- ====================================================================

-- 1. Create study_vocabularies Table if not exists
CREATE TABLE IF NOT EXISTS public.study_vocabularies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    concept_code VARCHAR(100),
    category VARCHAR(50) DEFAULT 'daily',
    difficulty_level VARCHAR(10) DEFAULT 'A1',
    word_ko TEXT,
    word_en TEXT,
    word_tl TEXT,
    word_es TEXT,
    word_ja TEXT,
    word_zh TEXT,
    word_vi TEXT,
    phonetic_ko TEXT,
    phonetic_en TEXT,
    phonetic_tl TEXT,
    phonetic_es TEXT,
    phonetic_ja TEXT,
    phonetic_zh TEXT,
    phonetic_vi TEXT,
    example_ko TEXT,
    example_en TEXT,
    example_tl TEXT,
    example_es TEXT,
    example_ja TEXT,
    example_zh TEXT,
    example_vi TEXT,
    tts_audio_url TEXT,
    tts_provider VARCHAR(50),
    tts_voice_name VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create user_studied_words Table if not exists
CREATE TABLE IF NOT EXISTS public.user_studied_words (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    concept_id UUID,
    srs_stage INT DEFAULT 1,
    next_review_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '1 day',
    last_reviewed_at TIMESTAMPTZ DEFAULT NOW(),
    review_count INT DEFAULT 0,
    wrong_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_studied_concept UNIQUE(user_id, concept_id)
);

-- 3. Create favorite_words Table if not exists
CREATE TABLE IF NOT EXISTS public.favorite_words (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    word_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_favorite_word UNIQUE(user_id, word_id)
);

-- 4. Create ai_quizzes Table if not exists
CREATE TABLE IF NOT EXISTS public.ai_quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID,
    user_id UUID,
    couple_id VARCHAR(100),
    title TEXT DEFAULT 'Quiz',
    description TEXT,
    score INT DEFAULT 0,
    completed BOOLEAN DEFAULT TRUE,
    passing_score INT DEFAULT 70,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create ai_review_items Table if not exists
CREATE TABLE IF NOT EXISTS public.ai_review_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    vocabulary_id UUID NOT NULL,
    srs_stage INT DEFAULT 1,
    next_review_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '1 day',
    last_reviewed_at TIMESTAMPTZ DEFAULT NOW(),
    correct_count INT DEFAULT 0,
    wrong_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_review_vocab UNIQUE(user_id, vocabulary_id)
);

-- 5-1. Create study_logs Table if not exists
CREATE TABLE IF NOT EXISTS public.study_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    couple_id VARCHAR(100),
    local_date VARCHAR(20) NOT NULL,
    xp_gained INT DEFAULT 20,
    concept_ids JSONB DEFAULT '[]'::jsonb,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5-2. Create user_streaks Table if not exists
CREATE TABLE IF NOT EXISTS public.user_streaks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    couple_id VARCHAR(100) UNIQUE,
    current_streak INT DEFAULT 0,
    last_study_date VARCHAR(20),
    freeze_count INT DEFAULT 1,
    last_freeze_used_at TIMESTAMPTZ,
    user1_completed_today BOOLEAN DEFAULT FALSE,
    user2_completed_today BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create View & Enable Security Invoker
CREATE OR REPLACE VIEW public.vw_couple_study_words WITH (security_invoker = true) AS
SELECT 
    v.id AS concept_id,
    v.concept_code,
    v.category,
    v.word_ko,
    v.word_en,
    v.word_tl,
    v.example_ko,
    v.example_en,
    v.example_tl,
    v.phonetic_en,
    v.phonetic_tl,
    'en' AS native_lang,
    'ko' AS target_lang,
    v.word_en AS word_native,
    v.word_ko AS word_target,
    v.example_en AS example_native,
    v.example_ko AS example_target,
    v.phonetic_en AS phonetic_native,
    v.phonetic_ko AS phonetic_target,
    v.created_at
FROM public.study_vocabularies v;

-- 7. Enable RLS and Grant Access Policies
ALTER TABLE public.user_studied_words ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorite_words ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_review_items ENABLE ROW LEVEL SECURITY;

-- Allow Public/Authenticated Select/Insert/Update Policies for MVP
DROP POLICY IF EXISTS "Allow all user_studied_words" ON public.user_studied_words;
CREATE POLICY "Allow all user_studied_words" ON public.user_studied_words FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all favorite_words" ON public.favorite_words;
CREATE POLICY "Allow all favorite_words" ON public.favorite_words FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all ai_quizzes" ON public.ai_quizzes;
CREATE POLICY "Allow all ai_quizzes" ON public.ai_quizzes FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all ai_review_items" ON public.ai_review_items;
CREATE POLICY "Allow all ai_review_items" ON public.ai_review_items FOR ALL USING (true) WITH CHECK (true);

GRANT ALL ON public.study_vocabularies TO anon, authenticated, service_role;
GRANT ALL ON public.user_studied_words TO anon, authenticated, service_role;
GRANT ALL ON public.favorite_words TO anon, authenticated, service_role;
GRANT ALL ON public.ai_quizzes TO anon, authenticated, service_role;
GRANT ALL ON public.ai_review_items TO anon, authenticated, service_role;
GRANT ALL ON public.vw_couple_study_words TO anon, authenticated, service_role;

-- 8. Reload PostgREST Schema Cache
NOTIFY pgrst, 'reload schema';
