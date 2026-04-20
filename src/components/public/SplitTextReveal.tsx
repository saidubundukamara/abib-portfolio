'use client'

import * as React from 'react'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Props extends React.HTMLAttributes<HTMLSpanElement> {
  text: string
  duration?: number
  stagger?: number
  delay?: number
  ease?: string
  threshold?: number
  triggerOnMount?: boolean
}

export default function SplitTextReveal({
  text,
  duration = 0.9,
  stagger = 0.035,
  delay = 0,
  ease = 'expo.out',
  threshold = 0.15,
  triggerOnMount = false,
  className = '',
  ...rest
}: Props) {
  const rootRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const targets = root.querySelectorAll<HTMLSpanElement>('[data-split-char]')
    if (targets.length === 0) return

    gsap.set(targets, { yPercent: 110, willChange: 'transform' })

    const tl = gsap.timeline({ paused: true, delay })
    tl.to(targets, {
      yPercent: 0,
      duration,
      ease,
      stagger,
    })

    if (triggerOnMount) {
      tl.play()
      return () => {
        tl.kill()
      }
    }

    const startPct = (1 - threshold) * 100
    const st = ScrollTrigger.create({
      trigger: root,
      start: `top ${startPct}%`,
      once: true,
      onEnter: () => tl.play(),
    })

    return () => {
      st.kill()
      tl.kill()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Preserve word boundaries: split into words, then into chars, keep spaces between words.
  const words = text.split(' ')

  return (
    <span
      ref={rootRef}
      className={`inline-block ${className}`}
      aria-label={text}
      {...rest}
    >
      {words.map((word, wi) => (
        <span
          key={wi}
          className="inline-block whitespace-nowrap"
          aria-hidden="true"
        >
          {Array.from(word).map((ch, ci) => (
            <span
              key={ci}
              className="inline-block overflow-hidden align-bottom"
              style={{ lineHeight: 'inherit' }}
            >
              <span data-split-char className="inline-block will-change-transform">
                {ch}
              </span>
            </span>
          ))}
          {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </span>
  )
}
