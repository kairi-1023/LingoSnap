-- Migration: Update users native_lang and target_lang CHECK constraints for 6 supported languages
-- Step 1: Normalize any existing data outside the 6 core languages
UPDATE public.users SET target_lang = 'en' WHERE target_lang NOT IN ('tl', 'ko', 'en', 'th', 'vi', 'ja');
UPDATE public.users SET native_lang = 'ko' WHERE native_lang NOT IN ('tl', 'ko', 'en', 'th', 'vi', 'ja');

-- Step 2: Drop existing check constraints
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_native_lang_check, DROP CONSTRAINT IF EXISTS users_target_lang_check;

-- Step 3: Add new check constraints for 6 supported languages
ALTER TABLE public.users 
  ADD CONSTRAINT users_native_lang_check CHECK (native_lang IN ('tl', 'ko', 'en', 'th', 'vi', 'ja')),
  ADD CONSTRAINT users_target_lang_check CHECK (target_lang IN ('tl', 'ko', 'en', 'th', 'vi', 'ja'));
