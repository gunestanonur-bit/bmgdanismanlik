import type { SiteContent } from './types'

const STORAGE_KEY = 'bmg_site_content_v1'

export function loadStoredContent(): SiteContent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as SiteContent
    if (!parsed || typeof parsed !== 'object') return null
    return parsed
  } catch {
    return null
  }
}

export function saveContentToStorage(content: SiteContent) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(content))
}

export function clearStoredContent() {
  localStorage.removeItem(STORAGE_KEY)
}

export function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
