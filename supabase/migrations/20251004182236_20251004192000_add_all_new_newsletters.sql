/*
  # Add All New Newsletters to Database

  ## Overview
  Adds all the new newsletters to the database:
  - Updates CROSSROADS to be Country only (not Country/Americana)
  - Adds ROOTS (Americana)
  - Adds THUNDER (Metal)
  - Adds HEARTH (Folk)
  - Adds TRIBUTE (Cover/Tribute)
  - Adds LYRICIST (Lyric Writing)
  - Adds NARRATIVE (Storytelling)
  - Adds CONNECT (Engagement)
  - Adds LEDGER (Finances)

  ## Result
  Total of 21 newsletters:
  - 12 genre newsletters
  - 4 songwriting newsletters
  - 4 business newsletters

  ## Important Notes
  - Uses ON CONFLICT to make migration idempotent
  - All newsletters are active by default
*/

-- Update existing CROSSROADS newsletter to be Country only
UPDATE newsletters
SET
  label = 'Country',
  description = 'Modern country trends, Nashville intelligence, and traditional country roots',
  updated_at = now()
WHERE slug = 'crossroads';

-- Insert all new newsletters
INSERT INTO newsletters (slug, name, label, category, description, emoji, color, schedule_day, schedule_time, is_active)
VALUES
  -- New Genre Newsletters
  ('roots', 'ROOTS', 'Americana', 'genre', 'Americana roots, folk traditions, bluegrass revival, and authentic storytelling', '🎻', 'bg-orange-800', 'Sunday', '2 PM', true),
  ('thunder', 'THUNDER', 'Metal', 'genre', 'Heavy metal evolution, underground scenes, thrash to doom, and extreme music intelligence', '🤘', 'bg-zinc-900', 'Friday', '8 PM', true),
  ('hearth', 'HEARTH', 'Folk', 'genre', 'Traditional folk music, acoustic storytelling, world folk traditions, and organic sounds', '🪕', 'bg-lime-700', 'Thursday', '7 PM', true),
  ('tribute', 'TRIBUTE', 'Cover/Tribute', 'genre', 'Cover artists, tribute bands, reimagined classics, and the art of musical interpretation', '🎭', 'bg-rose-700', 'Saturday', '4 PM', true),

  -- New Songwriting Newsletters
  ('lyricist', 'LYRICIST', 'Lyric Writing', 'songwriting', 'Lyrical techniques, metaphor mastery, wordplay, and poetic songwriting', '📝', 'bg-purple-700', 'Tuesday', '9 AM', true),
  ('narrative', 'NARRATIVE', 'Storytelling', 'songwriting', 'Song storytelling techniques, narrative structures, and character development in music', '📖', 'bg-indigo-700', 'Saturday', '9 AM', true),

  -- New Business Newsletters
  ('connect', 'CONNECT', 'Engagement', 'business', 'Fan engagement strategies, social media growth, community building, and audience connection', '🤝', 'bg-cyan-700', 'Wednesday', '3 PM', true),
  ('ledger', 'LEDGER', 'Finances', 'business', 'Music industry finances, royalty accounting, tax strategies, and financial planning for artists', '📊', 'bg-emerald-800', 'Friday', '9 AM', true)
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
