-- ============================================================
-- Migration: Remove bilingual JSONB → plain TEXT (Turkish only)
-- Run this ONCE on your existing Supabase database.
-- ============================================================

-- ── Drop ui_texts table ──────────────────────────────────────
DROP POLICY IF EXISTS "public read ui_texts" ON ui_texts;
DROP POLICY IF EXISTS "auth write ui_texts"  ON ui_texts;
DROP TABLE IF EXISTS ui_texts;

-- ── site_config ──────────────────────────────────────────────
ALTER TABLE site_config ALTER COLUMN tagline     TYPE TEXT USING (tagline->>'tr');
ALTER TABLE site_config ALTER COLUMN description TYPE TEXT USING (description->>'tr');

-- ── nav_items ────────────────────────────────────────────────
ALTER TABLE nav_items ALTER COLUMN label       TYPE TEXT USING (label->>'tr');
ALTER TABLE nav_items ALTER COLUMN label_short TYPE TEXT USING (label_short->>'tr');

-- ── hero_slides ──────────────────────────────────────────────
ALTER TABLE hero_slides ALTER COLUMN alt TYPE TEXT USING (alt->>'tr');

-- ── hero_stats ───────────────────────────────────────────────
ALTER TABLE hero_stats ALTER COLUMN label TYPE TEXT USING (label->>'tr');

-- ── services ─────────────────────────────────────────────────
ALTER TABLE services ALTER COLUMN title   TYPE TEXT USING (title->>'tr');
ALTER TABLE services ALTER COLUMN summary TYPE TEXT USING (summary->>'tr');
ALTER TABLE services ALTER COLUMN intro   TYPE TEXT USING (intro->>'tr');

-- offerings: JSONB array of {tr,en} → TEXT[]
ALTER TABLE services ALTER COLUMN offerings TYPE TEXT[]
  USING (
    SELECT array_agg(elem->>'tr')
    FROM jsonb_array_elements(offerings) AS elem
  );

-- process_steps: JSONB array {title_tr,text_tr,...} → JSONB array {title,text}
ALTER TABLE services ALTER COLUMN process_steps TYPE JSONB
  USING (
    SELECT jsonb_agg(jsonb_build_object('title', elem->>'title_tr', 'text', elem->>'text_tr'))
    FROM jsonb_array_elements(process_steps) AS elem
  );

-- ── section_highlights ───────────────────────────────────────
ALTER TABLE section_highlights ALTER COLUMN text TYPE TEXT USING (text->>'tr');

-- ── about_page ───────────────────────────────────────────────
ALTER TABLE about_page ALTER COLUMN hero_eyebrow          TYPE TEXT USING (hero_eyebrow->>'tr');
ALTER TABLE about_page ALTER COLUMN hero_title            TYPE TEXT USING (hero_title->>'tr');
ALTER TABLE about_page ALTER COLUMN hero_subtitle_override TYPE TEXT USING (hero_subtitle_override->>'tr');
ALTER TABLE about_page ALTER COLUMN meta_description      TYPE TEXT USING (meta_description->>'tr');
ALTER TABLE about_page ALTER COLUMN main_paragraph        TYPE TEXT USING (main_paragraph->>'tr');
ALTER TABLE about_page ALTER COLUMN side_card_title       TYPE TEXT USING (side_card_title->>'tr');
ALTER TABLE about_page ALTER COLUMN side_card_text        TYPE TEXT USING (side_card_text->>'tr');
ALTER TABLE about_page ALTER COLUMN cta_strip_title       TYPE TEXT USING (cta_strip_title->>'tr');

-- bullets: JSONB array of {tr,en} → TEXT[]
ALTER TABLE about_page ALTER COLUMN bullets TYPE TEXT[]
  USING (
    SELECT array_agg(elem->>'tr')
    FROM jsonb_array_elements(bullets) AS elem
  );

-- focus_areas: JSONB array of {tr,en} → TEXT[]
ALTER TABLE about_page ALTER COLUMN focus_areas TYPE TEXT[]
  USING (
    SELECT array_agg(elem->>'tr')
    FROM jsonb_array_elements(focus_areas) AS elem
  );

-- Done.
