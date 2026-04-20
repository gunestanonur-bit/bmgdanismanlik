import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { buildDefaultSiteContent } from './buildDefault'
import {
  downloadJson,
  loadStoredContent,
  saveContentToStorage,
  clearStoredContent,
} from './storage'
import { fetchSiteContent, syncSiteContentSnapshot } from '../lib/db'
import type { HeroSlide, PageBanners, SiteContent } from './types'

/** DB / eski dışa aktarımlar eksik `title` & `description` bırakır; paket varsayılanlarıyla tamamla */
function mergeHeroSlidesWithDefaults(defaults: HeroSlide[], incoming?: HeroSlide[] | null): HeroSlide[] {
  if (!incoming?.length) return defaults
  return incoming.map((slide, i) => {
    const def = defaults[i] ?? defaults[defaults.length - 1]
    return {
      id: slide.id?.trim() ? slide.id : def.id,
      src: typeof slide.src === 'string' ? slide.src : def.src,
      alt: slide.alt?.trim() ? slide.alt : def.alt,
      title: slide.title?.trim() ? slide.title : def.title,
      description: slide.description?.trim() ? slide.description : def.description,
    }
  })
}

/** `fetchSiteContent` does not yet load page banners from Supabase; keep uploads from localStorage */
function overlayPageBannersFromLocalStorage(base: SiteContent): SiteContent {
  const stored = loadStoredContent()
  if (!stored?.pageBanners) return base
  const next: PageBanners = { ...base.pageBanners }
  for (const k of Object.keys(next) as (keyof PageBanners)[]) {
    const v = stored.pageBanners[k]
    if (typeof v === 'string' && v.trim()) next[k] = v
  }
  return { ...base, pageBanners: next }
}

/** Hero slider: DB has only src/alt; localStorage can hold uploads, pasted URLs, edited metin */
function overlayHeroSlidesFromLocalStorage(base: SiteContent): SiteContent {
  const stored = loadStoredContent()
  if (!stored?.heroSlides?.length) return base

  const merged = base.heroSlides.map((r, i) => {
    const l = stored.heroSlides[i]
    if (!l) return r

    const srcL = l.src?.trim() ?? ''
    const srcR = r.src?.trim() ?? ''
    const dataUpload = srcL.startsWith('data:')
    const pastedDifferentHttp =
      (srcL.startsWith('http://') || srcL.startsWith('https://')) && srcL !== srcR

    const textDiffers =
      (l.title?.trim() && l.title !== r.title) ||
      (l.description?.trim() && l.description !== r.description) ||
      (l.alt?.trim() && l.alt !== r.alt)

    if (dataUpload || pastedDifferentHttp || textDiffers) {
      return {
        ...r,
        src: dataUpload || pastedDifferentHttp ? l.src : r.src,
        title: l.title?.trim() ? l.title : r.title,
        description: l.description?.trim() ? l.description : r.description,
        alt: l.alt?.trim() ? l.alt : r.alt,
      }
    }

    if (!r.title?.trim() && !r.description?.trim() && (l.title?.trim() || l.description?.trim())) {
      return {
        ...r,
        title: l.title ?? r.title,
        description: l.description ?? r.description,
        alt: l.alt ?? r.alt,
      }
    }
    return r
  })

  if (stored.heroSlides.length > base.heroSlides.length) {
    return {
      ...base,
      heroSlides: [...merged, ...stored.heroSlides.slice(base.heroSlides.length)],
    }
  }
  return { ...base, heroSlides: merged }
}

/** Uzak veri `homeSectionCopy` taşımayabilir; tarayıcıdaki düzenlemeleri koru */
function overlayHomeSectionCopyFromLocalStorage(base: SiteContent): SiteContent {
  const stored = loadStoredContent()
  if (!stored?.homeSectionCopy) return base
  return {
    ...base,
    homeSectionCopy: { ...base.homeSectionCopy, ...stored.homeSectionCopy },
  }
}

// ── Context value ─────────────────────────────────────────────

type SiteContentContextValue = {
  content: SiteContent
  /** Replace all content (admin import) */
  replaceContent: (next: SiteContent) => void
  /** Functional updater (admin edits) */
  updateContent: (updater: (prev: SiteContent) => SiteContent) => void
  saveToBrowser: () => void
  resetToBundledDefaults: () => void
  exportJson: () => void
  importJson: (json: string) => { ok: true } | { ok: false; error: string }
  hasCustomData: boolean
  /** Whether content is currently being loaded from Supabase */
  isLoading: boolean
}

const SiteContentContext = createContext<SiteContentContextValue | null>(null)

// ── Normalise helper ──────────────────────────────────────────

/** Merge partial / older exports with bundled defaults so nothing is missing */
export function normalizeLoaded(raw: Partial<SiteContent>): SiteContent {
  const d = buildDefaultSiteContent()
  return {
    ...d,
    ...raw,
    site: { ...d.site, ...raw.site },
    navItems: raw.navItems?.length ? raw.navItems : d.navItems,
    trainingHighlights: raw.trainingHighlights?.length ? raw.trainingHighlights : d.trainingHighlights,
    sectoralHighlights: raw.sectoralHighlights?.length ? raw.sectoralHighlights : d.sectoralHighlights,
    heroSlides: mergeHeroSlidesWithDefaults(d.heroSlides, raw.heroSlides),
    heroStats: raw.heroStats?.length ? raw.heroStats : d.heroStats,
    consultingServices: raw.consultingServices?.length ? raw.consultingServices : d.consultingServices,
    trainingServices: raw.trainingServices?.length ? raw.trainingServices : d.trainingServices,
    sectoralServices: raw.sectoralServices?.length ? raw.sectoralServices : d.sectoralServices,
    aboutPage: {
      ...d.aboutPage,
      ...raw.aboutPage,
      bullets: raw.aboutPage?.bullets?.length ? raw.aboutPage.bullets : d.aboutPage.bullets,
      focusAreas: raw.aboutPage?.focusAreas?.length ? raw.aboutPage.focusAreas : d.aboutPage.focusAreas,
    },
    visuals: {
      consulting: {
        ...d.visuals.consulting,
        ...raw.visuals?.consulting,
        serviceHeroBySlug: {
          ...d.visuals.consulting.serviceHeroBySlug,
          ...raw.visuals?.consulting?.serviceHeroBySlug,
        },
      },
      training: { ...d.visuals.training, ...raw.visuals?.training },
      sectoral: {
        ...d.visuals.sectoral,
        ...raw.visuals?.sectoral,
        heroBySlug: {
          ...d.visuals.sectoral.heroBySlug,
          ...raw.visuals?.sectoral?.heroBySlug,
        },
      },
    },
    pageBanners: {
      ...d.pageBanners,
      ...raw.pageBanners,
    },
    homeSectionCopy: {
      ...d.homeSectionCopy,
      ...raw.homeSectionCopy,
    },
    emailSettings: {
      ...d.emailSettings,
      ...raw.emailSettings,
    },
  }
}

// ── Provider ──────────────────────────────────────────────────

type ProviderProps = {
  children: ReactNode
}

export function SiteContentProvider({ children }: ProviderProps) {
  const [content, setContent] = useState<SiteContent>(() => {
    const stored = loadStoredContent()
    if (stored) return normalizeLoaded(stored)
    return buildDefaultSiteContent()
  })
  const [isLoading, setIsLoading] = useState(false)

  const persistToSupabase = useCallback((next: SiteContent) => {
    void syncSiteContentSnapshot(next).catch((err) => {
      console.error('[content] Supabase sync failed', err)
    })
  }, [])

  useEffect(() => {
    setIsLoading(true)
    fetchSiteContent().then((remote) => {
      if (remote) {
        const normalized = overlayHomeSectionCopyFromLocalStorage(
          overlayHeroSlidesFromLocalStorage(
            overlayPageBannersFromLocalStorage(normalizeLoaded(remote)),
          ),
        )
        setContent(normalized)
        saveContentToStorage(normalized)
      }
      setIsLoading(false)
    })
  }, [])

  const replaceContent = useCallback((next: SiteContent) => {
    const n = normalizeLoaded(next)
    setContent(n)
    saveContentToStorage(n)
    persistToSupabase(n)
  }, [persistToSupabase])

  const updateContent = useCallback((updater: (prev: SiteContent) => SiteContent) => {
    setContent((prev) => {
      const next = updater(prev)
      saveContentToStorage(next)
      persistToSupabase(next)
      return next
    })
  }, [persistToSupabase])

  const saveToBrowser = useCallback(() => {
    setContent((c) => {
      saveContentToStorage(c)
      return c
    })
  }, [])

  const resetToBundledDefaults = useCallback(() => {
    clearStoredContent()
    window.location.reload()
  }, [])

  const exportJson = useCallback(() => {
    setContent((c) => {
      downloadJson(`bmg-site-content-${new Date().toISOString().slice(0, 10)}.json`, c)
      return c
    })
  }, [])

  const importJson = useCallback((json: string): { ok: true } | { ok: false; error: string } => {
    try {
      const parsed = JSON.parse(json) as unknown
      if (!parsed || typeof parsed !== 'object') return { ok: false, error: 'Geçersiz dosya.' }
      const next = normalizeLoaded(parsed as Partial<SiteContent>)
      setContent(next)
      saveContentToStorage(next)
      return { ok: true }
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : 'Okunamadı.' }
    }
  }, [])

  const hasCustomData = useMemo((): boolean => {
    try {
      return !!localStorage.getItem('bmg_site_content_v1')
    } catch {
      return false
    }
  }, [])

  const value = useMemo(
    (): SiteContentContextValue => ({
      content,
      replaceContent,
      updateContent,
      saveToBrowser,
      resetToBundledDefaults,
      exportJson,
      importJson,
      hasCustomData,
      isLoading,
    }),
    [content, replaceContent, updateContent, saveToBrowser, resetToBundledDefaults, exportJson, importJson, hasCustomData, isLoading],
  )

  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>
}

export function useSiteContent(): SiteContentContextValue {
  const ctx = useContext(SiteContentContext)
  if (!ctx) throw new Error('useSiteContent must be used within SiteContentProvider')
  return ctx
}
