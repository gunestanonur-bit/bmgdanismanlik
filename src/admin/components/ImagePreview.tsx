import { useEffect, useState } from 'react'

interface Props {
  url: string
  className?: string
  /** e.g. min-h-[12rem] for hero slider preview */
  imgClassName?: string
}

function isDisplayableImageUrl(url: string): boolean {
  const t = url.trim()
  if (!t) return false
  if (t.startsWith('data:image/')) return true
  try {
    const u = new URL(t)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

export function ImagePreview({ url, className = '', imgClassName = 'h-24 w-full object-cover' }: Props) {
  const [state, setState] = useState<'loading' | 'ok' | 'error'>('loading')

  useEffect(() => {
    setState('loading')
  }, [url])

  if (!isDisplayableImageUrl(url)) return null

  return (
    <div className={`overflow-hidden rounded-lg border border-slate-200 bg-slate-100 ${className}`}>
      {state === 'error' ? (
        <div className="flex h-20 items-center justify-center text-xs text-slate-400">
          Görsel yüklenemedi
        </div>
      ) : (
        <img
          key={url}
          src={url}
          alt="Önizleme"
          onLoad={() => setState('ok')}
          onError={() => setState('error')}
          className={`${imgClassName} transition-opacity duration-300 ${state === 'ok' ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
    </div>
  )
}
