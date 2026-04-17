import type { ReactNode } from 'react'

type SectionHeadingProps = {
  id: string
  title: string
  eyebrow?: string
  children?: ReactNode
  className?: string
}

export function SectionHeading({ id, title, eyebrow, children, className }: SectionHeadingProps) {
  return (
    <div className={className ?? 'max-w-3xl'}>
      {eyebrow && (
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary-600">{eyebrow}</p>
      )}
      <div className="mt-3 flex items-end gap-4">
        <h2
          id={id}
          className="font-[family-name:var(--font-display)] text-balance text-3xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-4xl lg:text-[2.75rem]"
        >
          {title}
        </h2>
        <span className="mb-2 hidden h-px min-w-[2rem] flex-1 bg-gradient-to-r from-primary-600/40 to-transparent sm:block" aria-hidden />
      </div>
      {children}
    </div>
  )
}
