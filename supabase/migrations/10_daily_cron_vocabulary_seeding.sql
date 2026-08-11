-- Migration: 10_daily_cron_vocabulary_seeding.sql
-- Description: Enables pg_cron & pg_net extensions to automatically trigger generate-study-words Edge Function daily at midnight (UTC 00:00) using Language-Granular Architecture

-- 1. Enable required extensions for scheduled jobs & HTTP calls
CREATE EXTENSION IF NOT EXISTS "pg_cron";
CREATE EXTENSION IF NOT EXISTS "pg_net";

-- 2. Create Stored Procedure to invoke Edge Function for 5 daily vocabulary sets with Language-Granular Architecture
CREATE OR REPLACE FUNCTION public.trigger_daily_ai_vocabulary_seeding()
RETURNS VOID AS $$
DECLARE
    project_url TEXT := current_setting('custom.supabase_url', true);
    service_role_key TEXT := current_setting('custom.supabase_service_key', true);
    categories TEXT[] := ARRAY['daily', 'travel', 'hospital', 'restaurant', 'shopping'];
    cat TEXT;
BEGIN
    -- Fallback default project URL if custom setting is not set
    IF project_url IS NULL OR project_url = '' THEN
        project_url := 'https://qvimkbaflctfzibxgoig.supabase.co';
    END IF;

    -- Trigger Edge Function for each category using Language-Granular Architecture
    FOREACH cat IN ARRAY categories LOOP
        PERFORM net.http_post(
            url := project_url || '/functions/v1/generate-study-words',
            headers := jsonb_build_object(
                'Content-Type', 'application/json',
                'Authorization', 'Bearer ' || service_role_key
            ),
            body := jsonb_build_object(
                'action', 'generate',
                'category', cat
            )
        );
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Schedule Cron Job to run daily at 00:00 UTC (9:00 AM KST)
SELECT cron.schedule(
    'daily-ai-vocabulary-seeding-job',
    '0 0 * * *',
    'SELECT public.trigger_daily_ai_vocabulary_seeding();'
);
