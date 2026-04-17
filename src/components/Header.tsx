import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import type { NavItem } from '../content/types'
import { useSiteContent } from '../content/SiteContentContext'

function scrollToHash(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function desktopNavLabel(item: NavItem): string {
  return 'labelShort' in item && item.labelShort ? item.labelShort : item.label
}

function isHashActive(hashId: string, pathname: string, hash: string) {
  const onHome = pathname === '/'
  return onHome && hash === `#${hashId}`
}

function isRouteActive(trPrefix: string, pathname: string) {
  return pathname === trPrefix || pathname.startsWith(`${trPrefix}/`)
}

function navPillClass(active: boolean) {
  return active
    ? 'bg-white text-primary-800 shadow-sm ring-1 ring-primary-200/70'
    : 'text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm'
}

export function Header() {
  const { content } = useSiteContent()
  const { site, navItems, consultingServices, trainingServices, sectoralServices } = content
  const location = useLocation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [ddOpen, setDdOpen] = useState(false)
  const [trainingDdOpen, setTrainingDdOpen] = useState(false)
  const [sectorDdOpen, setSectorDdOpen] = useState(false)
  const [mobileConsultingOpen, setMobileConsultingOpen] = useState(false)
  const [mobileTrainingOpen, setMobileTrainingOpen] = useState(false)
  const [mobileSectorOpen, setMobileSectorOpen] = useState(false)
  const ddRef = useRef<HTMLDivElement>(null)
  const trainingDdRef = useRef<HTMLDivElement>(null)
  const sectorDdRef = useRef<HTMLDivElement>(null)
  const headerRowRef = useRef<HTMLDivElement>(null)

  const { pathname, hash } = location
  const isHome = pathname === '/'

  useLayoutEffect(() => {
    const el = headerRowRef.current
    if (!el) return
    const set = () => {
      document.documentElement.style.setProperty('--header-h', `${el.offsetHeight}px`)
    }
    set()
    const ro = new ResizeObserver(set)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    function handle(e: MouseEvent) {
      const t = e.target as Node
      if (ddRef.current && !ddRef.current.contains(t)) setDdOpen(false)
      if (trainingDdRef.current && !trainingDdRef.current.contains(t)) setTrainingDdOpen(false)
      if (sectorDdRef.current && !sectorDdRef.current.contains(t)) setSectorDdOpen(false)
    }
    if (ddOpen || trainingDdOpen || sectorDdOpen) document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [ddOpen, trainingDdOpen, sectorDdOpen])

  useEffect(() => {
    setDdOpen(false)
    setTrainingDdOpen(false)
    setSectorDdOpen(false)
    setOpen(false)
    setMobileConsultingOpen(false)
    setMobileTrainingOpen(false)
    setMobileSectorOpen(false)
  }, [pathname])

  const headerSurface = open
    ? 'border-b border-slate-200/80 bg-white shadow-md'
    : scrolled
      ? 'border-b border-slate-200/60 bg-white/90 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.12)] backdrop-blur-xl'
      : 'border-b border-transparent bg-white/50 backdrop-blur-md'

  const dropdownPanel =
    'absolute left-0 top-full z-[60] mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xl shadow-slate-900/[0.08] ring-1 ring-slate-900/[0.04]'

  return (
    <header className={`sticky top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300 ${headerSurface}`}>
      <div
        ref={headerRowRef}
        className="relative z-[60] mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-6 lg:px-8"
      >
        <Link
          to="/"
          className="group flex min-w-0 flex-1 items-center gap-2.5 font-[family-name:var(--font-display)] text-base font-bold tracking-tight text-slate-900 sm:gap-3 sm:text-lg"
        >
          {site.logo ? (
            <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-lg shadow-slate-900/10 ring-1 ring-slate-200/80 transition duration-300 group-hover:scale-[1.02] group-hover:shadow-xl">
              <img src={site.logo} alt={`${site.name} logosu`} className="h-full w-full object-contain p-1" />
            </span>
          ) : (
            <span className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-primary-700 to-slate-900 text-base font-bold text-white shadow-lg shadow-primary-900/25 ring-1 ring-white/20 transition duration-300 group-hover:scale-[1.02] group-hover:shadow-xl">
              B
            </span>
          )}
        </Link>

        <nav
          className="relative hidden min-w-0 items-center gap-0.5 overflow-visible rounded-full border border-slate-200/70 bg-slate-50/95 p-1 shadow-inner lg:flex"
          aria-label="Ana menü"
        >
          {navItems.map((item) => {
            if (item.id === 'danismanlik') {
              const active = ddOpen || isRouteActive('/danismanlik', pathname)
              return (
                <div key={item.id} className="relative" ref={ddRef}>
                  <button
                    type="button"
                    className={`flex max-w-[11rem] items-center gap-1 rounded-full px-2.5 py-2 text-left text-[13px] font-semibold transition xl:max-w-none xl:px-3 ${navPillClass(active)}`}
                    title={item.label}
                    aria-expanded={ddOpen}
                    aria-haspopup="true"
                    aria-current={isRouteActive('/danismanlik', pathname) ? 'page' : undefined}
                    data-open={ddOpen}
                    onClick={() => {
                      setDdOpen((v) => !v)
                      setTrainingDdOpen(false)
                      setSectorDdOpen(false)
                    }}
                  >
                    <span className="truncate">{desktopNavLabel(item)}</span>
                    <svg
                      className={`h-3.5 w-3.5 shrink-0 opacity-70 transition ${ddOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <AnimatePresence>
                    {ddOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 4, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className={dropdownPanel}
                        role="menu"
                      >
                        <div className="border-b border-slate-100 bg-slate-50/80 px-2 py-2">
                          <Link
                            to="/danismanlik"
                            role="menuitem"
                            className="block rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 outline-none ring-primary-600/30 transition hover:bg-white focus-visible:ring-2"
                            onClick={() => setDdOpen(false)}
                          >
                            Genel bakış
                          </Link>
                        </div>
                        <div className="max-h-[min(24rem,60vh)] overflow-y-auto overscroll-contain p-2 pr-1">
                          {consultingServices.map((s) => (
                            <Link
                              key={s.slug}
                              to={`/danismanlik/${s.slug}`}
                              role="menuitem"
                              className="block rounded-xl px-3 py-2.5 text-left text-sm outline-none ring-primary-600/30 transition hover:bg-slate-50 focus-visible:ring-2"
                              onClick={() => setDdOpen(false)}
                            >
                              <span className="font-semibold text-primary-700">{s.code}</span>
                              <span className="mt-0.5 block text-[13px] leading-snug text-slate-600">{s.title}</span>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            }

            if (item.id === 'egitim') {
              const active = trainingDdOpen || isRouteActive('/egitim', pathname)
              return (
                <div key={item.id} className="relative" ref={trainingDdRef}>
                  <button
                    type="button"
                    className={`flex max-w-[9rem] items-center gap-1 rounded-full px-2.5 py-2 text-left text-[13px] font-semibold transition xl:max-w-none xl:px-3 ${navPillClass(active)}`}
                    title={item.label}
                    aria-expanded={trainingDdOpen}
                    aria-haspopup="true"
                    aria-current={isRouteActive('/egitim', pathname) ? 'page' : undefined}
                    data-open={trainingDdOpen}
                    onClick={() => {
                      setTrainingDdOpen((v) => !v)
                      setDdOpen(false)
                      setSectorDdOpen(false)
                    }}
                  >
                    <span className="truncate">{desktopNavLabel(item)}</span>
                    <svg
                      className={`h-3.5 w-3.5 shrink-0 opacity-70 transition ${trainingDdOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <AnimatePresence>
                    {trainingDdOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 4, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className={dropdownPanel}
                        role="menu"
                      >
                        <div className="border-b border-slate-100 bg-slate-50/80 px-2 py-2">
                          <Link
                            to="/egitim"
                            role="menuitem"
                            className="block rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 outline-none ring-primary-600/30 transition hover:bg-white focus-visible:ring-2"
                            onClick={() => setTrainingDdOpen(false)}
                          >
                            Genel bakış
                          </Link>
                        </div>
                        <div className="max-h-[min(24rem,60vh)] overflow-y-auto overscroll-contain p-2 pr-1">
                          {trainingServices.map((s) => (
                            <Link
                              key={s.slug}
                              to={`/egitim/${s.slug}`}
                              role="menuitem"
                              className="block rounded-xl px-3 py-2.5 text-left text-sm outline-none ring-primary-600/30 transition hover:bg-slate-50 focus-visible:ring-2"
                              onClick={() => setTrainingDdOpen(false)}
                            >
                              <span className="font-semibold text-primary-700">{s.code}</span>
                              <span className="mt-0.5 block text-[13px] leading-snug text-slate-600">{s.title}</span>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            }

            if (item.id === 'sektorel') {
              const active = sectorDdOpen || isRouteActive('/sektorel', pathname)
              return (
                <div key={item.id} className="relative" ref={sectorDdRef}>
                  <button
                    type="button"
                    className={`flex max-w-[9rem] items-center gap-1 rounded-full px-2.5 py-2 text-left text-[13px] font-semibold transition xl:max-w-none xl:px-3 ${navPillClass(active)}`}
                    title={item.label}
                    aria-expanded={sectorDdOpen}
                    aria-haspopup="true"
                    aria-current={isRouteActive('/sektorel', pathname) ? 'page' : undefined}
                    data-open={sectorDdOpen}
                    onClick={() => {
                      setSectorDdOpen((v) => !v)
                      setDdOpen(false)
                      setTrainingDdOpen(false)
                    }}
                  >
                    <span className="truncate">{desktopNavLabel(item)}</span>
                    <svg
                      className={`h-3.5 w-3.5 shrink-0 opacity-70 transition ${sectorDdOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <AnimatePresence>
                    {sectorDdOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 4, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className={dropdownPanel}
                        role="menu"
                      >
                        <div className="border-b border-slate-100 bg-slate-50/80 px-2 py-2">
                          <Link
                            to="/sektorel"
                            role="menuitem"
                            className="block rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 outline-none ring-primary-600/30 transition hover:bg-white focus-visible:ring-2"
                            onClick={() => setSectorDdOpen(false)}
                          >
                            Genel bakış
                          </Link>
                        </div>
                        <div className="max-h-[min(24rem,60vh)] overflow-y-auto overscroll-contain p-2 pr-1">
                          {sectoralServices.map((s) => (
                            <Link
                              key={s.slug}
                              to={`/sektorel/${s.slug}`}
                              role="menuitem"
                              className="block rounded-xl px-3 py-2.5 text-left text-sm outline-none ring-primary-600/30 transition hover:bg-slate-50 focus-visible:ring-2"
                              onClick={() => setSectorDdOpen(false)}
                            >
                              <span className="font-semibold text-primary-700">{s.code}</span>
                              <span className="mt-0.5 block text-[13px] leading-snug text-slate-600">{s.title}</span>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            }

            if (item.id === 'hakkimizda') {
              const active = isRouteActive('/hakkimizda', pathname)
              return (
                <Link
                  key={item.id}
                  to="/hakkimizda"
                  className={`rounded-full px-2.5 py-2 text-[13px] font-semibold transition xl:px-3 ${navPillClass(active)}`}
                  title={item.label}
                  aria-current={active ? 'page' : undefined}
                >
                  {desktopNavLabel(item)}
                </Link>
              )
            }

            if (item.id === 'iletisim') {
              const active = isRouteActive('/iletisim', pathname)
              return (
                <Link
                  key={item.id}
                  to="/iletisim"
                  className={`rounded-full px-2.5 py-2 text-[13px] font-semibold transition xl:px-3 ${navPillClass(active)}`}
                  title={item.label}
                  aria-current={active ? 'page' : undefined}
                >
                  {desktopNavLabel(item)}
                </Link>
              )
            }

            const hashActive = isHashActive(item.id, pathname, hash)
            return (
              <a
                key={item.id}
                href={`/#${item.id}`}
                className={`rounded-full px-2.5 py-2 text-[13px] font-semibold transition xl:px-3 ${navPillClass(hashActive)}`}
                title={item.label}
                aria-current={hashActive ? 'page' : undefined}
                onClick={(e) => {
                  e.preventDefault()
                  if (isHome) scrollToHash(item.id)
                  else navigate({ pathname: '/', hash: `#${item.id}` })
                }}
              >
                {desktopNavLabel(item)}
              </a>
            )
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200/90 bg-white text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600/40 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Menüyü kapat' : 'Menüyü aç'}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menü</span>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[45] cursor-default bg-slate-900/45 backdrop-blur-[2px] lg:hidden"
              aria-label="Menüyü kapat"
              onClick={() => setOpen(false)}
            />
            <motion.div
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Mobil menü"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="fixed left-0 right-0 z-[48] flex max-h-[min(100dvh,var(--header-h)+70vh)] flex-col overflow-hidden border-b border-slate-200/80 bg-white shadow-2xl shadow-slate-900/15 lg:hidden"
              style={{ top: 'var(--header-h, 4.5rem)' }}
            >
              <nav
                className="flex max-h-[min(calc(100dvh-var(--header-h,4.5rem)-1px),32rem)] flex-col gap-1.5 overflow-y-auto overscroll-contain px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
                aria-label="Mobil menü"
              >
                {navItems.map((item) => {
                  if (item.id === 'danismanlik') {
                    return (
                      <div
                        key={item.id}
                        className="rounded-2xl border border-slate-200/80 bg-gradient-to-b from-slate-50/90 to-white p-1 shadow-sm"
                      >
                        <button
                          type="button"
                          className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-[15px] font-semibold text-slate-900 outline-none ring-primary-600/30 focus-visible:ring-2"
                          aria-expanded={mobileConsultingOpen}
                          onClick={() => {
                            setMobileConsultingOpen((v) => !v)
                            setMobileTrainingOpen(false)
                            setMobileSectorOpen(false)
                          }}
                        >
                          <span className="pr-2">{item.label}</span>
                          <svg
                            className={`h-5 w-5 shrink-0 text-slate-400 transition ${mobileConsultingOpen ? 'rotate-180' : ''}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        <AnimatePresence>
                          {mobileConsultingOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="mt-1 flex flex-col gap-0.5 border-t border-slate-200/80 pt-2">
                                <Link
                                  to="/danismanlik"
                                  className="rounded-xl px-3 py-2.5 text-sm font-semibold text-primary-800 transition hover:bg-white"
                                  onClick={() => setOpen(false)}
                                >
                                  Tüm danışmanlık hizmetleri
                                </Link>
                                {consultingServices.map((s) => (
                                  <Link
                                    key={s.slug}
                                    to={`/danismanlik/${s.slug}`}
                                    className="rounded-xl px-3 py-2.5 text-sm text-slate-700 transition hover:bg-white"
                                    onClick={() => setOpen(false)}
                                  >
                                    <span className="font-semibold text-primary-700">{s.code}</span>
                                    <span className="mt-0.5 block text-xs leading-snug text-slate-500">{s.title}</span>
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )
                  }

                  if (item.id === 'egitim') {
                    return (
                      <div
                        key={item.id}
                        className="rounded-2xl border border-slate-200/80 bg-gradient-to-b from-slate-50/90 to-white p-1 shadow-sm"
                      >
                        <button
                          type="button"
                          className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-[15px] font-semibold text-slate-900 outline-none ring-primary-600/30 focus-visible:ring-2"
                          aria-expanded={mobileTrainingOpen}
                          onClick={() => {
                            setMobileTrainingOpen((v) => !v)
                            setMobileConsultingOpen(false)
                            setMobileSectorOpen(false)
                          }}
                        >
                          <span className="pr-2">{item.label}</span>
                          <svg
                            className={`h-5 w-5 shrink-0 text-slate-400 transition ${mobileTrainingOpen ? 'rotate-180' : ''}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        <AnimatePresence>
                          {mobileTrainingOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="mt-1 flex flex-col gap-0.5 border-t border-slate-200/80 pt-2">
                                <Link
                                  to="/egitim"
                                  className="rounded-xl px-3 py-2.5 text-sm font-semibold text-primary-800 transition hover:bg-white"
                                  onClick={() => setOpen(false)}
                                >
                                  Tüm eğitim programları
                                </Link>
                                {trainingServices.map((s) => (
                                  <Link
                                    key={s.slug}
                                    to={`/egitim/${s.slug}`}
                                    className="rounded-xl px-3 py-2.5 text-sm text-slate-700 transition hover:bg-white"
                                    onClick={() => setOpen(false)}
                                  >
                                    <span className="font-semibold text-primary-700">{s.code}</span>
                                    <span className="mt-0.5 block text-xs leading-snug text-slate-500">{s.title}</span>
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )
                  }

                  if (item.id === 'sektorel') {
                    return (
                      <div
                        key={item.id}
                        className="rounded-2xl border border-slate-200/80 bg-gradient-to-b from-slate-50/90 to-white p-1 shadow-sm"
                      >
                        <button
                          type="button"
                          className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-[15px] font-semibold text-slate-900 outline-none ring-primary-600/30 focus-visible:ring-2"
                          aria-expanded={mobileSectorOpen}
                          onClick={() => {
                            setMobileSectorOpen((v) => !v)
                            setMobileConsultingOpen(false)
                            setMobileTrainingOpen(false)
                          }}
                        >
                          <span className="pr-2">{item.label}</span>
                          <svg
                            className={`h-5 w-5 shrink-0 text-slate-400 transition ${mobileSectorOpen ? 'rotate-180' : ''}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        <AnimatePresence>
                          {mobileSectorOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="mt-1 flex flex-col gap-0.5 border-t border-slate-200/80 pt-2">
                                <Link
                                  to="/sektorel"
                                  className="rounded-xl px-3 py-2.5 text-sm font-semibold text-primary-800 transition hover:bg-white"
                                  onClick={() => setOpen(false)}
                                >
                                  Tüm sektörel hizmetler
                                </Link>
                                {sectoralServices.map((s) => (
                                  <Link
                                    key={s.slug}
                                    to={`/sektorel/${s.slug}`}
                                    className="rounded-xl px-3 py-2.5 text-sm text-slate-700 transition hover:bg-white"
                                    onClick={() => setOpen(false)}
                                  >
                                    <span className="font-semibold text-primary-700">{s.code}</span>
                                    <span className="mt-0.5 block text-xs leading-snug text-slate-500">{s.title}</span>
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )
                  }

                  if (item.id === 'hakkimizda') {
                    const active = pathname === '/hakkimizda'
                    return (
                      <Link
                        key={item.id}
                        to="/hakkimizda"
                        className={`rounded-2xl px-4 py-3.5 text-[15px] font-semibold outline-none ring-primary-600/30 transition focus-visible:ring-2 ${
                          active ? 'bg-primary-50 text-primary-900 ring-1 ring-primary-200/80' : 'text-slate-800 hover:bg-slate-50'
                        }`}
                        aria-current={active ? 'page' : undefined}
                        onClick={() => setOpen(false)}
                      >
                        {item.label}
                      </Link>
                    )
                  }

                  if (item.id === 'iletisim') {
                    const active = pathname === '/iletisim'
                    return (
                      <Link
                        key={item.id}
                        to="/iletisim"
                        className={`rounded-2xl px-4 py-3.5 text-[15px] font-semibold outline-none ring-primary-600/30 transition focus-visible:ring-2 ${
                          active ? 'bg-primary-50 text-primary-900 ring-1 ring-primary-200/80' : 'text-slate-800 hover:bg-slate-50'
                        }`}
                        aria-current={active ? 'page' : undefined}
                        onClick={() => setOpen(false)}
                      >
                        {item.label}
                      </Link>
                    )
                  }

                  const hashActive = isHashActive(item.id, pathname, hash)
                  return (
                    <a
                      key={item.id}
                      href={`/#${item.id}`}
                      className={`rounded-2xl px-4 py-3.5 text-[15px] font-semibold outline-none ring-primary-600/30 transition focus-visible:ring-2 ${
                        hashActive ? 'bg-primary-50 text-primary-900 ring-1 ring-primary-200/80' : 'text-slate-800 hover:bg-slate-50'
                      }`}
                      aria-current={hashActive ? 'page' : undefined}
                      onClick={(e) => {
                        e.preventDefault()
                        setOpen(false)
                        if (isHome) scrollToHash(item.id)
                        else navigate({ pathname: '/', hash: `#${item.id}` })
                      }}
                    >
                      {item.label}
                    </a>
                  )
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
