/*
  # Add Three More Genre Newsletters

  ## Overview
  Adds 3 additional genre newsletters to the platform:
  - THUNDER (Metal)
  - HEARTH (Folk)
  - TRIBUTE (Cover/Tribute)

  ## Changes Made
  This brings the total to 21 newsletters:
  - 12 genre newsletters
  - 4 songwriting newsletters
  - 4 business newsletters (Engagement and Finances added previously)

  ## Important Notes
  - Uses ON CONFLICT to make migration idempotent
  - All newsletters are active by default
  - Scheduled across different days and times for optimal engagement
*/

INSERT INTO newsletters (slug, name, label, category, description, emoji, color, schedule_day, schedule_time, is_active)
VALUES
  -- New Genre Newsletters
  ('thunder', 'THUNDER', 'Metal', 'genre', 'Heavy metal evolution, underground scenes, thrash to doom, and extreme music intelligence', '🤘', 'bg-zinc-900', 'Friday', '8 PM', true),
  ('hearth', 'HEARTH', 'Folk', 'genre', 'Traditional folk music, acoustic storytelling, world folk traditions, and organic sounds', '🪕', 'bg-lime-700', 'Thursday', '7 PM', true),
  ('tribute', 'TRIBUTE', 'Cover/Tribute', 'genre', 'Cover artists, tribute bands, reimagined classics, and the art of musical interpretation', '🎭', 'bg-rose-700', 'Saturday', '4 PM', true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  label = EXCLUDED.label,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  emoji = EXCLUDED.emoji,
  color = EXCLUDED.color,
  schedule_day = EXCLUDED.schedule_day,
  schedule_time = EXCLUDED.schedule_time,
  is_active = EXCLUDED.is_active,
  updated_at = now();
