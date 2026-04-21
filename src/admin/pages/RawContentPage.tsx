import { useEffect, useMemo, useState } from 'react'
import { useSiteContent } from '../../content/SiteContentContext'
import { useToast } from '../../components/Toast'

export function RawContentPage() {
  const { content, importJson, exportJson } = useSiteContent()
  const toast = useToast()
  const pretty = useMemo(() => JSON.stringify(content, null, 2), [content])
  const [editor, setEditor] = useState(pretty)
  const [error, setError] = useState('')

  useEffect(() => {
    setEditor(pretty)
  }, [pretty])

  const dirty = editor !== pretty

  function saveAll() {
    setError('')
    const res = importJson(editor)
    if (!res.ok) {
      setError(res.error)
      toast('JSON gecersiz. Kayit yapilmadi.', 'error')
      return
    }
    toast('Tum icerik JSON editor uzerinden kaydedildi.')
  }

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h1 className="admin-page-title">Tum veri editoru (JSON)</h1>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            onClick={() => {
              exportJson()
              toast('Yedek JSON disa aktarildi.')
            }}
          >
            Yedek indir
          </button>
          <button
            type="button"
            className="admin-btn admin-btn-primary"
            disabled={!dirty}
            onClick={saveAll}
          >
            Tumunu kaydet
          </button>
        </div>
      </div>

      <p className="admin-page-subtitle">
        Dashboardda sabit gorunen tum alanlari burada dogrudan duzenleyebilirsiniz. Bu ekran ileri seviye kullanim icindir.
      </p>

      <section className="admin-card mt-8">
        <p className="text-sm text-slate-600">
          Gecersiz JSON kaydedilmez. Kaydetmeden once formati kontrol edin.
        </p>
        <textarea
          value={editor}
          onChange={(e) => setEditor(e.target.value)}
          className="admin-input mt-4 min-h-[32rem] font-mono text-xs"
          spellCheck={false}
        />
        {error ? (
          <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        ) : null}
      </section>
    </div>
  )
}
