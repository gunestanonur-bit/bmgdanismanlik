import { Link } from 'react-router-dom'
import { FadeIn } from '../FadeIn'
import { SectionHeading } from '../SectionHeading'
import { getSectoralHeroImage } from '../../content/selectors'
import { useSiteContent } from '../../content/SiteContentContext'

export function SectoralSection() {
  const { content } = useSiteContent()
  const { sectoralServices, sectoralHighlights } = content

  return (
    <section
      id="sektorel"
      className="scroll-mt-24 border-y border-slate-200/80 bg-gradient-to-b from-white via-slate-50/80 to-white py-20 sm:py-24 lg:py-28"
      aria-labelledby="sektorel-baslik"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-start lg:gap-16">
          <FadeIn>
            <SectionHeading
              id="sektorel-baslik"
              eyebrow="Sektör"
              title="Sektörel hizmetler"
            >
              <p className="mt-6 text-lg leading-relaxed text-slate-600">
                Havacılık, savunma, EYDEP ve tesis güvenliği gibi özel gereksinimlerde eğitim, danışmanlık ve analiz desteği sunuyoruz. Her hizmet için ayrıntılı sayfalarımızı inceleyebilirsiniz.
              </p>
            </SectionHeading>
            <ul className="mt-8 space-y-3">
              {sectoralHighlights.map((t) => (
                <li key={t} className="flex gap-3 rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3 text-[15px] text-slate-700">
                  <span className="mt-0.5 text-primary-600" aria-hidden>
                    ✓
                  </span>
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-8">
              <Link
                to="/sektorel"
                className="inline-flex rounded-2xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 transition hover:bg-primary-700"
              >
                Tüm sektörel hizmetler
              </Link>
            </p>
          </FadeIn>

          <FadeIn>
            <div className="grid gap-4 sm:grid-cols-1">
              {sectoralServices.map((item) => (
                <Link
                  key={item.slug}
                  to={`/sektorel/${item.slug}`}
                  className="group flex overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition hover:border-primary-200/80 hover:shadow-md"
                >
                  <div className="relative h-24 w-28 shrink-0 sm:w-32">
                    <img
                      src={getSectoralHeroImage(content, item.slug)}
                      alt=""
                      className="h-full w-full object-cover transition group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" aria-hidden />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col justify-center px-4 py-3">
                    <span className="text-xs font-bold text-primary-700">{item.code}</span>
                    <span className="mt-0.5 line-clamp-2 text-sm font-semibold leading-snug text-slate-900">{item.title}</span>
                    <span className="mt-1 text-xs font-medium text-primary-600">
                      Hizmet detayı →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
