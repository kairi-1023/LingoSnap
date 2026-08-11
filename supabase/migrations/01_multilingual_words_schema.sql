-- Migration: N:M Multilingual Word Caching Schema
-- Description: Supports N:M language combinations with AI-generated on-demand caching.

-- 1. Word Concepts (Global unique semantic word concepts)
CREATE TABLE IF NOT EXISTS public.word_concepts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    concept_code VARCHAR(100) NOT NULL UNIQUE, -- e.g. 'feeling_love', 'greeting_hello'
    category VARCHAR(50) NOT NULL DEFAULT 'words', -- 'words', 'expression', 'sentence'
    difficulty_level VARCHAR(10) DEFAULT 'A1', -- 'A1', 'A2', 'B1', 'B2', 'C1'
    part_of_speech VARCHAR(20) DEFAULT 'noun',
    is_ai_generated BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Word Translations (Translations, Phonetics, and Audio per ISO language code)
CREATE TABLE IF NOT EXISTS public.word_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    concept_id UUID NOT NULL REFERENCES public.word_concepts(id) ON DELETE CASCADE,
    language_code VARCHAR(10) NOT NULL, -- e.g. 'ko', 'en', 'tl', 'es', 'ja'
    text TEXT NOT NULL,
    phonetic TEXT,
    audio_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_concept_language UNIQUE (concept_id, language_code)
);

-- 3. Word Examples (Example sentences per concept)
CREATE TABLE IF NOT EXISTS public.word_examples (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    concept_id UUID NOT NULL REFERENCES public.word_concepts(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Word Example Translations (Multilingual translations for example sentences)
CREATE TABLE IF NOT EXISTS public.word_example_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    example_id UUID NOT NULL REFERENCES public.word_examples(id) ON DELETE CASCADE,
    language_code VARCHAR(10) NOT NULL,
    text TEXT NOT NULL,
    audio_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_example_language UNIQUE (example_id, language_code)
);

-- 5. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_word_translations_lang ON public.word_translations(language_code, concept_id);
CREATE INDEX IF NOT EXISTS idx_word_concepts_cat ON public.word_concepts(category);
CREATE INDEX IF NOT EXISTS idx_word_example_translations_lang ON public.word_example_translations(language_code, example_id);

-- 6. Enable RLS (Row Level Security) - Read accessible to all authenticated users
ALTER TABLE public.word_concepts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.word_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.word_examples ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.word_example_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on word_concepts" ON public.word_concepts FOR SELECT USING (true);
CREATE POLICY "Allow public read on word_translations" ON public.word_translations FOR SELECT USING (true);
CREATE POLICY "Allow public read on word_examples" ON public.word_examples FOR SELECT USING (true);
CREATE POLICY "Allow public read on word_example_translations" ON public.word_example_translations FOR SELECT USING (true);

-- 7. View for Couple Study Pair (Queries paired translations given native & target language)
CREATE OR REPLACE VIEW public.vw_couple_study_words AS
SELECT 
    c.id AS concept_id,
    c.concept_code,
    c.category,
    c.difficulty_level,
    tn.language_code AS native_lang,
    tn.text AS word_native,
    tn.phonetic AS phonetic_native,
    tt.language_code AS target_lang,
    tt.text AS word_target,
    tt.phonetic AS phonetic_target,
    ex_native.text AS example_native,
    ex_target.text AS example_target,
    c.created_at
FROM public.word_concepts c
JOIN public.word_translations tn ON c.id = tn.concept_id
JOIN public.word_translations tt ON c.id = tt.concept_id AND tn.language_code <> tt.language_code
LEFT JOIN public.word_examples ex ON c.id = ex.concept_id
LEFT JOIN public.word_example_translations ex_native ON ex.id = ex_native.example_id AND ex_native.language_code = tn.language_code
LEFT JOIN public.word_example_translations ex_target ON ex.id = ex_target.example_id AND ex_target.language_code = tt.language_code;
