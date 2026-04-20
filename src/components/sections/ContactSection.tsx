import { type FormEvent, useState } from 'react'
import { CopyTextButton } from '../CopyTextButton'
import { FadeIn } from '../FadeIn'
import { SectionHeading } from '../SectionHeading'
import { useSiteContent } from '../../content/SiteContentContext'

export function ContactInfoBlock() {
  const { content } = useSiteContent()
  const { site, homeSectionCopy: h } = content
  const telHref = site.phone.replace(/[^\d+]/g, '')

  return (
    <>
      <SectionHeading id="iletisim-baslik" eyebrow={h.contactEyebrow} title={h.contactTitle}>
        <p className="mt-6 text-lg leading-relaxed text-slate-600">{h.contactIntro}</p>
      </SectionHeading>
      <dl className="mt-10 space-y-5 text-slate-700">
        <div className="rounded-2xl border border-slate-200/60 bg-white/80 px-4 py-3">
          <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            E-posta
          </dt>
          <dd className="mt-1 flex flex-wrap items-center gap-2">
            <a href={`mailto:${site.email}`} className="min-w-0 flex-1 font-semibold text-primary-700 hover:underline">
              {site.email}
            </a>
            <CopyTextButton
              text={site.email}
              label="E-postayı kopyala"
              copiedMessage="E-posta kopyalandı"
              copyFailedMessage="Kopyalanamadı"
            />
          </dd>
        </div>
        <div className="rounded-2xl border border-slate-200/60 bg-white/80 px-4 py-3">
          <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Telefon
          </dt>
          <dd className="mt-1 flex flex-wrap items-center gap-2">
            <a href={`tel:${telHref}`} className="min-w-0 flex-1 font-semibold text-slate-900 hover:text-primary-700">
              {site.phone}
            </a>
            <CopyTextButton
              text={telHref}
              label="Telefonu kopyala"
              copiedMessage="Telefon kopyalandı"
              copyFailedMessage="Kopyalanamadı"
            />
          </dd>
        </div>
        <div className="rounded-2xl border border-slate-200/60 bg-white/80 px-4 py-3">
          <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Konum
          </dt>
          <dd className="mt-1">{site.address}</dd>
        </div>
      </dl>
    </>
  )
}

type FormErrors = { ad?: string; email?: string; mesaj?: string }

const inputBase =
  'mt-2 w-full rounded-2xl border bg-slate-50/80 px-4 py-4 text-base text-slate-900 outline-none transition focus:bg-white focus:ring-4 sm:py-3.5 sm:text-sm'

export function ContactFormBlock() {
  const { content } = useSiteContent()
  const [errors, setErrors] = useState<FormErrors>({})
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')

  function validate(data: FormData): FormErrors {
    const errs: FormErrors = {}
    const ad = (data.get('ad') as string | null)?.trim() ?? ''
    const email = (data.get('email') as string | null)?.trim() ?? ''
    const mesaj = (data.get('mesaj') as string | null)?.trim() ?? ''

    if (!ad) errs.ad = 'Ad Soyad zorunludur.'
    if (!email) errs.email = 'E-posta zorunludur.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = 'Geçerli bir e-posta adresi girin.'
    if (!mesaj) errs.mesaj = 'Mesajınızı yazın.'
    else if (mesaj.length < 10)
      errs.mesaj = 'Mesajınız en az 10 karakter olmalıdır.'

    return errs
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const errs = validate(data)
    setErrors(errs)
    setSubmitError('')
    if (Object.keys(errs).length > 0) return

    setLoading(true)
    try {
      const payload = {
        ad: String(data.get('ad') ?? '').trim(),
        email: String(data.get('email') ?? '').trim(),
        telefon: String(data.get('telefon') ?? '').trim(),
        konu: String(data.get('konu') ?? '').trim(),
        mesaj: String(data.get('mesaj') ?? '').trim(),
        recipientEmail: content.emailSettings.recipientEmail,
        fromName: content.emailSettings.fromName,
        subjectPrefix: content.emailSettings.subjectPrefix,
      }

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const parsed = (await res.json().catch(() => null)) as { error?: string } | null
        throw new Error(parsed?.error ?? 'Mesaj gonderilemedi.')
      }

      setSent(true)
      e.currentTarget.reset()
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Mesaj gonderilemedi.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="flex min-h-[18rem] flex-col items-center justify-center rounded-3xl border border-emerald-200/80 bg-emerald-50/60 p-8 text-center shadow-2xl shadow-slate-900/5">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>
        <h3 className="mt-4 font-[family-name:var(--font-display)] text-lg font-bold text-slate-900">
          Mesajınız iletildi
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          {content.emailSettings.successMessage}
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-2xl shadow-slate-900/10 backdrop-blur-sm sm:p-8"
    >
      <div className="grid gap-5">
        <div>
          <label htmlFor="ad" className="text-sm font-semibold text-slate-800">
            Ad Soyad
          </label>
          <input
            id="ad"
            name="ad"
            type="text"
            autoComplete="name"
            aria-describedby={errors.ad ? 'ad-error' : undefined}
            aria-invalid={!!errors.ad}
            className={`${inputBase} ${errors.ad ? 'border-red-400 focus:border-red-400 focus:ring-red-600/15' : 'border-slate-200 focus:border-primary-400 focus:ring-primary-600/15'}`}
          />
          {errors.ad && (
            <p id="ad-error" className="mt-1.5 text-xs font-medium text-red-600" role="alert">
              {errors.ad}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="text-sm font-semibold text-slate-800">
            E-posta
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            aria-describedby={errors.email ? 'email-error' : undefined}
            aria-invalid={!!errors.email}
            className={`${inputBase} ${errors.email ? 'border-red-400 focus:border-red-400 focus:ring-red-600/15' : 'border-slate-200 focus:border-primary-400 focus:ring-primary-600/15'}`}
          />
          {errors.email && (
            <p id="email-error" className="mt-1.5 text-xs font-medium text-red-600" role="alert">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="telefon" className="text-sm font-semibold text-slate-800">
            Telefon (istege bagli)
          </label>
          <input
            id="telefon"
            name="telefon"
            type="tel"
            autoComplete="tel"
            className={`${inputBase} border-slate-200 focus:border-primary-400 focus:ring-primary-600/15`}
          />
        </div>

        <div>
          <label htmlFor="konu" className="text-sm font-semibold text-slate-800">
            Konu (istege bagli)
          </label>
          <input
            id="konu"
            name="konu"
            type="text"
            className={`${inputBase} border-slate-200 focus:border-primary-400 focus:ring-primary-600/15`}
          />
        </div>

        <div>
          <label htmlFor="mesaj" className="text-sm font-semibold text-slate-800">
            Mesajınız
          </label>
          <textarea
            id="mesaj"
            name="mesaj"
            rows={4}
            aria-describedby={errors.mesaj ? 'mesaj-error' : undefined}
            aria-invalid={!!errors.mesaj}
            className={`${inputBase} resize-y ${errors.mesaj ? 'border-red-400 focus:border-red-400 focus:ring-red-600/15' : 'border-slate-200 focus:border-primary-400 focus:ring-primary-600/15'}`}
          />
          {errors.mesaj && (
            <p id="mesaj-error" className="mt-1.5 text-xs font-medium text-red-600" role="alert">
              {errors.mesaj}
            </p>
          )}
        </div>

        {submitError && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
            {submitError}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Gönderiliyor…
            </>
          ) : (
            'Gönder'
          )}
        </button>
      </div>
    </form>
  )
}

export function ContactPanel({ className = '' }: { className?: string }) {
  return (
    <div
      className={`overflow-hidden rounded-[2rem] border border-slate-200/80 bg-gradient-to-br from-slate-50 via-white to-primary-50/30 p-8 shadow-xl shadow-slate-900/5 sm:p-10 lg:p-12 ${className}`}
    >
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <FadeIn>
          <ContactInfoBlock />
        </FadeIn>
        <FadeIn>
          <ContactFormBlock />
        </FadeIn>
      </div>
    </div>
  )
}

export function ContactSection() {
  return (
    <section id="iletisim" className="scroll-mt-24 pb-20 pt-8 sm:pb-24 sm:pt-12" aria-labelledby="iletisim-baslik">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <ContactPanel />
      </div>
    </section>
  )
}
