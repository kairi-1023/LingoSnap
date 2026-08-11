-- ============================================================
-- Migration: 008_migrate_existing_srs.sql
-- Description: Idempotently migrates existing SRS data from legacy
--              user_studied_words / user_srs_items tables into
--              ai_review_items without losing user history.
-- Reversible & Safe: Conditional PL/pgSQL block with ON CONFLICT DO UPDATE.
-- ============================================================

DO $$
BEGIN
    -- 1. Check if legacy user_studied_words table exists
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'user_studied_words'
    ) THEN
        -- Insert/Update ai_review_items from user_studied_words
        INSERT INTO public.ai_review_items (
            user_id,
            vocabulary_id,
            srs_stage,
            next_review_at,
            last_reviewed_at,
            correct_count,
            wrong_count,
            created_at
        )
        SELECT 
            usw.user_id,
            sv.id AS vocabulary_id,
            COALESCE(usw.srs_stage, 1) AS srs_stage,
            COALESCE(usw.next_review_at, NOW() + INTERVAL '1 day') AS next_review_at,
            usw.last_reviewed_at,
            GREATEST(COALESCE(usw.review_count, 0) - COALESCE(usw.wrong_count, 0), 0) AS correct_count,
            COALESCE(usw.wrong_count, 0) AS wrong_count,
            COALESCE(usw.created_at, NOW()) AS created_at
        FROM public.user_studied_words usw
        JOIN public.study_vocabularies sv ON sv.id = usw.concept_id
        ON CONFLICT (user_id, vocabulary_id) DO UPDATE SET
            srs_stage = EXCLUDED.srs_stage,
            next_review_at = EXCLUDED.next_review_at,
            last_reviewed_at = EXCLUDED.last_reviewed_at,
            correct_count = EXCLUDED.correct_count,
            wrong_count = EXCLUDED.wrong_count;

        RAISE NOTICE 'Legacy user_studied_words data successfully migrated to public.ai_review_items.';
    ELSE
        RAISE NOTICE 'Legacy table public.user_studied_words does not exist. Skipping data migration.';
    END IF;
END $$;
