import Image from 'next/image'
import { Layers, LayoutDashboard, ArrowRight } from 'lucide-react'
import AnimatedHeading from './AnimatedHeading'
import type { SerializedProfile } from '@/types'

interface Props {
  profile: SerializedProfile | null
}

// Fallback Unsplash model photo for demo
const FALLBACK_AVATAR = 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80'

const stats = [
  { key: 'yearsOfExperience' as const, label: 'YEARS OF\nEXPERIENCE' },
  { key: 'projectsCompleted' as const, label: 'PROJECTS\nCOMPLETED'  },
  { key: 'worldwideClients'  as const, label: 'WORLDWIDE\nCLIENTS'   },
]

export default function HeroSection({ profile }: Props) {
  const avatarSrc = profile?.avatarUrl || FALLBACK_AVATAR

  return (
    <section className="pt-6 pb-12 lg:pb-20">
      {/* Mobile-only compact profile */}
      <div className="lg:hidden flex items-center gap-3 mb-8">
        <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
          <Image
            src={avatarSrc}
            alt={profile?.name ?? 'Profile'}
            fill
            className="object-cover"
            sizes="48px"
            priority
          />
        </div>
        <div>
          <p className="font-bold text-text-primary text-sm">{profile?.name ?? 'Your Name'}</p>
          <p className="text-text-secondary text-xs">{profile?.title ?? 'Designer'}</p>
        </div>
      </div>

      {/* Animated two-line heading */}
      <AnimatedHeading />

      {/* Bio / subtitle */}
      <p className="text-text-secondary text-base leading-relaxed max-w-md">
        {profile?.bio ?? 'Passionate about creating intuitive and engaging user experiences. Specialise in transforming ideas into beautifully crafted products.'}
      </p>

      {/* Stats row */}
      <div className="flex gap-10 mt-10 pt-8 border-t border-[rgba(255,255,255,0.06)]">
        {stats.map(({ key, label }) => (
          <div key={key} className="flex flex-col gap-1">
            <span
              className="font-display font-bold text-text-primary leading-none"
              style={{ fontSize: 'clamp(32px, 4vw, 56px)' }}
            >
              +{profile?.[key] ?? 0}
            </span>
            <span className="text-text-secondary text-[10px] uppercase tracking-wider mt-1 whitespace-pre-line leading-tight">
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Service cards */}
      <div className="grid grid-cols-2 gap-4 mt-8">
        {/* Orange card */}
        <div
          className="relative overflow-hidden rounded-[16px] p-5 flex flex-col justify-between"
          style={{ backgroundColor: 'rgb(244,108,56)', minHeight: '180px' }}
        >
          {/* Decorative wave */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 300 180"
            preserveAspectRatio="none"
            style={{ opacity: 0.15 }}
          >
            <path d="M -20 180 C 60 120 140 80 300 20" stroke="white" strokeWidth="60" fill="none" />
            <path d="M -20 220 C 80 140 160 100 320 40" stroke="white" strokeWidth="45" fill="none" />
          </svg>
          <Layers size={26} color="white" className="relative z-10" />
          <div className="relative z-10 flex items-end justify-between gap-2">
            <p className="font-bold text-white text-[11px] uppercase leading-snug tracking-wide">
              LOGO DESIGN,<br />BRAND IDENTITY
            </p>
            <div
              className="shrink-0 flex items-center justify-center"
              style={{
                width: '32px', height: '32px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255,255,255,0.2)',
              }}
            >
              <ArrowRight size={14} color="white" />
            </div>
          </div>
        </div>

        {/* Lime card */}
        <div
          className="relative overflow-hidden rounded-[16px] p-5 flex flex-col justify-between"
          style={{ backgroundColor: 'rgb(197,255,65)', minHeight: '180px' }}
        >
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 300 180"
            preserveAspectRatio="none"
            style={{ opacity: 0.12 }}
          >
            <path d="M -20 180 C 60 120 140 80 300 20" stroke="rgb(21,19,18)" strokeWidth="60" fill="none" />
            <path d="M -20 220 C 80 140 160 100 320 40" stroke="rgb(21,19,18)" strokeWidth="45" fill="none" />
          </svg>
          <LayoutDashboard size={26} color="rgb(21,19,18)" className="relative z-10" />
          <div className="relative z-10 flex items-end justify-between gap-2">
            <p
              className="font-bold text-[11px] uppercase leading-snug tracking-wide"
              style={{ color: 'rgb(21,19,18)' }}
            >
              MOTION GRAPHICS,<br />SOCIAL MEDIA
            </p>
            <div
              className="shrink-0 flex items-center justify-center"
              style={{
                width: '32px', height: '32px',
                borderRadius: '8px',
                backgroundColor: 'rgba(21,19,18,0.15)',
              }}
            >
              <ArrowRight size={14} color="rgb(21,19,18)" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
