import { useEffect, useMemo, useState } from 'react'
import { useSiteContent } from '../../content/SiteContentContext'
import type { EmailSettings } from '../../content/types'
import { useToast } from '../../components/Toast'

export function EmailSettingsPage() {
  const { content, updateContent } = useSiteContent()
  const toast = useToast()
  const [draft, setDraft] = useState<EmailSettings>(content.emailSettings)

  useEffect(() => {
    setDraft(content.emailSettings)
  }, [content.emailSettings])

  const isDirty = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(content.emailSettings),
    [draft, content.emailSettings],
  )

  function save() {
    if (!isDirty) return
    updateContent((c) => ({ ...c, emailSettings: { ...draft } }))
    toast('E-posta ayarlari kaydedildi.')
  }

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h1 className="admin-page-title">E-posta ayarlari</h1>
        <button type="button" className="admin-btn admin-btn-primary" disabled={!isDirty} onClick={save}>
          E-posta ayarlarini kaydet
        </button>
      </div>
      <p className="admin-page-subtitle">
        Iletisim formu gonderimleri bu ayarlara gore Vercel API uzerinden e-posta olarak iletilir.
      </p>

      <section className="admin-card mt-8">
        <h2 className="admin-section-title">Form bildirim ayarlari</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="admin-label">Bildirim alici e-posta</label>
            <input
              value={draft.recipientEmail}
              onChange={(e) => setDraft((p) => ({ ...p, recipientEmail: e.target.value }))}
              className="admin-input mt-2"
              placeholder="info@bmgdanismanlik.com"
            />
          </div>
          <div>
            <label className="admin-label">Gonderen gorunen ad</label>
            <input
              value={draft.fromName}
              onChange={(e) => setDraft((p) => ({ ...p, fromName: e.target.value }))}
              className="admin-input mt-2"
              placeholder="BMG Danismanlik Website"
            />
          </div>
          <div>
            <label className="admin-label">Konu on eki</label>
            <input
              value={draft.subjectPrefix}
              onChange={(e) => setDraft((p) => ({ ...p, subjectPrefix: e.target.value }))}
              className="admin-input mt-2"
              placeholder="Yeni Iletisim Formu"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="admin-label">Basarili gonderim mesaji</label>
            <textarea
              rows={3}
              value={draft.successMessage}
              onChange={(e) => setDraft((p) => ({ ...p, successMessage: e.target.value }))}
              className="admin-input mt-2"
            />
          </div>
        </div>
      </section>

      <section className="admin-card mt-8">
        <h2 className="admin-section-title">Vercel ortam degiskenleri</h2>
        <p className="mt-1 text-sm text-slate-500">
          Formun calismasi icin Vercel Project Settings &gt; Environment Variables alaninda bu anahtarlar gerekir.
        </p>
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          <p>
            <strong>RESEND_API_KEY</strong>: Resend API anahtari
          </p>
          <p className="mt-1">
            <strong>CONTACT_FROM_EMAIL</strong>: Gonderen adresi (ornek: no-reply@bmgdanismanlik.com)
          </p>
          <p className="mt-1">
            <strong>CONTACT_TO_EMAIL</strong>: Opsiyonel zorunlu alici (girerseniz admin alici alanini override eder)
          </p>
        </div>
      </section>
    </div>
  )
}
