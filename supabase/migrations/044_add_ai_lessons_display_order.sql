-- Add stable curriculum ordering for lesson cards.
ALTER TABLE public.ai_lessons
  ADD COLUMN IF NOT EXISTS display_order integer NOT NULL DEFAULT 0;

-- Preserve the current lesson creation order for existing lessons.
WITH ordered_lessons AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC, id ASC) AS next_order
  FROM public.ai_lessons
  WHERE display_order = 0
)
UPDATE public.ai_lessons AS lessons
SET display_order = ordered_lessons.next_order
FROM ordered_lessons
WHERE lessons.id = ordered_lessons.id;

CREATE INDEX IF NOT EXISTS idx_ai_lessons_display_order
  ON public.ai_lessons (display_order);
