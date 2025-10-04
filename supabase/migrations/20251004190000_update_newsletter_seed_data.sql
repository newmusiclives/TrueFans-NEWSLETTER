/*
  # Update Newsletter Seed Data

  ## Overview
  Updates the newsletters table with the expanded 18 specialty newsletters:
  - 9 genre newsletters (added Americana and Country as separate)
  - 4 songwriting newsletters (added Lyric and Storytelling)
  - 4 business newsletters (added Engagement and Finances)

  ## Changes Made
  - Split Country/Americana into two separate newsletters
  - Added ROOTS (Americana) newsletter
  - Added LYRICIST (Lyric Writing) newsletter
  - Added NARRATIVE (Storytelling) newsletter
  - Added CONNECT (Engagement) newsletter
  - Added LEDGER (Finances) newsletter

  ## Important Notes
  - Uses ON CONFLICT to make migration idempotent
  - All newsletters remain active by default
  - Scheduled across different days and times for optimal engagement
*/

-- Update existing CROSSROADS newsletter to be Country only
UPDATE newsletters
SET
  label = 'Country',
  description = 'Modern country trends, Nashville intelligence, and traditional country roots',
  updated_at = now()
WHERE slug = 'crossroads';

-- Insert new newsletters
INSERT INTO newsletters (slug, name, label, category, description, emoji, color, schedule_day, schedule_time, is_active)
VALUES
  -- New Genre Newsletter: Americana
  ('roots', 'ROOTS', 'Americana', 'genre', 'Americana roots, folk traditions, bluegrass revival, and authentic storytelling', '🎻', 'bg-orange-800', 'Sunday', '2 PM', true),

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
