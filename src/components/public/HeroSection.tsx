import Image from 'next/image'
import AnimatedHeading from './AnimatedHeading'
import CertificationGrid from './CertificationGrid'
import CountUp from './CountUp'
import type { SerializedProfile, SerializedCertification } from '@/types'

interface Props {
  profile:        SerializedProfile | null
  certifications: SerializedCertification[]
}

// Fallback Unsplash model photo for demo
const FALLBACK_AVATAR = 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80'

const stats = [
  { key: 'yearsOfExperience' as const, label: 'YEARS OF\nEXPERIENCE' },
  { key: 'projectsCompleted' as const, label: 'PROJECTS\nCOMPLETED'  },
  { key: 'worldwideClients'  as const, label: 'WORLDWIDE\nCLIENTS'   },
]

export default function HeroSection({ profile, certifications }: Props) {
  const avatarSrc = profile?.avatarUrl || FALLBACK_AVATAR

  return (
    <section className="pt-6 pb-12 lg:pb-0">
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
              <CountUp end={profile?.[key] ?? 0} prefix="+" />
            </span>
            <span className="text-text-secondary text-[10px] uppercase tracking-wider mt-1 whitespace-pre-line leading-tight">
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Certifications — click to view full-screen */}
      <CertificationGrid certifications={certifications} />
    </section>
  )
}
