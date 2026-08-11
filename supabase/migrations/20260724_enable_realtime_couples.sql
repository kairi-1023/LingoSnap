-- ============================================================
-- Migration: Enable Realtime for couples table
-- The invite-code sender detects partner connection via a
-- postgres_changes UPDATE subscription on couples. Without the
-- table in the supabase_realtime publication, no events are
-- broadcast and the sender falls back to 30s polling.
-- ============================================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables
        WHERE pubname = 'supabase_realtime' AND tablename = 'couples'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.couples;
    END IF;
END $$;
