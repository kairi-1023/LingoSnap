-- Migration: Update users native_lang and target_lang CHECK constraints to support all 12 languages

-- 1. Drop old restrictive check constraints if they exist
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_native_lang_check;
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_target_lang_check;

-- 2. Add expanded check constraints for 12 supported languages
-- (ko, en, tl, ja, zh, vi, es, fr, de, th, id, ru)
ALTER TABLE public.users
  ADD CONSTRAINT users_native_lang_check 
  CHECK (native_lang IN ('ko', 'en', 'tl', 'ja', 'zh', 'vi', 'es', 'fr', 'de', 'th', 'id', 'ru'));

ALTER TABLE public.users
  ADD CONSTRAINT users_target_lang_check 
  CHECK (target_lang IN ('ko', 'en', 'tl', 'ja', 'zh', 'vi', 'es', 'fr', 'de', 'th', 'id', 'ru'));
