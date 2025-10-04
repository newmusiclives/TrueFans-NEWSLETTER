/*
  # Seed Newsletter Data
  
  ## Overview
  Populates the newsletters table with the 12 specialty newsletters covering
  music genres, songwriting, and business intelligence.
  
  ## Data Seeded
  - 8 genre newsletters (Hip-Hop, Singer-Songwriter, Electronic, Pop, Rock, R&B, Indie, Country)
  - 2 songwriting newsletters (Craft, Commercial)
  - 2 business newsletters (Strategy, Artist Business)
  
  ## Important Notes
  - Uses ON CONFLICT to make migration idempotent
  - All newsletters are active by default
  - Scheduled across different days and times for optimal engagement
*/

INSERT INTO newsletters (slug, name, label, category, description, emoji, color, schedule_day, schedule_time, is_active)
VALUES
  -- Genre Newsletters
  ('pulse', 'PULSE', 'Hip-Hop/Rap', 'genre', 'Underground hip-hop trends, emerging rappers, and street culture intelligence', '🎤', 'bg-red-600', 'Monday', '6 AM', true),
  ('storyteller', 'STORYTELLER', 'Singer-Songwriter', 'genre', 'Intimate singer-songwriter discoveries, confessional folk movement, and authentic storytelling', '🎸', 'bg-green-600', 'Tuesday', '6 PM', true),
  ('voltage', 'VOLTAGE', 'Electronic/EDM', 'genre', 'Electronic music evolution, festival intelligence, and producer spotlights', '⚡', 'bg-blue-600', 'Tuesday', '6 AM', true),
  ('resonance', 'RESONANCE', 'Pop/Mainstream', 'genre', 'Pop culture analysis, mainstream trends, and commercial music intelligence', '✨', 'bg-pink-600', 'Thursday', '6 AM', true),
  ('amplify', 'AMPLIFY', 'Rock/Alternative', 'genre', 'Rock revival movements, garage bands, and alternative scene intelligence', '🎸', 'bg-slate-700', 'Wednesday', '6 PM', true),
  ('rhythm', 'RHYTHM', 'R&B/Soul', 'genre', 'Modern R&B evolution, soul revivals, and smooth vocal trends', '🎵', 'bg-amber-700', 'Friday', '6 AM', true),
  ('underground', 'UNDERGROUND', 'Indie/Experimental', 'genre', 'Experimental sounds, bedroom producers, and avant-garde movements', '🌙', 'bg-teal-600', 'Saturday', '10 AM', true),
  ('crossroads', 'CROSSROADS', 'Country/Americana', 'genre', 'Modern country trends, Americana roots, and Nashville intelligence', '🤠', 'bg-yellow-700', 'Sunday', '8 AM', true),
  
  -- Songwriting Newsletters
  ('pencraft', 'PENCRAFT', 'Songwriting Craft', 'songwriting', 'Songwriting techniques, lyrical analysis, and creative process deep-dives', '✍️', 'bg-emerald-700', 'Wednesday', '6 AM', true),
  ('hitmaker', 'HITMAKER', 'Commercial Songwriting', 'songwriting', 'Hit songwriting formulas, sync licensing opportunities, and commercial trends', '🎯', 'bg-orange-600', 'Friday', '6 PM', true),
  
  -- Business Newsletters
  ('executive', 'EXECUTIVE', 'Music Business Strategy', 'business', 'Industry deals, label insights, investment trends, and executive intelligence', '💼', 'bg-gray-800', 'Thursday', '6 PM', true),
  ('revenue', 'REVENUE', 'Artist Business', 'business', 'Monetization strategies, streaming economics, touring business, and artist income', '💰', 'bg-green-800', 'Monday', '6 PM', true)
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
