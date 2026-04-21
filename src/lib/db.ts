import { supabase } from './supabase'
import { defaultHomeSectionCopy } from '../data/homeSectionCopy'
import { buildDefaultSiteContent } from '../content/buildDefault'
import type {
  AboutPageContent,
  ContactMessage,
  ConsultingService,
  HeroSlide,
  HeroStatCard,
  NavItem,
  SectoralService,
  SiteContent,
  SiteInfo,
  SiteVisuals,
  TrainingService,
} from '../content/types'

// ── Row types (what Supabase returns) ─────────────────────────

interface SiteConfigRow {
  name: string
  site_url: string
  google_business_profile_url: string | null
  email: string
  phone: string
  address: string
  tagline: string
  description: string
  logo: string | null
  favicon: string | null
  page_banners: Partial<SiteContent['pageBanners']> | null
  home_section_copy: Partial<SiteContent['homeSectionCopy']> | null
  email_settings: Partial<SiteContent['emailSettings']> | null
}

interface NavItemRow {
  id: string
  label: string
  label_short: string | null
  sort_order: number
}

interface HeroSlideRow {
  id: string
  src: string
  alt: string
  sort_order: number
}

interface HeroStatRow {
  id: string
  label: string
  value: string
  sort_order: number
}

interface ServiceRow {
  id: string
  kind: string
  slug: string
  code: string
  sort_order: number
  title: string
  summary: string
  intro: string
  intro_image_url: string | null
  offerings: string[]
  offerings_image_url: string | null
  custom_section_title: string | null
  custom_section_items: string[] | null
  custom_section_image_url: string | null
  process_image_url: string | null
  process_steps: { title: string; text: string }[]
  hero_image_url: string | null
}

interface HighlightRow {
  id: string
  kind: string
  text: string
  sort_order: number
}

interface AboutPageRow {
  hero_image_url: string
  hero_eyebrow: string
  hero_title: string
  hero_subtitle_override: string | null
  meta_description: string | null
  main_paragraph: string
  bullets: string[]
  side_card_title: string
  side_card_text: string
  focus_areas: string[]
  cta_strip_title: string
}

interface SiteVisualsRow {
  consulting_hub_hero: string
  consulting_hub_secondary: string
  consulting_service_images: Record<string, string>
  training_hub_hero: string
  training_hub_secondary: string
  sectoral_hub_hero: string
  sectoral_hub_secondary: string
  sectoral_service_images: Record<string, string>
}

interface ContactMessageRow {
  id: string
  ad: string
  email: string
  telefon: string | null
  konu: string | null
  mesaj: string
  is_read: boolean
  replied_at: string | null
  reply_text: string | null
  created_at: string
}

// ── Read functions ────────────────────────────────────────────

export async function fetchSiteContent(): Promise<SiteContent | null> {
  try {
    const defaults = buildDefaultSiteContent()
    const [
      { data: cfg },
      { data: navRows },
      { data: slideRows },
      { data: statRows },
      { data: serviceRows },
      { data: highlightRows },
      { data: aboutRow },
      { data: visualsRow },
    ] = await Promise.all([
      supabase.from('site_config').select('*').eq('id', 1).single<SiteConfigRow>(),
      supabase.from('nav_items').select('*').order('sort_order').returns<NavItemRow[]>(),
      supabase.from('hero_slides').select('*').order('sort_order').returns<HeroSlideRow[]>(),
      supabase.from('hero_stats').select('*').order('sort_order').returns<HeroStatRow[]>(),
      supabase.from('services').select('*').order('sort_order').returns<ServiceRow[]>(),
      supabase.from('section_highlights').select('*').order('sort_order').returns<HighlightRow[]>(),
      supabase.from('about_page').select('*').eq('id', 1).single<AboutPageRow>(),
      supabase.from('site_visuals').select('*').eq('id', 1).single<SiteVisualsRow>(),
    ])

    if (!cfg || !navRows || !slideRows || !statRows || !serviceRows || !highlightRows || !aboutRow || !visualsRow) {
      return null
    }

    const site: SiteInfo = {
      name: cfg.name,
      tagline: cfg.tagline,
      description: cfg.description,
      url: cfg.site_url,
      googleBusinessProfileUrl: cfg.google_business_profile_url ?? '',
      email: cfg.email,
      phone: cfg.phone,
      address: cfg.address,
      logo: cfg.logo ?? '',
      favicon: cfg.favicon ?? '/favicon.svg',
    }

    const navItems: NavItem[] = navRows.map((r) => ({
      id: r.id,
      label: r.label,
      labelShort: r.label_short ?? undefined,
    }))

    const heroSlides: HeroSlide[] = slideRows.map((r) => ({
      id: r.id,
      src: r.src,
      alt: r.alt,
    }))

    const heroStats: HeroStatCard[] = statRows.map((r) => ({
      label: r.label,
      value: r.value,
    }))

    const toService = (r: ServiceRow): ConsultingService => ({
      slug: r.slug,
      code: r.code,
      title: r.title,
      summary: r.summary,
      intro: r.intro,
      introImageUrl: r.intro_image_url ?? '',
      offerings: r.offerings ?? [],
      offeringsImageUrl: r.offerings_image_url ?? '',
      customSectionTitle: r.custom_section_title ?? '',
      customSectionItems: r.custom_section_items ?? [],
      customSectionImageUrl: r.custom_section_image_url ?? '',
      processImageUrl: r.process_image_url ?? '',
      processSteps: r.process_steps ?? [],
    })

    const consultingServices = serviceRows.filter((r) => r.kind === 'consulting').map(toService) as ConsultingService[]
    const trainingServices = serviceRows.filter((r) => r.kind === 'training').map(toService) as TrainingService[]
    const sectoralServices = serviceRows.filter((r) => r.kind === 'sectoral').map(toService) as SectoralService[]

    const highlights = (kind: string) => highlightRows.filter((r) => r.kind === kind).map((r) => r.text)
    const trainingHighlights = highlights('training')
    const sectoralHighlights = highlights('sectoral')

    const aboutPage: AboutPageContent = {
      heroImageUrl: aboutRow.hero_image_url,
      heroEyebrow: aboutRow.hero_eyebrow,
      heroTitle: aboutRow.hero_title,
      heroSubtitleOverride: aboutRow.hero_subtitle_override ?? '',
      metaDescription: aboutRow.meta_description ?? '',
      mainParagraph: aboutRow.main_paragraph,
      bullets: aboutRow.bullets ?? [],
      sideCardTitle: aboutRow.side_card_title,
      sideCardText: aboutRow.side_card_text,
      focusAreas: aboutRow.focus_areas ?? [],
      ctaStripTitle: aboutRow.cta_strip_title,
    }

    const visuals: SiteVisuals = {
      consulting: {
        hubHero: visualsRow.consulting_hub_hero,
        hubSecondary: visualsRow.consulting_hub_secondary,
        serviceHeroBySlug: visualsRow.consulting_service_images ?? {},
      },
      training: {
        hubHero: visualsRow.training_hub_hero,
        hubSecondary: visualsRow.training_hub_secondary,
      },
      sectoral: {
        hubHero: visualsRow.sectoral_hub_hero,
        hubSecondary: visualsRow.sectoral_hub_secondary,
        heroBySlug: visualsRow.sectoral_service_images ?? {},
      },
    }

    return {
      site,
      navItems,
      heroSlides,
      heroStats,
      consultingServices,
      trainingServices,
      sectoralServices,
      trainingHighlights,
      sectoralHighlights,
      aboutPage,
      visuals,
      pageBanners: {
        ...defaults.pageBanners,
        ...(cfg.page_banners ?? {}),
      },
      homeSectionCopy: {
        ...defaultHomeSectionCopy,
        ...(cfg.home_section_copy ?? {}),
      },
      emailSettings: {
        ...defaults.emailSettings,
        ...(cfg.email_settings ?? {}),
      },
    }
  } catch (err) {
    console.error('[db] fetchSiteContent failed', err)
    return null
  }
}

// ── Write functions (admin — requires authenticated session) ──

export async function upsertSiteConfig(patch: Partial<SiteConfigRow>): Promise<void> {
  const { error } = await supabase.from('site_config').upsert({ id: 1, ...patch })
  if (error) throw error
}

export async function syncSiteContentSnapshot(content: SiteContent): Promise<void> {
  await upsertSiteConfig({
    name: content.site.name,
    site_url: content.site.url,
    google_business_profile_url: content.site.googleBusinessProfileUrl,
    email: content.site.email,
    phone: content.site.phone,
    address: content.site.address,
    tagline: content.site.tagline,
    description: content.site.description,
    logo: content.site.logo,
    favicon: content.site.favicon,
    page_banners: content.pageBanners,
    home_section_copy: content.homeSectionCopy,
    email_settings: content.emailSettings,
  })

  await upsertNavItems(
    content.navItems.map((item, idx) => ({
      id: item.id,
      label: item.label,
      label_short: item.labelShort ?? null,
      sort_order: (idx + 1) * 10,
    })),
  )

  await upsertAboutPage({
    hero_image_url: content.aboutPage.heroImageUrl,
    hero_eyebrow: content.aboutPage.heroEyebrow,
    hero_title: content.aboutPage.heroTitle,
    hero_subtitle_override: content.aboutPage.heroSubtitleOverride,
    meta_description: content.aboutPage.metaDescription,
    main_paragraph: content.aboutPage.mainParagraph,
    bullets: content.aboutPage.bullets,
    side_card_title: content.aboutPage.sideCardTitle,
    side_card_text: content.aboutPage.sideCardText,
    focus_areas: content.aboutPage.focusAreas,
    cta_strip_title: content.aboutPage.ctaStripTitle,
  })

  await upsertSiteVisuals({
    consulting_hub_hero: content.visuals.consulting.hubHero,
    consulting_hub_secondary: content.visuals.consulting.hubSecondary,
    consulting_service_images: content.visuals.consulting.serviceHeroBySlug,
    training_hub_hero: content.visuals.training.hubHero,
    training_hub_secondary: content.visuals.training.hubSecondary,
    sectoral_hub_hero: content.visuals.sectoral.hubHero,
    sectoral_hub_secondary: content.visuals.sectoral.hubSecondary,
    sectoral_service_images: content.visuals.sectoral.heroBySlug,
  })

  const { error: slideDeleteError } = await supabase
    .from('hero_slides')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000')
  if (slideDeleteError) throw slideDeleteError

  if (content.heroSlides.length > 0) {
    const { error: slideInsertError } = await supabase.from('hero_slides').insert(
      content.heroSlides.map((slide, idx) => ({
        src: slide.src,
        alt: slide.alt,
        sort_order: (idx + 1) * 10,
      })),
    )
    if (slideInsertError) throw slideInsertError
  }

  await upsertHeroStats(
    content.heroStats.map((row, idx) => ({
      label: row.label,
      value: row.value,
      sort_order: (idx + 1) * 10,
    })),
  )

  await upsertHighlights('training', content.trainingHighlights)
  await upsertHighlights('sectoral', content.sectoralHighlights)
}

export async function upsertAboutPage(patch: Partial<AboutPageRow>): Promise<void> {
  const { error } = await supabase.from('about_page').upsert({ id: 1, ...patch })
  if (error) throw error
}

export async function upsertSiteVisuals(patch: Partial<SiteVisualsRow>): Promise<void> {
  const { error } = await supabase.from('site_visuals').upsert({ id: 1, ...patch })
  if (error) throw error
}

export async function upsertService(
  kind: 'consulting' | 'training' | 'sectoral',
  slug: string,
  patch: Partial<Omit<ServiceRow, 'id' | 'kind' | 'slug'>>,
): Promise<void> {
  const { error } = await supabase.from('services').upsert({ kind, slug, ...patch }, { onConflict: 'kind,slug' })
  if (error) throw error
}

export async function deleteService(kind: string, slug: string): Promise<void> {
  const { error } = await supabase.from('services').delete().eq('kind', kind).eq('slug', slug)
  if (error) throw error
}

export async function upsertHeroSlide(row: Partial<HeroSlideRow> & { id?: string }): Promise<void> {
  const { error } = await supabase.from('hero_slides').upsert(row)
  if (error) throw error
}

export async function deleteHeroSlide(id: string): Promise<void> {
  const { error } = await supabase.from('hero_slides').delete().eq('id', id)
  if (error) throw error
}

export async function upsertNavItems(rows: NavItemRow[]): Promise<void> {
  const { error } = await supabase.from('nav_items').upsert(rows, { onConflict: 'id' })
  if (error) throw error
}

export async function upsertHeroStats(rows: Omit<HeroStatRow, 'id'>[]): Promise<void> {
  await supabase.from('hero_stats').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  const { error } = await supabase.from('hero_stats').insert(rows)
  if (error) throw error
}

export async function upsertHighlights(kind: string, texts: string[]): Promise<void> {
  await supabase.from('section_highlights').delete().eq('kind', kind)
  if (texts.length === 0) return
  const rows = texts.map((text, i) => ({ kind, text, sort_order: (i + 1) * 10 }))
  const { error } = await supabase.from('section_highlights').insert(rows)
  if (error) throw error
}

export async function createContactMessage(input: {
  ad: string
  email: string
  telefon?: string
  konu?: string
  mesaj: string
}): Promise<void> {
  const { error } = await supabase.from('contact_messages').insert({
    ad: input.ad,
    email: input.email,
    telefon: input.telefon ?? null,
    konu: input.konu ?? null,
    mesaj: input.mesaj,
  })
  if (error) throw error
}

export async function fetchContactMessages(): Promise<ContactMessage[]> {
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })
    .returns<ContactMessageRow[]>()
  if (error) throw error
  return (data ?? []).map((row) => ({
    id: row.id,
    ad: row.ad,
    email: row.email,
    telefon: row.telefon ?? '',
    konu: row.konu ?? '',
    mesaj: row.mesaj,
    isRead: row.is_read,
    repliedAt: row.replied_at,
    replyText: row.reply_text ?? '',
    createdAt: row.created_at,
  }))
}

export async function markContactMessageRead(id: string, isRead: boolean): Promise<void> {
  const { error } = await supabase
    .from('contact_messages')
    .update({ is_read: isRead })
    .eq('id', id)
  if (error) throw error
}

export async function saveContactMessageReply(id: string, replyText: string): Promise<void> {
  const { error } = await supabase
    .from('contact_messages')
    .update({ reply_text: replyText, replied_at: new Date().toISOString(), is_read: true })
    .eq('id', id)
  if (error) throw error
}

export async function deleteContactMessage(id: string): Promise<void> {
  const { error } = await supabase.from('contact_messages').delete().eq('id', id)
  if (error) throw error
}
