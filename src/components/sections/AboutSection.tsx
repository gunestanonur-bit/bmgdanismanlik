import { Link } from 'react-router-dom'
import { FadeIn } from '../FadeIn'
import { SectionHeading } from '../SectionHeading'
import { formatAboutNamePlaceholder } from '../../content/aboutText'
import { useSiteContent } from '../../content/SiteContentContext'

export function AboutSection() {
  const { content } = useSiteContent()
  const { site, aboutPage: a } = content
  const mainText = formatAboutNamePlaceholder(a.mainParagraph, site.name)

  return (
    <section
      id="hakkimizda"
      className="scroll-mt-24 py-20 sm:py-24 lg:py-28"
      aria-labelledby="hakkimizda-baslik"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <FadeIn className="lg:col-span-7">
            <SectionHeading id="hakkimizda-baslik" eyebrow={a.heroEyebrow} title={a.heroTitle}>
              <p className="mt-6 whitespace-pre-line text-lg leading-relaxed text-slate-600">{mainText}</p>
            </SectionHeading>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2">
              {a.bullets.map((item) => (
                <li
                  key={item}
                  className="group flex gap-4 rounded-2xl border border-slate-200/80 bg-white/60 px-4 py-3.5 text-slate-700 shadow-sm transition hover:border-primary-200/80 hover:shadow-md"
                >
                  <span
                    className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary-600 text-[10px] font-bold text-white shadow-sm"
                    aria-hidden
                  >
                    ✓
                  </span>
                  <span className="text-[15px] leading-snug">{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-8">
              <Link
                to="/hakkimizda"
                className="inline-flex text-sm font-semibold text-primary-700 underline-offset-2 hover:underline"
              >
                Hakkımızda sayfasının tamamı →
              </Link>
            </p>
          </FadeIn>

          <FadeIn className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-primary-600/[0.08] via-slate-50 to-slate-100 p-8 shadow-xl shadow-slate-900/5">
              <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-primary-600/15 blur-2xl" aria-hidden />
              <p className="font-[family-name:var(--font-display)] text-xl font-bold leading-tight text-slate-900">{a.sideCardTitle}</p>
              <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600">{a.sideCardText}</p>
              <div className="mt-8 space-y-4 border-t border-slate-200/80 pt-8">
                {a.focusAreas.map((t) => (
                  <div key={t} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                    <span className="h-1 w-1 rounded-full bg-primary-600" aria-hidden />
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
