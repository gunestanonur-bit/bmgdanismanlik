import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'

type AnimatedCounterProps = {
  value: string
  duration?: number
  className?: string
}

const NUM_RE = /^(\d+)(.*)$/

export function AnimatedCounter({ value, duration = 1200, className }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })
  const reduce = useReducedMotion()
  const match = NUM_RE.exec(value.trim())
  const target = match ? parseInt(match[1], 10) : null
  const suffix = match ? match[2] : ''
  const [display, setDisplay] = useState(target !== null ? '0' + suffix : value)

  useEffect(() => {
    if (!isInView || reduce || target === null) {
      setDisplay(value)
      return
    }

    let start: number | null = null
    let frame: number

    function step(ts: number) {
      if (start === null) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(eased * target!) + suffix)
      if (progress < 1) frame = requestAnimationFrame(step)
    }

    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [isInView, reduce, target, suffix, duration, value])

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  )
}
