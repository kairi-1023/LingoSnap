-- ============================================================
-- Migration: 001_add_vocabulary_image_fields.sql
-- Description: Extends public.study_vocabularies table to support
--              contextual visual learning by adding image URL,
--              image source origin, and AI generation prompt fields.
-- Reversible & Safe: Uses ALTER TABLE ... ADD COLUMN IF NOT EXISTS.
-- ============================================================

ALTER TABLE public.study_vocabularies
    ADD COLUMN IF NOT EXISTS image_url TEXT NULL,
    ADD COLUMN IF NOT EXISTS image_source TEXT NULL CONSTRAINT check_vocab_image_source CHECK (image_source IN ('manual', 'generated', 'external')),
    ADD COLUMN IF NOT EXISTS image_prompt TEXT NULL,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NULL DEFAULT NOW();

-- Column Comments
COMMENT ON COLUMN public.study_vocabularies.image_url IS 'CDN or external URL of the situation/contextual anchor image';
COMMENT ON COLUMN public.study_vocabularies.image_source IS 'Source type of the image: manual, generated, or external';
COMMENT ON COLUMN public.study_vocabularies.image_prompt IS 'AI generation prompt string if image was artificially generated';
COMMENT ON COLUMN public.study_vocabularies.created_at IS 'Timestamp when the vocabulary record was created';
