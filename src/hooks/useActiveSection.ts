import { useEffect, useState } from 'react'

export function useActiveSection(ids: string[], rootMargin = '-30% 0px -60% 0px') {
  const [active, setActive] = useState(ids[0] ?? '')

  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    if (els.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id)
          }
        }
      },
      { rootMargin },
    )

    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [ids, rootMargin])

  return active
}
