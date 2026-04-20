import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Header } from './Header'
import { Footer } from './Footer'
import { PageTransition } from './PageTransition'
import { useSiteContent } from '../content/SiteContentContext'

const RING_R = 18
const RING_C = 2 * Math.PI * RING_R

function ScrollToTopButton() {
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    function onScroll() {
      const scrollTop = window.scrollY
      setVisible(scrollTop > 450)
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setProgress(docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Sayfanın başına dön"
          className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white shadow-xl shadow-slate-900/25 ring-1 ring-white/10 transition hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 48 48" aria-hidden>
            <circle cx="24" cy="24" r={RING_R} fill="none" stroke="currentColor" strokeWidth="2.5" opacity="0.15" />
            <circle
              cx="24"
              cy="24"
              r={RING_R}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={RING_C}
              strokeDashoffset={RING_C * (1 - progress)}
              className="transition-[stroke-dashoffset] duration-100"
            />
          </svg>
          <svg className="relative h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  )
}

export function Layout() {
  const { pathname, hash } = useLocation()
  const { content } = useSiteContent()

  useEffect(() => {
    if (pathname === '/' && hash) return
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return (
    <>
      <Helmet>
        <link rel="icon" href={content.site.favicon || '/favicon.svg'} />
      </Helmet>
      <a
        href="#icerik"
        className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-2xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-900/20 transition focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-primary-300"
      >
        İçeriğe geç
      </a>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main id="icerik" className="flex-1">
          <AnimatePresence mode="wait">
            <PageTransition key={pathname}>
              <Outlet />
            </PageTransition>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
      <ScrollToTopButton />
    </>
  )
}
