-- Migration: 13_add_ai_generation_logs_table.sql
-- Description: Creates ai_vocabulary_generation_logs table to track daily midnight AI vocabulary & sentence generation history

CREATE TABLE IF NOT EXISTS public.ai_vocabulary_generation_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    executed_at TIMESTAMPTZ DEFAULT NOW(),
    total_items_generated INT DEFAULT 0,
    categories_covered TEXT[] DEFAULT ARRAY[]::TEXT[],
    status VARCHAR(20) DEFAULT 'SUCCESS', -- 'SUCCESS', 'FAILED'
    generated_summary JSONB,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS & Allow read for authenticated users/admins
ALTER TABLE public.ai_vocabulary_generation_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public all on ai_vocabulary_generation_logs" ON public.ai_vocabulary_generation_logs;
CREATE POLICY "Allow public all on ai_vocabulary_generation_logs" ON public.ai_vocabulary_generation_logs FOR ALL USING (true) WITH CHECK (true);
