-- Migration: 14_drop_cultural_quizzes_table.sql
-- Description: Drops cultural_quizzes table and all associated RLS policies

DROP TABLE IF EXISTS public.cultural_quizzes CASCADE;
