'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { Award, ArrowRight, Maximize2, X } from 'lucide-react'
import type { SerializedCertification } from '@/types'

interface Props {
  certifications: SerializedCertification[]
}

export default function CertificationGrid({ certifications }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const openCert = openIndex !== null ? certifications[openIndex] : null

  useEffect(() => {
    if (!openCert) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenIndex(null)
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [openCert])

  if (certifications.length === 0) return null

  const lightbox = openCert && (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={openCert.name}
      onClick={() => setOpenIndex(null)}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-8"
    >
      <div aria-hidden className="absolute inset-0 bg-black/85 backdrop-blur-sm" />

      <button
        type="button"
        onClick={() => setOpenIndex(null)}
        aria-label="Close"
        className="absolute top-4 right-4 z-20 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
        style={{ width: '40px', height: '40px' }}
      >
        <X size={20} color="white" />
      </button>

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 flex flex-col items-center gap-6 max-w-5xl w-full"
      >
        {openCert.badgeImageUrl ? (
          <div
            className="relative w-full"
            style={{ height: 'min(75vh, 700px)' }}
          >
            <Image
              src={openCert.badgeImageUrl}
              alt={openCert.name}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center w-full h-[60vh] bg-[rgba(255,255,255,0.04)] rounded-2xl">
            <Award size={96} color="rgba(255,255,255,0.35)" />
          </div>
        )}

        <div className="text-center">
          <h3 className="font-semibold text-text-primary text-xl">
            {openCert.name}
          </h3>
          <p className="text-text-secondary text-sm mt-1">
            {openCert.issuer} · {openCert.year}
          </p>
          {openCert.credentialUrl && (
            <a
              href={openCert.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-text-primary text-sm font-medium transition-colors"
            >
              View credential
              <ArrowRight size={14} />
            </a>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <>
      <div className="grid grid-cols-2 gap-4 mt-8">
        {certifications.map((cert, i) => (
          <button
            key={cert.id}
            type="button"
            onClick={() => setOpenIndex(i)}
            aria-label={`View ${cert.name} — ${cert.issuer} (${cert.year})`}
            className="group relative overflow-hidden rounded-[16px] bg-[rgba(255,255,255,0.04)] text-left transition-transform duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            style={{ minHeight: '280px' }}
          >
            {cert.badgeImageUrl ? (
              <Image
                src={cert.badgeImageUrl}
                alt={cert.name}
                fill
                sizes="(min-width: 1024px) 300px, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                priority={i === 0}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Award size={56} color="rgba(255,255,255,0.35)" />
              </div>
            )}

            {/* Bottom-up legibility gradient */}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to top, rgba(21,19,18,0.92) 0%, rgba(21,19,18,0.55) 35%, rgba(21,19,18,0) 60%)',
              }}
            />

            {/* Expand chip */}
            <div
              className="absolute top-4 right-4 shrink-0 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'rgba(0,0,0,0.45)',
                backdropFilter: 'blur(4px)',
              }}
            >
              <Maximize2 size={16} color="white" />
            </div>

            {/* Text overlay */}
            <div className="absolute inset-x-0 bottom-0 p-4">
              <p className="font-semibold text-text-primary text-sm leading-tight line-clamp-2">
                {cert.name}
              </p>
              <p className="text-text-secondary text-xs mt-1">
                {cert.issuer} · {cert.year}
              </p>
            </div>
          </button>
        ))}
      </div>

      {lightbox && typeof document !== 'undefined' && createPortal(lightbox, document.body)}
    </>
  )
}
