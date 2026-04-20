import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import type { HeroSlide } from '../content/types'

const AUTO_MS = 6500

/** When src is cleared in admin; keeps layout valid — exported for OG / SEO */
export const HERO_SLIDE_IMAGE_FALLBACK =
  'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1920&q=85'

type HeroSliderProps = {
  slides: readonly HeroSlide[]
  onIndexChange?: (index: number) => void
}

export function HeroSlider({ slides, onIndexChange }: HeroSliderProps) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduce = useReducedMotion()
  const touchStartX = useRef<number | null>(null)

  const go = useCallback(
    (delta: number) => {
      if (slides.length < 1) return
      setIndex((i) => (i + delta + slides.length) % slides.length)
    },
    [slides.length],
  )

  useEffect(() => {
    if (!slides.length) return
    setIndex((i) => Math.min(i, slides.length - 1))
  }, [slides.length])

  useEffect(() => {
    if (reduce || paused || slides.length < 1) return
    const t = window.setInterval(() => go(1), AUTO_MS)
    return () => window.clearInterval(t)
  }, [go, reduce, paused, slides.length])

  useEffect(() => {
    onIndexChange?.(index)
  }, [index, onIndexChange])

  if (slides.length < 1) {
    return (
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        <img
          src={HERO_SLIDE_IMAGE_FALLBACK}
          alt=""
          className="h-full w-full object-cover object-center"
          decoding="async"
          fetchPriority="high"
          sizes="100vw"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1a0a0c]/95 via-[#70151C]/35 to-black/25" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/30" />
      </div>
    )
  }

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      role="region"
      aria-roledescription="carousel"
      aria-label="Öne çıkan görseller"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0]?.clientX ?? null
      }}
      onTouchEnd={(e) => {
        const start = touchStartX.current
        touchStartX.current = null
        if (start == null) return
        const end = e.changedTouches[0]?.clientX
        if (end == null) return
        const dx = end - start
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1)
      }}
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={slides[index].id}
          className="absolute inset-0"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduce ? undefined : { opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            src={slides[index].src?.trim() || HERO_SLIDE_IMAGE_FALLBACK}
            alt={slides[index].alt}
            className="h-full w-full object-cover object-center"
            decoding="async"
            fetchPriority={index === 0 ? 'high' : 'low'}
            sizes="100vw"
          />
        </motion.div>
      </AnimatePresence>

      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1a0a0c]/95 via-[#70151C]/35 to-black/25"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/30" aria-hidden />

      <div className="absolute bottom-7 left-0 right-0 z-10 flex flex-col items-center gap-4 px-4 sm:bottom-10">
        <div className="flex items-center gap-2 rounded-full border border-white/15 bg-black/25 px-3 py-2 backdrop-blur-md" role="tablist" aria-label="Slayt seçimi">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Slayt ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-500 ease-out ${
                i === index ? 'w-10 bg-white shadow-[0_0_20px_rgba(255,255,255,0.45)]' : 'w-1.5 bg-white/35 hover:bg-white/65'
              }`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </div>

      <button
        type="button"
        aria-label="Önceki slayt"
        className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-2xl border border-white/25 bg-white/10 p-3 text-white shadow-lg backdrop-blur-md transition hover:bg-white/20 sm:left-5"
        onClick={() => go(-1)}
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Sonraki slayt"
        className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-2xl border border-white/25 bg-white/10 p-3 text-white shadow-lg backdrop-blur-md transition hover:bg-white/20 sm:right-5"
        onClick={() => go(1)}
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}
