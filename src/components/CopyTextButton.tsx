import { useState } from 'react'
import { useToast } from './Toast'

type CopyTextButtonProps = {
  text: string
  /** Screen reader / tooltip context */
  label: string
  copiedMessage: string
  copyFailedMessage?: string
  className?: string
}

export function CopyTextButton({
  text,
  label,
  copiedMessage,
  copyFailedMessage = 'Kopyalanamadı — tarayıcı izni gerekli olabilir.',
  className = '',
}: CopyTextButtonProps) {
  const toast = useToast()
  const [busy, setBusy] = useState(false)

  async function onCopy() {
    if (busy) return
    setBusy(true)
    try {
      await navigator.clipboard.writeText(text)
      toast(copiedMessage, 'success')
    } catch {
      toast(copyFailedMessage, 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      disabled={busy}
      title={label}
      aria-label={label}
      className={`inline-flex shrink-0 items-center justify-center rounded-lg border border-slate-200/80 bg-white p-2 text-slate-500 transition hover:border-primary-200 hover:text-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 disabled:opacity-50 ${className}`}
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
        />
      </svg>
    </button>
  )
}
