import { useEffect, useMemo, useState } from 'react'
import { useSiteContent } from '../../content/SiteContentContext'
import type { ContactMessage, EmailSettings } from '../../content/types'
import { useToast } from '../../components/Toast'
import {
  deleteContactMessage,
  fetchContactMessages,
  markContactMessageRead,
  saveContactMessageReply,
} from '../../lib/db'

export function EmailSettingsPage() {
  const { content, updateContent } = useSiteContent()
  const toast = useToast()
  const [draft, setDraft] = useState<EmailSettings>(content.emailSettings)
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loadingMessages, setLoadingMessages] = useState(true)
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null)
  const [replyDraft, setReplyDraft] = useState('')

  useEffect(() => {
    setDraft(content.emailSettings)
  }, [content.emailSettings])

  const isDirty = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(content.emailSettings),
    [draft, content.emailSettings],
  )
  const activeMessage = useMemo(
    () => messages.find((m) => m.id === activeMessageId) ?? null,
    [messages, activeMessageId],
  )

  useEffect(() => {
    let mounted = true
    void fetchContactMessages()
      .then((rows) => {
        if (!mounted) return
        setMessages(rows)
      })
      .catch((err) => {
        console.error(err)
        toast('Mesajlar yuklenemedi.', 'error')
      })
      .finally(() => {
        if (mounted) setLoadingMessages(false)
      })
    return () => {
      mounted = false
    }
  }, [toast])

  function save() {
    if (!isDirty) return
    updateContent((c) => ({ ...c, emailSettings: { ...draft } }))
    toast('E-posta ayarlari kaydedildi.')
  }

  async function openMessage(msg: ContactMessage) {
    setActiveMessageId(msg.id)
    setReplyDraft(msg.replyText)
    if (!msg.isRead) {
      try {
        await markContactMessageRead(msg.id, true)
        setMessages((prev) =>
          prev.map((row) => (row.id === msg.id ? { ...row, isRead: true } : row)),
        )
      } catch {
        toast('Mesaj okunmus olarak isaretlenemedi.', 'error')
      }
    }
  }

  async function answerMessage(msg: ContactMessage) {
    const body = replyDraft.trim()
    if (!body) {
      toast('Yanit metni bos olamaz.', 'error')
      return
    }
    try {
      await saveContactMessageReply(msg.id, body)
      setMessages((prev) =>
        prev.map((row) =>
          row.id === msg.id
            ? { ...row, replyText: body, repliedAt: new Date().toISOString(), isRead: true }
            : row,
        ),
      )
      const mailto = `mailto:${encodeURIComponent(msg.email)}?subject=${encodeURIComponent(
        `Re: ${msg.konu || 'Iletisim talebi'}`,
      )}&body=${encodeURIComponent(body)}`
      window.open(mailto, '_blank')
      toast('Yanit kaydedildi ve e-posta taslagi acildi.')
    } catch {
      toast('Yanit kaydedilemedi.', 'error')
    }
  }

  async function removeMessage(msg: ContactMessage) {
    if (!confirm('Bu mesaji kalici olarak silmek istiyor musunuz?')) return
    try {
      await deleteContactMessage(msg.id)
      setMessages((prev) => prev.filter((row) => row.id !== msg.id))
      if (activeMessageId === msg.id) {
        setActiveMessageId(null)
        setReplyDraft('')
      }
      toast('Mesaj silindi.', 'warning')
    } catch {
      toast('Mesaj silinemedi.', 'error')
    }
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
        <h2 className="admin-section-title">Gelen kutusu</h2>
        <p className="mt-1 text-sm text-slate-500">
          Iletisim formundan gelen kayitlar burada listelenir. Okuyabilir, yanit taslagi olusturabilir veya silebilirsiniz.
        </p>

        {loadingMessages ? (
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
            Mesajlar yukleniyor...
          </div>
        ) : messages.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500">
            Henuz form mesaji yok.
          </div>
        ) : (
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 bg-white text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-slate-600">Durum</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-600">Ad</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-600">E-posta</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-600">Konu</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-600">Tarih</th>
                  <th className="px-3 py-2 text-right font-semibold text-slate-600">Islem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {messages.map((msg) => (
                  <tr key={msg.id} className={msg.isRead ? '' : 'bg-primary-50/40'}>
                    <td className="px-3 py-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          msg.repliedAt
                            ? 'bg-emerald-100 text-emerald-700'
                            : msg.isRead
                              ? 'bg-slate-100 text-slate-600'
                              : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {msg.repliedAt ? 'Yanitlandi' : msg.isRead ? 'Okundu' : 'Yeni'}
                      </span>
                    </td>
                    <td className="px-3 py-2 font-medium text-slate-800">{msg.ad}</td>
                    <td className="px-3 py-2 text-slate-600">{msg.email}</td>
                    <td className="max-w-[14rem] truncate px-3 py-2 text-slate-600">{msg.konu || '-'}</td>
                    <td className="px-3 py-2 text-slate-500">
                      {new Date(msg.createdAt).toLocaleString('tr-TR')}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button type="button" className="admin-btn admin-btn-secondary px-3 py-1.5 text-xs" onClick={() => openMessage(msg)}>
                          Oku
                        </button>
                        <button type="button" className="admin-btn admin-btn-danger px-3 py-1.5 text-xs" onClick={() => removeMessage(msg)}>
                          Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeMessage && (
          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-base font-semibold text-slate-900">{activeMessage.ad}</p>
                <p className="text-sm text-slate-600">{activeMessage.email}</p>
                {activeMessage.telefon ? <p className="text-sm text-slate-600">{activeMessage.telefon}</p> : null}
              </div>
              <span className="text-xs text-slate-500">{new Date(activeMessage.createdAt).toLocaleString('tr-TR')}</span>
            </div>
            <div className="mt-4 rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Mesaj</p>
              <p className="whitespace-pre-wrap">{activeMessage.mesaj}</p>
            </div>
            <div className="mt-4">
              <label className="admin-label">Yanit taslagi</label>
              <textarea
                rows={5}
                value={replyDraft}
                onChange={(e) => setReplyDraft(e.target.value)}
                className="admin-input mt-2"
                placeholder="Musteriye gondereceginiz yaniti yazin..."
              />
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button type="button" className="admin-btn admin-btn-primary" onClick={() => answerMessage(activeMessage)}>
                  Yanitla
                </button>
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() => {
                    setActiveMessageId(null)
                    setReplyDraft('')
                  }}
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        )}
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
