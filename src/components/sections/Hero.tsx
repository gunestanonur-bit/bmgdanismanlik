import { useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { AnimatedCounter } from '../AnimatedCounter'
import { HeroSlider } from '../HeroSlider'
import { useSiteContent } from '../../content/SiteContentContext'

export function Hero() {
  const { content } = useSiteContent()
  const { site, heroSlides, heroStats } = content
  const reduce = useReducedMotion()
  const [activeSlideIndex, setActiveSlideIndex] = useState(0)

  const activeSlide = useMemo(() => {
    if (!heroSlides.length) return null
    return heroSlides[activeSlideIndex] ?? heroSlides[0]
  }, [heroSlides, activeSlideIndex])

  const heroTitle = activeSlide?.title?.trim() || activeSlide?.alt?.trim() || site.tagline
  const heroDescription = activeSlide?.description?.trim() || site.description

  return (
    <section className="relative" aria-labelledby="hero-baslik">
      <div className="relative min-h-[min(90vh,58rem)] w-full overflow-hidden">
        <HeroSlider slides={heroSlides} onIndexChange={setActiveSlideIndex} />

        <div className="relative z-20 mx-auto flex min-h-[min(90vh,58rem)] max-w-6xl flex-col justify-center px-4 pb-32 pt-28 sm:px-6 sm:pb-36 sm:pt-32 lg:px-8 lg:pb-40 lg:pt-36">
          <div className="max-w-3xl">
            <motion.div
              initial={reduce ? undefined : { opacity: 0, y: 10 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/95 backdrop-blur-md"
            >
              <span className="h-1.5 w-1.5 motion-safe:animate-pulse rounded-full bg-emerald-400" aria-hidden />
              Yönetim sistemi danışmanlığı
            </motion.div>

            <motion.h1
              id="hero-baslik"
              className="mt-6 font-[family-name:var(--font-display)] text-balance text-4xl font-extrabold leading-[1.08] tracking-tight text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.35)] sm:text-5xl lg:text-6xl xl:text-[3.5rem]"
              initial={reduce ? undefined : { opacity: 0, y: 20 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.05 }}
            >
              {heroTitle}
            </motion.h1>
            <motion.p
              className="mt-6 max-w-2xl text-lg leading-relaxed text-white/88 sm:text-xl"
              initial={reduce ? undefined : { opacity: 0, y: 18 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {heroDescription}
            </motion.p>
            <motion.div
              className="mt-11 flex flex-wrap gap-4"
              initial={reduce ? undefined : { opacity: 0, y: 18 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.16 }}
            >
              <Link
                to="/danismanlik"
                className="group inline-flex items-center justify-center rounded-2xl bg-primary-600 px-8 py-3.5 text-sm font-semibold text-white shadow-[0_12px_40px_-12px_rgba(112,21,28,0.55)] transition hover:bg-primary-700 hover:shadow-[0_16px_44px_-12px_rgba(112,21,28,0.65)]"
              >
                Danışmanlık hizmetleri
                <span className="ml-2 inline-block transition group-hover:translate-x-0.5" aria-hidden>
                  →
                </span>
              </Link>
              <Link
                to="/iletisim"
                className="inline-flex items-center justify-center rounded-2xl border border-white/35 bg-white/12 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition hover:border-white/55 hover:bg-white/20"
              >
                Bize ulaşın
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="relative z-30 -mt-8 px-4 pb-4 sm:-mt-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <dl className="glass-panel grid gap-3 rounded-3xl p-5 sm:grid-cols-3 sm:gap-4 sm:p-8">
            {heroStats.map((row) => (
              <div
                key={row.label}
                className="relative rounded-2xl border border-slate-200/60 bg-gradient-to-br from-white to-slate-50/80 px-4 py-3 shadow-sm sm:px-5 sm:py-4"
              >
                <dt className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">{row.label}</dt>
                <dd className="mt-2 font-[family-name:var(--font-display)] text-lg font-bold text-slate-900">
                  <AnimatedCounter value={row.value} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
