'use client'

import { useEffect, useRef, useState } from 'react'

export default function StickyProfileWrapper({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const cardRef     = useRef<HTMLDivElement>(null)
  const [translateY, setTranslateY] = useState(0)

  useEffect(() => {
    // Compute centered offset: (containerH - cardH) / 2
    function getCenterOffset() {
      if (!containerRef.current || !cardRef.current) return 0
      const containerH = containerRef.current.offsetHeight
      const cardH      = cardRef.current.offsetHeight
      return Math.max(0, (containerH - cardH) / 2)
    }

    // Re-compute on resize so it stays accurate at every viewport size
    const TOP_PADDING = 24 // px from top when scrolled down

    function update() {
      const centerOffset = getCenterOffset()
      const progress     = Math.min(window.scrollY / 120, 1) // fully shifted after 120px scroll
      setTranslateY(centerOffset + (TOP_PADDING - centerOffset) * progress)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'sticky',
        top: '4rem',
        height: 'calc(100vh - 4rem)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
      }}
    >
      <div
        ref={cardRef}
        style={{
          transform: `translateY(${translateY}px)`,
          transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          willChange: 'transform',
        }}
      >
        {children}
      </div>
    </div>
  )
}
