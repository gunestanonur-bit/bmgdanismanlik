-- ============================================================
-- BMG Danismanlik - Supabase schema + SEO seed (from scratch)
-- Run this script in Supabase SQL Editor after clearing database.
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- CLEANUP
-- ============================================================
DROP TABLE IF EXISTS site_visuals CASCADE;
DROP TABLE IF EXISTS about_page CASCADE;
DROP TABLE IF EXISTS section_highlights CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS hero_stats CASCADE;
DROP TABLE IF EXISTS hero_slides CASCADE;
DROP TABLE IF EXISTS nav_items CASCADE;
DROP TABLE IF EXISTS site_config CASCADE;

DROP FUNCTION IF EXISTS touch_updated_at() CASCADE;

-- ============================================================
-- TABLES
-- ============================================================

CREATE TABLE site_config (
  id          SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  name        TEXT NOT NULL,
  site_url    TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT NOT NULL,
  address     TEXT NOT NULL,
  tagline     TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE nav_items (
  id          TEXT PRIMARY KEY,
  label       TEXT NOT NULL DEFAULT '',
  label_short TEXT,
  sort_order  SMALLINT NOT NULL DEFAULT 0
);

CREATE TABLE hero_slides (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  src         TEXT NOT NULL,
  alt         TEXT NOT NULL DEFAULT '',
  sort_order  SMALLINT NOT NULL DEFAULT 0
);

CREATE TABLE hero_stats (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label       TEXT NOT NULL DEFAULT '',
  value       TEXT NOT NULL DEFAULT '',
  sort_order  SMALLINT NOT NULL DEFAULT 0
);

CREATE TABLE services (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kind          TEXT NOT NULL CHECK (kind IN ('consulting','training','sectoral')),
  slug          TEXT NOT NULL,
  code          TEXT NOT NULL,
  sort_order    SMALLINT NOT NULL DEFAULT 0,
  title         TEXT NOT NULL DEFAULT '',
  summary       TEXT NOT NULL DEFAULT '',
  intro         TEXT NOT NULL DEFAULT '',
  intro_image_url TEXT NOT NULL DEFAULT '',
  offerings     TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  offerings_image_url TEXT NOT NULL DEFAULT '',
  custom_section_title TEXT NOT NULL DEFAULT '',
  custom_section_items TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  custom_section_image_url TEXT NOT NULL DEFAULT '',
  process_image_url TEXT NOT NULL DEFAULT '',
  process_steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  hero_image_url TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (kind, slug)
);

ALTER TABLE services
  ADD COLUMN IF NOT EXISTS custom_section_title TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS custom_section_items TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN IF NOT EXISTS intro_image_url TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS offerings_image_url TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS custom_section_image_url TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS process_image_url TEXT NOT NULL DEFAULT '';

CREATE TABLE section_highlights (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kind        TEXT NOT NULL CHECK (kind IN ('consulting','training','sectoral')),
  text        TEXT NOT NULL DEFAULT '',
  sort_order  SMALLINT NOT NULL DEFAULT 0
);

CREATE TABLE about_page (
  id                     SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  hero_image_url         TEXT NOT NULL DEFAULT '',
  hero_eyebrow           TEXT NOT NULL DEFAULT '',
  hero_title             TEXT NOT NULL DEFAULT '',
  hero_subtitle_override TEXT NOT NULL DEFAULT '',
  meta_description       TEXT NOT NULL DEFAULT '',
  main_paragraph         TEXT NOT NULL DEFAULT '',
  bullets                TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  side_card_title        TEXT NOT NULL DEFAULT '',
  side_card_text         TEXT NOT NULL DEFAULT '',
  focus_areas            TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  cta_strip_title        TEXT NOT NULL DEFAULT '',
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE site_visuals (
  id                       SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  consulting_hub_hero      TEXT NOT NULL DEFAULT '',
  consulting_hub_secondary TEXT NOT NULL DEFAULT '',
  consulting_service_images JSONB NOT NULL DEFAULT '{}'::jsonb,
  training_hub_hero        TEXT NOT NULL DEFAULT '',
  training_hub_secondary   TEXT NOT NULL DEFAULT '',
  sectoral_hub_hero        TEXT NOT NULL DEFAULT '',
  sectoral_hub_secondary   TEXT NOT NULL DEFAULT '',
  sectoral_service_images  JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- UPDATED_AT TRIGGERS
-- ============================================================
CREATE OR REPLACE FUNCTION touch_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_site_config_updated
BEFORE UPDATE ON site_config
FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

CREATE TRIGGER trg_services_updated
BEFORE UPDATE ON services
FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

CREATE TRIGGER trg_about_page_updated
BEFORE UPDATE ON about_page
FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

CREATE TRIGGER trg_site_visuals_updated
BEFORE UPDATE ON site_visuals
FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- ============================================================
-- RLS
-- ============================================================
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE nav_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE section_highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_page ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_visuals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read site_config" ON site_config FOR SELECT TO anon USING (true);
CREATE POLICY "public read nav_items" ON nav_items FOR SELECT TO anon USING (true);
CREATE POLICY "public read hero_slides" ON hero_slides FOR SELECT TO anon USING (true);
CREATE POLICY "public read hero_stats" ON hero_stats FOR SELECT TO anon USING (true);
CREATE POLICY "public read services" ON services FOR SELECT TO anon USING (true);
CREATE POLICY "public read section_highlights" ON section_highlights FOR SELECT TO anon USING (true);
CREATE POLICY "public read about_page" ON about_page FOR SELECT TO anon USING (true);
CREATE POLICY "public read site_visuals" ON site_visuals FOR SELECT TO anon USING (true);

CREATE POLICY "auth write site_config" ON site_config FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth write nav_items" ON nav_items FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth write hero_slides" ON hero_slides FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth write hero_stats" ON hero_stats FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth write services" ON services FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth write section_highlights" ON section_highlights FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth write about_page" ON about_page FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth write site_visuals" ON site_visuals FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================================
-- SEO-ORIENTED SEED
-- ============================================================

INSERT INTO site_config (id, name, site_url, email, phone, address, tagline, description)
VALUES (
  1,
  'BMG Danismanlik',
  'https://example.com',
  'info@example.com',
  '+90 (___) ___ __ __',
  'Turkiye',
  'AS 9100 ve ISO 9001 odakli kalite yonetim sistemi danismanligi',
  'BMG Danismanlik; kalite yonetim sistemleri, AS 9100 ve ISO 9001 belgelendirme, surec iyilestirme ve teknik egitim hizmetleriyle savunma ve havacilik sanayiinde operasyonel mukemmellik hedeflerinize ulasmanizi destekler.'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  site_url = EXCLUDED.site_url,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  address = EXCLUDED.address,
  tagline = EXCLUDED.tagline,
  description = EXCLUDED.description;

INSERT INTO nav_items (id, label, label_short, sort_order) VALUES
  ('hakkimizda', 'Hakkimizda', 'Hakkimizda', 10),
  ('danismanlik', 'Danismanlik Hizmetlerimiz', 'Danismanlik', 20),
  ('egitim', 'Egitim Hizmetlerimiz', 'Egitim', 30),
  ('sektorel', 'Sektorel Hizmetler', 'Sektorel', 40),
  ('iletisim', 'Bize Ulasin', 'Iletisim', 50)
ON CONFLICT (id) DO UPDATE SET
  label = EXCLUDED.label,
  label_short = EXCLUDED.label_short,
  sort_order = EXCLUDED.sort_order;

INSERT INTO hero_slides (src, alt, sort_order) VALUES
  ('https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1920&q=85', 'AS 9100 Havacilik Uzay ve Savunma Sanayi KYS Danismanlik Hizmeti', 10),
  ('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=85', 'ISO 9001 Kalite Yonetim Sistemi Danismanlik Hizmeti', 20),
  ('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1920&q=85', 'Belgelendirme Hazirligi ve Denetim Koordinasyonu', 30),
  ('https://images.unsplash.com/photo-1581092160562-40aa08f7880a?auto=format&fit=crop&w=1920&q=85', 'Surec Iyilestirme ve Operasyonel Mukemmellik', 40),
  ('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1920&q=85', 'Teknik Egitim ve Kurumsal Yetkinlik Gelisimi', 50);

INSERT INTO hero_stats (label, value, sort_order) VALUES
  ('Standart kapsami', 'AS 9100 & ISO 9001', 10),
  ('Sektor odagi', 'Savunma ve Havacilik', 20),
  ('Yaklasim', 'Surec odakli', 30);

INSERT INTO section_highlights (kind, text, sort_order) VALUES
  ('consulting', 'AS 9100 ve ISO 9001 belgelendirme sureclerinde uctan uca danismanlik', 10),
  ('consulting', 'Surec haritalama, risk-firsat yonetimi ve performans gostergesi tasarimi', 20),
  ('consulting', 'Ic tetkik, yonetim gozden gecirmesi ve denetim hazirlik koordinasyonu', 30),
  ('training', 'Yonetim sistemi farkindalik, ic tetkik ve uygulamali teknik egitim programlari', 10),
  ('training', 'AS 9100 ve ISO 9001 gereksinimlerine ozel kurumsal yetkinlik gelistirme', 20),
  ('training', 'Risk temelli dusunme ve surekli iyilestirme kulturunu guclendiren atolye calismalari', 30),
  ('sectoral', 'Savunma ve havacilik sanayii gereksinimlerine uygun kalite altyapisi kurulumu', 10),
  ('sectoral', 'Tedarik zinciri uyumu, izlenebilirlik ve dokumantasyon disiplini odakli rehberlik', 20),
  ('sectoral', 'AS 9100, EYDEP ve sektorel denetimlere hazirlik icin ozel yol haritasi', 30);

INSERT INTO about_page (
  id, hero_image_url, hero_eyebrow, hero_title, hero_subtitle_override,
  meta_description, main_paragraph, bullets, side_card_title, side_card_text,
  focus_areas, cta_strip_title
) VALUES (
  1,
  'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=2400&q=85',
  'Kurumsal Uzmanlik',
  'BMG Danismanlik Hakkimizda',
  'Kalite yonetim sistemleri, AS 9100 ve ISO 9001 danismanliginda uzman ekibimizle savunma ve havacilik sanayiine yonelik surdurulebilir gelisim sagliyoruz.',
  'BMG Danismanlik; kalite yonetim sistemleri, ISO 9001 ve AS 9100 alanlarinda belgelendirme destegi, surec iyilestirme ve teknik egitim hizmetleri sunar.',
  '{name}, kalite yonetim sistemleri alaninda uzmanlasmis bir danismanlik firmasi olarak kuruluslarin stratejik hedeflerine ulasmasi icin olculebilir, surdurulebilir ve denetlenebilir yonetim modelleri tasarlar. ISO 9001 ve AS 9100 basta olmak uzere uluslararasi standartlara uyum, belgelendirme hazirligi, surec performansi ve operasyonel mukemmellik konularinda uctan uca destek sunar. Savunma ve havacilik sanayiindeki saha deneyimiyle risk temelli dusunme, tedarik zinciri uyumu, izlenebilirlik ve denetim basarisini birlikte yonetir.',
  ARRAY[
    'ISO 9001 ve AS 9100 belgelendirme sureclerinde uctan uca danismanlik',
    'Kalite yonetim sistemi kurulumu, dokumantasyon ve uygulama esligi',
    'Surec iyilestirme, risk yonetimi ve performans gostergesi tasarimi',
    'Ic tetkik, yonetim gozden gecirmesi ve denetim hazirlik destegi'
  ],
  'Savunma ve Havacilikta Guvenilir Cozum Ortagi',
  'Profesyonel kadromuz; mevcut durum analizinden belgelendirme sonrasi surekli iyilestirme adimlarina kadar kurumunuza deger katan sonuclarla yaninizda olur.',
  ARRAY[
    'AS 9100 ve ISO 9001 uzmanligi',
    'Belgelendirme ve denetim hazirligi',
    'Surec gelistirme ve teknik egitim'
  ],
  'Danismanlik, egitim ve sektorel hizmetlerimizi kesfedin'
)
ON CONFLICT (id) DO UPDATE SET
  hero_image_url = EXCLUDED.hero_image_url,
  hero_eyebrow = EXCLUDED.hero_eyebrow,
  hero_title = EXCLUDED.hero_title,
  hero_subtitle_override = EXCLUDED.hero_subtitle_override,
  meta_description = EXCLUDED.meta_description,
  main_paragraph = EXCLUDED.main_paragraph,
  bullets = EXCLUDED.bullets,
  side_card_title = EXCLUDED.side_card_title,
  side_card_text = EXCLUDED.side_card_text,
  focus_areas = EXCLUDED.focus_areas,
  cta_strip_title = EXCLUDED.cta_strip_title;

INSERT INTO site_visuals (
  id,
  consulting_hub_hero, consulting_hub_secondary, consulting_service_images,
  training_hub_hero, training_hub_secondary,
  sectoral_hub_hero, sectoral_hub_secondary, sectoral_service_images
) VALUES (
  1,
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=2400&q=85',
  'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1600&q=85',
  '{}'::jsonb,
  'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=2400&q=85',
  'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1600&q=85',
  'https://images.unsplash.com/photo-1436891620584-47fd0e565afb?auto=format&fit=crop&w=2400&q=85',
  'https://images.unsplash.com/photo-1569025591791-94d5c7ad6d35?auto=format&fit=crop&w=1600&q=85',
  '{}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  consulting_hub_hero = EXCLUDED.consulting_hub_hero,
  consulting_hub_secondary = EXCLUDED.consulting_hub_secondary,
  consulting_service_images = EXCLUDED.consulting_service_images,
  training_hub_hero = EXCLUDED.training_hub_hero,
  training_hub_secondary = EXCLUDED.training_hub_secondary,
  sectoral_hub_hero = EXCLUDED.sectoral_hub_hero,
  sectoral_hub_secondary = EXCLUDED.sectoral_hub_secondary,
  sectoral_service_images = EXCLUDED.sectoral_service_images;

-- ============================================================
-- CONSULTING SERVICES (SEO content)
-- ============================================================
INSERT INTO services (
  kind, slug, code, sort_order, title, summary, intro,
  intro_image_url, offerings, offerings_image_url,
  custom_section_title, custom_section_items, custom_section_image_url,
  process_image_url, process_steps
) VALUES
('consulting','iso-9001','ISO 9001',10,
 'Kalite Yonetim Sistemi Danismanlik Hizmeti',
 'ISO 9001 gereksinimlerine uyumlu, olculebilir ve surdurulebilir kalite yonetim sistemi kurulumu.',
 'ISO 9001, kurulusunuzun musteri beklentilerini tutarli sekilde karsilamasini ve surekli iyilestirme kulturunu kurumsallastirmasini saglayan uluslararasi bir standarttir. BMG Danismanlik olarak kalite politikasindan performans gostergelerine kadar tum sistemi kurumunuza ozel olarak tasarlariz.',
 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=85',
 ARRAY['Kapsam ve baglam analizi', 'Surec haritalama ve KPI tasarimi', 'Risk ve firsat yonetimi', 'Ic tetkik ve YGG hazirligi', 'Belgelendirme denetimi koordinasyonu'],
 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=85',
 'ISO 9001 ile olculebilir kalite kazanimlari',
 ARRAY['Surec performansinda netlik', 'Denetimlerde daha yuksek hazirlik seviyesi', 'Musteri memnuniyetinde surekli iyilestirme'],
 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1600&q=85',
 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=85',
 '[{"title":"Kesif","text":"Mevcut durum ve hedeflerin analizi."},{"title":"Tasarim","text":"Surec yapisi, dokumantasyon ve rol tanimlari."},{"title":"Uygulama","text":"Saha destegi, olcum ve iyilestirme."},{"title":"Belgelendirme","text":"Denetim oncesi son hazirlik ve eslik."}]'
),
('consulting','iso-14001','ISO 14001',20,
 'Cevre Yonetim Sistemi Danismanlik Hizmeti',
 'ISO 14001 ile cevresel etkilerinizi yoneten, mevzuata uyumlu ve surdurulebilir bir sistem olusturun.',
 'ISO 14001, cevresel performansin olculmesi ve surekli gelistirilmesi icin sistematik bir yapi sunar. Onemli cevresel boyutlarin belirlenmesinden operasyonel kontrollere kadar tum sureci kurumunuza uyarlayarak ilerletiriz.',
 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1600&q=85',
 ARRAY['Cevresel boyut-etki analizi', 'Mevzuat uyum takibi', 'Cevresel hedef ve programlar', 'Acil durum planlamasi', 'Belgelendirme hazirligi'],
 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?auto=format&fit=crop&w=1600&q=85',
 'Cevresel performans odakli faydalar',
 ARRAY['Mevzuata uyumda guvenli yapi', 'Kaynak kullaniminda verimlilik', 'Surdurulebilirlik hedeflerine hizli ilerleme'],
 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=85',
 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1600&q=85',
 '[{"title":"Degerlendirme","text":"Mevcut cevre uygulamalarinin analizi."},{"title":"Kurulum","text":"Politika, hedefler ve kontrol mekanizmalari."},{"title":"Uygulama","text":"Saha yayilimi ve takip sistemleri."},{"title":"Denetim","text":"Ic tetkik ve belgelendirme hazirligi."}]'
),
('consulting','iso-45001','ISO 45001',30,
 'Is Sagligi ve Guvenligi Yonetim Sistemi Danismanlik Hizmeti',
 'ISO 45001 ile tehlike ve risklerinizi sistematik yonetin, guvenli calisma kulturunu guclendirin.',
 'ISO 45001 standardi; calisan sagligi, guvenli operasyon ve yasal uyum hedeflerini tek bir yonetim modeli altinda toplar. Tehlike tanimlamadan olay yonetimine kadar tum adimlarda rehberlik saglariz.',
 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1600&q=85',
 ARRAY['Tehlike kaynaklarinin belirlenmesi', 'Risk degerlendirme metodolojisi', 'Operasyonel kontroller ve acil durum', 'Olay arastirma ve DOF yonetimi', 'Ic tetkik ve performans takibi'],
 'https://images.unsplash.com/photo-1581092787765-e3feb951d987?auto=format&fit=crop&w=1600&q=85',
 'Is guvenligi performansinda iyilestirme',
 ARRAY['Risklerin azaltilmasi', 'Calisan katiliminda artis', 'Denetim bulgularinda dusus'],
 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1600&q=85',
 'https://images.unsplash.com/photo-1581091215367-59ab6dcef2f5?auto=format&fit=crop&w=1600&q=85',
 '[{"title":"Planlama","text":"I SG kapsam ve hedeflerinin netlestirilmesi."},{"title":"Sistem","text":"Surecler, sorumluluklar ve kontrol mekanizmalari."},{"title":"Uygulama","text":"Saha entegrasyonu ve performans izleme."},{"title":"Sureklilik","text":"YGG ve surekli iyilestirme dongusu."}]'
),
('consulting','iso-27001','ISO 27001',40,
 'Bilgi Guvenligi Yonetim Sistemi Danismanlik Hizmeti',
 'ISO 27001 ile bilgi varliklarinizi koruyun, siber ve operasyonel riskleri yonetin.',
 'ISO 27001, bilgi guvenliginde gizlilik, butunluk ve erisilebilirlik ekseninde kapsamli bir yonetim modeli sunar. Varlik envanteri, risk analizi ve kontrol secimlerinde kurumsal yapiniza uygun cozumler gelistiririz.',
 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1600&q=85',
 ARRAY['Bilgi varlik envanteri ve kapsam', 'Risk analizi ve risk isleme plani', 'Politika ve prosedur seti', 'Olay yonetimi ve sureklilik', 'Belgelendirme hazirligi'],
 'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&w=1600&q=85',
 'Bilgi guvenliginde kritik kazanımlar',
 ARRAY['Siber risklerde kontrol', 'Musteri guveninde artış', 'Uyumluluk sureclerinde hız'],
 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1600&q=85',
 'https://images.unsplash.com/photo-1496096265110-f83ad7f96608?auto=format&fit=crop&w=1600&q=85',
 '[{"title":"Kapsam","text":"Varliklar, sinirlar ve paydas beklentileri."},{"title":"Risk","text":"Tehdit, zafiyet ve etki analizi."},{"title":"Kontroller","text":"Kontrol secimi ve dokumantasyon."},{"title":"Denetim","text":"Ic tetkik, DOF ve sertifikasyon hazirligi."}]'
),
('consulting','as-9100','AS 9100',50,
 'Havacilik Uzay ve Savunma Sanayi KYS Danismanlik Hizmeti',
 'AS 9100 gereksinimleriyle uyumlu kalite altyapisi kurarak savunma ve havacilikta denetim basarinizi artirin.',
 'AS 9100, ISO 9001 temeline ek olarak havacilik, uzay ve savunma sektorlerine ozel risk, izlenebilirlik, urun guvenligi ve tedarik zinciri gereksinimleri icerir. BMG Danismanlik olarak gap analizinden sertifikasyon denetimine kadar tum surecte kurumunuza ozel bir yol haritasi sunariz.',
 'https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=1600&q=85',
 ARRAY['AS 9100 gap analizi ve yol haritasi', 'Yapilandirma yonetimi ve izlenebilirlik', 'Urun guvenligi ve ozel surec kontrolu', 'Tedarikci yonetimi ve performans izleme', 'Denetim oncesi kapsamli hazirlik ve eslik'],
 'https://images.unsplash.com/photo-1474302770737-173ee21bab63?auto=format&fit=crop&w=1600&q=85',
 'AS 9100 ile sektor odakli fark yaratan noktalar',
 ARRAY['Tedarik zinciri guvenilirligi', 'Urun guvenligi odakli kultur', 'Denetim basarisinda istikrar'],
 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1600&q=85',
 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=85',
 '[{"title":"Gap Analizi","text":"AS 9100 maddelerine gore mevcut durumun olculmesi."},{"title":"Sistem Tasarimi","text":"Sektor gereksinimlerine uygun surec ve dokumantasyon."},{"title":"Uygulama","text":"Saha entegrasyonu, ic tetkik ve duzeltici faaliyetler."},{"title":"Belgelendirme","text":"Denetim koordinasyonu ve surekli iyilestirme plani."}]'
),
('consulting','iatf-16949','IATF 16949',60,
 'Otomotiv Kalite Yonetim Sistemi Danismanlik Hizmeti',
 'IATF 16949 ile otomotiv sektorunde musteri ozel sartlara uyumlu kalite sistemi kurun.',
 'IATF 16949; APQP, PPAP, FMEA, MSA ve SPC gibi cekirdek kalite araclariyla entegre bir yapi gerektirir. Uretim ve tedarik zinciri sureclerinizde hata onleme odakli yaklasimlar olusturmaniza destek veririz.',
 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1600&q=85',
 ARRAY['Musteri ozel sart analizi', 'Core tools entegrasyonu', 'Saha proses kontrolu', 'Problem cozum metodolojileri', 'Belgelendirme hazirlik destegi'],
 'https://images.unsplash.com/photo-1537041373298-55dbb8984f55?auto=format&fit=crop&w=1600&q=85',
 'Otomotiv kalite yonetiminde ana faydalar',
 ARRAY['Hata onleme odakli surec', 'Musteri beklentisine hizli uyum', 'Saha performansinda surekli iyilesme'],
 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85',
 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=1600&q=85',
 '[{"title":"Analiz","text":"Mevcut otomotiv kalite sureclerinin degerlendirilmesi."},{"title":"Tasarim","text":"IATF uyumlu surec ve KPI yapisi."},{"title":"Yayilim","text":"Egitim, uygulama ve izleme."},{"title":"Denetim","text":"Sertifikasyon oncesi son kontrol ve rehberlik."}]'
)
ON CONFLICT (kind, slug) DO UPDATE SET
  code = EXCLUDED.code,
  sort_order = EXCLUDED.sort_order,
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  intro = EXCLUDED.intro,
  intro_image_url = EXCLUDED.intro_image_url,
  offerings = EXCLUDED.offerings,
  offerings_image_url = EXCLUDED.offerings_image_url,
  custom_section_title = EXCLUDED.custom_section_title,
  custom_section_items = EXCLUDED.custom_section_items,
  custom_section_image_url = EXCLUDED.custom_section_image_url,
  process_image_url = EXCLUDED.process_image_url,
  process_steps = EXCLUDED.process_steps;

-- ============================================================
-- TRAINING SERVICES (SEO content)
-- ============================================================
INSERT INTO services (
  kind, slug, code, sort_order, title, summary, intro,
  intro_image_url, offerings, offerings_image_url,
  custom_section_title, custom_section_items, custom_section_image_url,
  process_image_url, process_steps
) VALUES
('training','iso-9001','ISO 9001',10,
 'ISO 9001 Kalite Yonetim Sistemi Egitimi',
 'ISO 9001 standardini ekiplerinizin gunluk operasyonlarina aktaracak uygulamali egitim.',
 'Bu egitim, kalite yonetim sisteminin temel prensiplerini kurumunuzun surec yapisina entegre etmenize yardimci olur. Icerik; standart maddeleri, surec yaklasimi, risk yonetimi ve ic tetkik adimlarini kapsar.',
 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=85',
 ARRAY['ISO 9001 madde yapisi', 'Surec yaklasimi ve KPI', 'Risk temelli dusunme', 'Ic tetkik teknikleri', 'YGG ve surekli iyilestirme'],
 'https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=1600&q=85',
 'Egitim ciktilari ve kurumsal kazanimlar',
 ARRAY['Uygulamaya donuk standart bilgisi', 'Ekipler arasi ortak kalite dili', 'Ic tetkik yetkinliginde artis'],
 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1600&q=85',
 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1600&q=85',
 '[{"title":"Ihtiyac Analizi","text":"Katilimci profili ve ogrenim hedeflerinin belirlenmesi."},{"title":"Teorik Cekirdek","text":"Standardin gereksinimlerinin anlatimi."},{"title":"Atolye","text":"Vaka calismalariyla uygulamali pekistirme."},{"title":"Degerlendirme","text":"Ogrenim ciktilarinin olculmesi ve geri bildirim."}]'
),
('training','iso-14001','ISO 14001',20,
 'ISO 14001 Cevre Yonetim Sistemi Egitimi',
 'Cevresel etki yonetimi ve mevzuat uyumunu guclendiren kurumsal egitim programi.',
 'ISO 14001 egitimi ile cevresel boyut-etki yaklasimi, operasyonel kontroller ve surekli iyilestirme mekanizmalarini ekiplerinizin aktif kullanimina uygun sekilde aktaririz.',
 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=85',
 ARRAY['Cevresel boyut-etki', 'Yasal uyum gereksinimleri', 'Hedef ve program yonetimi', 'Acil durum yaklasimi', 'Ic tetkik farkindaligi'],
 'https://images.unsplash.com/photo-1492496913980-501348b61469?auto=format&fit=crop&w=1600&q=85',
 'Cevre egitiminde odaklanan kritik noktalar',
 ARRAY['Saha farkindaliginda artis', 'Yasal uyum sureclerinde netlik', 'Surdurulebilirlik hedeflerine katkı'],
 'https://images.unsplash.com/photo-1421789665209-c9b2a435e3dc?auto=format&fit=crop&w=1600&q=85',
 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1600&q=85',
 '[{"title":"Hazirlik","text":"Kurumsal cevre hedeflerinin belirlenmesi."},{"title":"Egitim","text":"ISO 14001 gereksinimlerinin aktarimi."},{"title":"Uygulama","text":"Saha senaryolari ve kontrol listeleri."},{"title":"Kapanis","text":"Aksiyon plani ve takip onerileri."}]'
),
('training','iso-45001','ISO 45001',30,
 'ISO 45001 Is Sagligi ve Guvenligi Yonetim Sistemi Egitimi',
 'Is guvenligi kulturunu guclendiren, risk odakli ve uygulamali ISO 45001 egitimi.',
 'Egitim programi, is kazalarini onlemeye yonelik sistematik yaklasimlar ve standardin operasyonel uygulamalarini kapsar. Tehlike belirleme ve risk azaltma metodlari detayli olarak ele alinir.',
 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1600&q=85',
 ARRAY['Tehlike tanimlama', 'Risk degerlendirme', 'Operasyonel kontrol', 'Olay yonetimi', 'Surekli iyilestirme'],
 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1600&q=85',
 'ISG egitiminde one cikan degerler',
 ARRAY['Guvenli davranis bilinci', 'Risk azaltma yetkinligi', 'Saha uygulamalarinda istikrar'],
 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=1600&q=85',
 'https://images.unsplash.com/photo-1581092921461-eab10380d3b4?auto=format&fit=crop&w=1600&q=85',
 '[{"title":"Giris","text":"ISO 45001 yapisi ve temel kavramlar."},{"title":"Derinlesme","text":"Risk ve kontrol mekanizmalarinin uygulamasi."},{"title":"Atolye","text":"Kurumdan ornek senaryolar uzerinde calisma."},{"title":"Sonuc","text":"Yetkinlik kazanimi ve iyilestirme oneri seti."}]'
),
('training','iso-27001','ISO 27001',40,
 'ISO 27001 Bilgi Guvenligi Yonetim Sistemi Egitimi',
 'Bilgi guvenligi farkindaligini ve BGYS uygulama yetkinligini artiran kapsamli egitim.',
 'ISO 27001 egitiminde bilgi varligi yonetimi, risk analizi, kontrol secimi ve olay yonetimi basliklari kurumunuza ozel senaryolarla ele alinir.',
 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1600&q=85',
 ARRAY['BGYS kapsam ve varlik envanteri', 'Risk degerlendirme mantigi', 'Kontrol secimi ve dokumantasyon', 'Olay yonetimi ve sureklilik', 'Denetim farkindaligi'],
 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=85',
 'Bilgi guvenligi egitiminde fark yaratan basliklar',
 ARRAY['Siber farkindalikta artis', 'Kontrol seciminde dogru yaklasim', 'Denetime hazir ekip yapisi'],
 'https://images.unsplash.com/photo-1526378800651-c32d170fe6f8?auto=format&fit=crop&w=1600&q=85',
 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&w=1600&q=85',
 '[{"title":"Temel Bilgi","text":"BGYS ve ISO 27001 cercevesi."},{"title":"Uygulama","text":"Risk ve kontrol eslestirme senaryolari."},{"title":"Olcum","text":"Performans gostergeleri ve raporlama."},{"title":"Pekistirme","text":"Sorular, ornekler ve aksiyon plani."}]'
),
('training','as-9100','AS 9100',50,
 'AS 9100 Havacilik Uzay ve Savunma Sanayi KYS Egitimi',
 'AS 9100 ozel gereksinimlerini ekiplerinize uygulamali olarak kazandiran sektor odakli egitim.',
 'AS 9100 egitimi; urun guvenligi, izlenebilirlik, tedarikci yonetimi ve ozel surec kontrolu gibi kritik konulari ISO 9001 farklariyla birlikte ele alir. Savunma ve havacilik sektorunde denetime hazir ekipler yetistirmeyi hedefler.',
 'https://images.unsplash.com/photo-1517479149777-5f3b1511d5ad?auto=format&fit=crop&w=1600&q=85',
 ARRAY['AS 9100 ve ISO 9001 farklari', 'Urun guvenligi ve izlenebilirlik', 'Yapilandirma yonetimi', 'Tedarikci ve risk yonetimi', 'Denetim sorularina hazirlik'],
 'https://images.unsplash.com/photo-1474302770737-173ee21bab63?auto=format&fit=crop&w=1600&q=85',
 'AS 9100 egitimi ile sektor odakli yetkinlikler',
 ARRAY['Havacilik kalite diliyle ortak anlayis', 'Izlenebilirlik disiplininde guclenme', 'Denetime hazir ekip kulturu'],
 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1600&q=85',
 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=85',
 '[{"title":"Karsilastirma","text":"AS 9100 ek gereksinimlerinin netlestirilmesi."},{"title":"Atolye","text":"Sektor odakli ornek sureclerle uygulama."},{"title":"Uygulama","text":"Kontrol noktalarinin kurumunuza uyarlanmasi."},{"title":"Degerlendirme","text":"Yetkinlik olcumu ve takip plani."}]'
)
ON CONFLICT (kind, slug) DO UPDATE SET
  code = EXCLUDED.code,
  sort_order = EXCLUDED.sort_order,
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  intro = EXCLUDED.intro,
  intro_image_url = EXCLUDED.intro_image_url,
  offerings = EXCLUDED.offerings,
  offerings_image_url = EXCLUDED.offerings_image_url,
  custom_section_title = EXCLUDED.custom_section_title,
  custom_section_items = EXCLUDED.custom_section_items,
  custom_section_image_url = EXCLUDED.custom_section_image_url,
  process_image_url = EXCLUDED.process_image_url,
  process_steps = EXCLUDED.process_steps;

-- ============================================================
-- SECTORAL SERVICES (SEO content)
-- ============================================================
INSERT INTO services (
  kind, slug, code, sort_order, title, summary, intro,
  intro_image_url, offerings, offerings_image_url,
  custom_section_title, custom_section_items, custom_section_image_url,
  process_image_url, process_steps
) VALUES
('sectoral','as-9100-havacilik-savunma','AS 9100',10,
 'AS 9100 Havacilik Uzay ve Savunma Sanayi Egitim, Danismanlik ve Belgelendirme Hizmetleri',
 'AS 9100 odakli egitim, danismanlik ve belgelendirme surecinde savunma ve havacilik firmalarina uctan uca destek.',
 'Savunma ve havacilik sektorlerinde faaliyet gosteren kuruluslar icin AS 9100 uyumu stratejik bir gerekliliktir. BMG Danismanlik, mevcut durum analizi, dokumantasyon, saha uygulamasi ve denetim hazirligi adimlarini tek bir proje plani ile yonetir.',
 'https://images.unsplash.com/photo-1517479149777-5f3b1511d5ad?auto=format&fit=crop&w=1600&q=85',
 ARRAY['AS 9100 gap analizi', 'Egitim ve uygulama programi', 'Dokumantasyon iyilestirme', 'Tedarik zinciri ve izlenebilirlik', 'Belgelendirme denetimi esligi'],
 'https://images.unsplash.com/photo-1474302770737-173ee21bab63?auto=format&fit=crop&w=1600&q=85',
 'Sektore ozel AS 9100 guclu yonleri',
 ARRAY['Yuksek izlenebilirlik disiplini', 'Tedark zinciri performansinda artış', 'Denetim uyumunda hizli olgunluk'],
 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1600&q=85',
 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=85',
 '[{"title":"On Analiz","text":"Kapsam, beklentiler ve kritik bosluklarin belirlenmesi."},{"title":"Planlama","text":"Proje takvimi ve kaynak planinin olusturulmasi."},{"title":"Uygulama","text":"Sistem kurulumunun sahada devreye alinmasi."},{"title":"Sertifikasyon","text":"Denetim hazirligi ve surec sonrasi iyilestirme."}]'
),
('sectoral','eydep','EYDEP',20,
 'EYDEP Basvuru Islemleri ve Danismanlik Hizmetleri',
 'EYDEP sureclerinde belge hazirligi, basvuru koordinasyonu ve teknik uyum destegi.',
 'EYDEP basvuru sureclerinde kurumunuzun teknik ve idari gereksinimlerini sistematik sekilde ele aliriz. Evrak yonetimi, kontrol listeleri ve revizyon sureclerinde hizli ve net ilerleme saglariz.',
 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1600&q=85',
 ARRAY['Basvuru oncesi uygunluk analizi', 'Belge ve kayit yapisi kurulumu', 'Portal sureclerinde adim adim rehberlik', 'Revizyon ve geri bildirim yonetimi'],
 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1600&q=85',
 'EYDEP surecinde hizlandiran adimlar',
 ARRAY['Belge hazirlik suresinde kisalma', 'Basvuru hatalarinda azalma', 'Revizyon surecinde hizli kapanis'],
 'https://images.unsplash.com/photo-1450101215322-bf5cd27642fc?auto=format&fit=crop&w=1600&q=85',
 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=85',
 '[{"title":"Hazirlik","text":"Mevcut belgelerin ve gereksinimlerin kontrolu."},{"title":"Yapilandirma","text":"Eksiklerin tamamlanmasi ve dosya duzeni."},{"title":"Basvuru","text":"Portal uzerinden basvuru yonetimi."},{"title":"Takip","text":"Geri bildirimlerin hizli kapatilmasi."}]'
),
('sectoral','mevcut-durum-analizi','Analiz',30,
 'AS 9100 ve EYDEP Mevcut Durum Analizi Hizmeti',
 'AS 9100 ve EYDEP beklentilerine gore mevcut durum analizi ve onceliklendirilmis aksiyon plani.',
 'Bu hizmette kurumunuzun surecleri, kayitlari ve uygulamalari referans standartlara gore degerlendirilir. Sonuc olarak yonetime ozel bir yol haritasi ve uygulanabilir aksiyon seti sunulur.',
 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=85',
 ARRAY['Saha ve dokuman incelemesi', 'Karsilastirmali sart analizi', 'Risk ve onceliklendirme raporu', 'Yonetime ozel aksiyon plani'],
 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=85',
 'Mevcut durum analizinde yonetime deger katan ciktilar',
 ARRAY['Net onceliklendirilmis aksiyonlar', 'Uyum bosluklarinin hizli gorunurlugu', 'Kaynak planlamasinda karar destegi'],
 'https://images.unsplash.com/photo-1485217988980-11786ced9454?auto=format&fit=crop&w=1600&q=85',
 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=85',
 '[{"title":"Veri Toplama","text":"Surec sahipleriyle gorusmeler ve kayit incelemesi."},{"title":"Analiz","text":"Sartlara gore bosluklarin siniflandirilmasi."},{"title":"Raporlama","text":"Guclu yonler ve gelisim alanlarinin sunulmasi."},{"title":"Plan","text":"Onceliklendirilmis iyilestirme adimlari."}]'
),
('sectoral','tesis-guvenlik-belgesi','Tesis Guvenlik',40,
 'Tesis Guvenlik Belgesi Danismanlik Hizmetleri',
 'Tesis guvenlik belgesi surecinde mevzuat uyumu, dokumantasyon ve basvuru hazirligi destegi.',
 'Tesis guvenlik belgesi sureclerinde kurumsal hazirlik, fiziksel guvenlik gereksinimleri ve dokumantasyon butunlugu kritik oneme sahiptir. BMG Danismanlik, basvuru surecinin her adiminda teknik ve operasyonel rehberlik sunar.',
 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=85',
 ARRAY['Mevcut guvenlik altyapisinin analizi', 'Dokumantasyon ve prosedur seti hazirligi', 'Basvuru paketinin olusturulmasi', 'Basvuru sonrasi revizyon destegi'],
 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85',
 'Tesis guvenlik belgesinde one cikan avantajlar',
 ARRAY['Resmi sureclerde hizli ilerleme', 'Dokumantasyon kalitesinde artis', 'Surdurulebilir guvenlik altyapisi'],
 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&w=1600&q=85',
 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=85',
 '[{"title":"On Degerlendirme","text":"Tesisin guvenlik gereksinimlerine gore analiz edilmesi."},{"title":"Hazirlik","text":"Belge, plan ve prosedurlerin tamamlanmasi."},{"title":"Basvuru","text":"Dosyanin teslimi ve resmi surec takibi."},{"title":"Izleme","text":"Geri bildirimlere gore duzeltici aksiyonlar."}]'
)
ON CONFLICT (kind, slug) DO UPDATE SET
  code = EXCLUDED.code,
  sort_order = EXCLUDED.sort_order,
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  intro = EXCLUDED.intro,
  intro_image_url = EXCLUDED.intro_image_url,
  offerings = EXCLUDED.offerings,
  offerings_image_url = EXCLUDED.offerings_image_url,
  custom_section_title = EXCLUDED.custom_section_title,
  custom_section_items = EXCLUDED.custom_section_items,
  custom_section_image_url = EXCLUDED.custom_section_image_url,
  process_image_url = EXCLUDED.process_image_url,
  process_steps = EXCLUDED.process_steps;

-- ============================================================
-- DONE
-- ============================================================
-- Create admin user in Supabase Auth and login via /admin/login
-- (legacy duplicated SQL block removed)
