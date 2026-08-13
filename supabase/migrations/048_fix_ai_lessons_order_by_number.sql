-- Align display_order with the numbered lesson titles when available.
UPDATE public.ai_lessons
SET display_order = (regexp_match(
  COALESCE(title_en, title, ''),
  '(?i)lesson\s*:?\s*([0-9]+)'
))[1]::integer
WHERE COALESCE(title_en, title, '') ~* 'lesson\s*:?\s*[0-9]+';
