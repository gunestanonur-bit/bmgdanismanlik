import { Link } from 'react-router-dom'
import { FadeIn } from '../FadeIn'
import { SectionHeading } from '../SectionHeading'
import { getTrainingHeroImage } from '../../content/selectors'
import { useSiteContent } from '../../content/SiteContentContext'

export function TrainingSection() {
  const { content } = useSiteContent()
  const { trainingServices, trainingHighlights } = content

  return (
    <section id="egitim" className="scroll-mt-24 py-20 sm:py-24 lg:py-28" aria-labelledby="egitim-baslik">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-start lg:gap-16">
          <FadeIn>
            <SectionHeading
              id="egitim-baslik"
              eyebrow="Kapasite"
              title="Eğitim hizmetlerimiz"
            >
              <p className="mt-6 text-lg leading-relaxed text-slate-600">
                Yönetim sistemi farkındalığından iç tetkire kadar ekiplerinizin yetkinliğini artıran eğitimler planlıyoruz. ISO ve sektörel programların tamamı için ayrıntılı sayfalarımızı inceleyebilirsiniz.
              </p>
            </SectionHeading>
            <ul className="mt-8 space-y-3">
              {trainingHighlights.map((t) => (
                <li key={t} className="flex gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3 text-[15px] text-slate-700">
                  <span className="mt-0.5 text-primary-600" aria-hidden>
                    ✓
                  </span>
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-8">
              <Link
                to="/egitim"
                className="inline-flex rounded-2xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 transition hover:bg-primary-700"
              >
                Tüm eğitim programları
              </Link>
            </p>
          </FadeIn>

          <FadeIn>
            <div className="grid gap-4 sm:grid-cols-1">
              {trainingServices.slice(0, 4).map((item) => (
                <Link
                  key={item.slug}
                  to={`/egitim/${item.slug}`}
                  className="group flex overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition hover:border-primary-200/80 hover:shadow-md"
                >
                  <div className="relative h-24 w-28 shrink-0 sm:w-32">
                    <img
                      src={getTrainingHeroImage(content, item.slug)}
                      alt=""
                      className="h-full w-full object-cover transition group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" aria-hidden />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col justify-center px-4 py-3">
                    <span className="text-xs font-bold text-primary-700">{item.code}</span>
                    <span className="mt-0.5 line-clamp-2 text-sm font-semibold leading-snug text-slate-900">{item.title}</span>
                    <span className="mt-1 text-xs font-medium text-primary-600">
                      Program detayı →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            {trainingServices.length > 4 && (
              <p className="mt-4 text-center sm:text-left">
                <Link to="/egitim" className="text-sm font-semibold text-primary-700 hover:underline">
                  +{trainingServices.length - 4} program daha…
                </Link>
              </p>
            )}
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
