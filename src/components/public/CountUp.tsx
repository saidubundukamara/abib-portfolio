'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Props {
  end: number
  duration?: number
  prefix?: string
  suffix?: string
  threshold?: number
  ease?: string
}

export default function CountUp({
  end,
  duration = 1.8,
  prefix = '',
  suffix = '',
  threshold = 0.2,
  ease = 'power3.out',
}: Props) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const counter = { val: 0 }
    el.textContent = `${prefix}0${suffix}`

    const tl = gsap.timeline({ paused: true })
    tl.to(counter, {
      val: end,
      duration,
      ease,
      onUpdate: () => {
        el.textContent = `${prefix}${Math.round(counter.val)}${suffix}`
      },
    })

    const startPct = (1 - threshold) * 100
    const st = ScrollTrigger.create({
      trigger: el,
      start: `top ${startPct}%`,
      once: true,
      onEnter: () => tl.play(),
    })

    return () => {
      st.kill()
      tl.kill()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [end])

  return <span ref={ref}>{`${prefix}0${suffix}`}</span>
}
