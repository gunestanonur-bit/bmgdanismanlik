import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
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
import { HAS_SUPABASE_CONFIG } from '../lib/supabase'
import type { HeroSlide, SiteContent } from './types'

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
  const syncTimeoutRef = useRef<number | null>(null)
  const pendingContentRef = useRef<SiteContent | null>(null)

  const persistToSupabase = useCallback((next: SiteContent) => {
    if (!HAS_SUPABASE_CONFIG) return
    pendingContentRef.current = next
    if (syncTimeoutRef.current) {
      window.clearTimeout(syncTimeoutRef.current)
    }
    syncTimeoutRef.current = window.setTimeout(() => {
      const snapshot = pendingContentRef.current
      pendingContentRef.current = null
      syncTimeoutRef.current = null
      if (!snapshot) return
      void syncSiteContentSnapshot(snapshot).catch((err) => {
        console.error('[content] Supabase sync failed', err)
      })
    }, 550)
  }, [])

  useEffect(() => {
    return () => {
      if (syncTimeoutRef.current) {
        window.clearTimeout(syncTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    setIsLoading(true)
    const stored = loadStoredContent()
    fetchSiteContent().then((remote) => {
      if (remote) {
        const normalized = normalizeLoaded(remote)
        setContent(normalized)
        saveContentToStorage(normalized)
      } else if (stored) {
        // Fall back to browser cache only when remote read fails.
        const normalized = normalizeLoaded(stored)
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
      persistToSupabase(next)
      return { ok: true }
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : 'Okunamadı.' }
    }
  }, [persistToSupabase])

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
