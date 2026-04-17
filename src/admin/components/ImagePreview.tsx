import { useState } from 'react'

interface Props {
  url: string
  className?: string
}

function isImageUrl(url: string): boolean {
  try {
    const u = new URL(url)
    return u.protocol.startsWith('http')
  } catch {
    return false
  }
}

export function ImagePreview({ url, className = '' }: Props) {
  const [state, setState] = useState<'loading' | 'ok' | 'error'>('loading')

  if (!isImageUrl(url)) return null

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
          className={`h-24 w-full object-cover transition-opacity duration-300 ${state === 'ok' ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
    </div>
  )
}
