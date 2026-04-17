import { Link } from 'react-router-dom'
import { FadeIn } from '../FadeIn'
import { SectionHeading } from '../SectionHeading'
import { useSiteContent } from '../../content/SiteContentContext'

export function ConsultingSection() {
  const { content } = useSiteContent()
  const { consultingServices } = content

  return (
    <section
      id="danismanlik"
      className="scroll-mt-24 rounded-[2.5rem] border border-slate-200/60 bg-slate-100/50 py-20 sm:py-24 lg:py-28"
      aria-labelledby="danismanlik-baslik"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeading
            id="danismanlik-baslik"
            eyebrow="Uzmanlık"
            title="Danışmanlık hizmetlerimiz"
          >
            <p className="mt-6 text-lg leading-relaxed text-slate-600">
              Aşağıdaki standartlarda sistem kurulumu, mevcut sistemin güçlendirilmesi ve sürekli iyileştirme danışmanlığı sunuyoruz. Her hizmet için ayrıntılı sayfalarımızı inceleyebilirsiniz.
            </p>
          </SectionHeading>
        </FadeIn>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {consultingServices.map((item, index) => (
            <FadeIn key={item.slug} delay={index * 0.06}>
              <article className="card-glow group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm ring-1 ring-slate-900/5 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-900/5">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary-600 via-primary-500 to-primary-400 opacity-90" aria-hidden />
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-bold leading-snug text-slate-900">
                    <Link to={`/danismanlik/${item.slug}`} className="transition hover:text-primary-800">
                      <span className="text-primary-700">{item.code}</span>
                      <span className="mt-1.5 block text-[15px] font-semibold text-slate-800">{item.title}</span>
                    </Link>
                  </h3>
                  <span className="rounded-2xl bg-slate-100 px-2.5 py-1 text-[11px] font-bold tabular-nums text-slate-500">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <p className="mt-4 flex-1 text-[15px] leading-relaxed text-slate-600">{item.summary}</p>
                <Link
                  to={`/danismanlik/${item.slug}`}
                  className="mt-5 text-sm font-semibold text-primary-700 transition group-hover:underline"
                >
                  Detaylı bilgi →
                </Link>
              </article>
            </FadeIn>
          ))}
        </div>

        <p className="mt-12 text-center">
          <Link
            to="/danismanlik"
            className="inline-flex items-center justify-center rounded-2xl border border-primary-200 bg-white px-8 py-3.5 text-sm font-semibold text-primary-800 shadow-sm transition hover:border-primary-300 hover:bg-primary-50"
          >
            Danışmanlık sayfasına git
          </Link>
        </p>
      </div>
    </section>
  )
}
