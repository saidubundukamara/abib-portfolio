import Image from 'next/image'
import { SiDribbble, SiX, SiInstagram, SiYoutube } from 'react-icons/si'
import type { SerializedProfile } from '@/types'

// Fallback Unsplash model for demo
const FALLBACK_AVATAR = 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80'

interface Props {
  profile: SerializedProfile | null
}

const socialLinks = [
  { key: 'dribbble' as const,  Icon: SiDribbble,  label: 'Dribbble'  },
  { key: 'twitter' as const,   Icon: SiX,          label: 'Twitter'   },
  { key: 'instagram' as const, Icon: SiInstagram,  label: 'Instagram' },
  { key: 'youtube' as const,   Icon: SiYoutube,    label: 'YouTube'   },
]

export default function ProfileCard({ profile }: Props) {
  const avatarSrc = profile?.avatarUrl || FALLBACK_AVATAR

  return (
    /*
     * Outer wrapper — 14px padding on all sides gives the rotated SVG
     * decoration room to peek out from behind the white card.
     * Fixed width matches reference: ~320px outer → ~292px white card.
     */
    <div style={{ position: 'relative', width: '320px', padding: '14px', flexShrink: 0 }}>

      {/* ── Dashed orange decoration ──────────────────────────── */}
      <svg
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0, left: 0,
          width: '100%', height: '100%',
          transform: 'rotate(-2.5deg)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
        viewBox="0 0 320 560"
        preserveAspectRatio="none"
      >
        <rect
          x="3" y="3" width="314" height="554"
          rx="26" ry="26"
          fill="none"
          stroke="rgb(244,108,56)"
          strokeWidth="2"
          strokeDasharray="8 6"
        />
      </svg>

      {/* ── White card ────────────────────────────────────────── */}
      <div
        style={{
          position: 'relative', zIndex: 1,
          backgroundColor: 'white',
          borderRadius: '22px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Photo — 14px inset on sides + top, own 14px border-radius */}
        <div style={{ padding: '14px 14px 0 14px', width: '100%' }}>
          <div
            style={{
              position: 'relative',
              width: '100%',
              /* Slightly portrait ratio — ref card photo is ~264×280px */
              aspectRatio: '15 / 16',
              backgroundColor: 'rgb(244, 108, 56)',
              borderRadius: '14px',
              overflow: 'hidden',
            }}
          >
            <Image
              src={avatarSrc}
              alt={profile?.name ?? 'Profile'}
              fill
              className="object-cover object-top"
              sizes="292px"
              priority
            />
          </div>
        </div>

        {/* Name + flame + bio + socials */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            padding: '20px 24px 24px',
            width: '100%',
          }}
        >
          {/* Name */}
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '22px',
              color: 'rgb(21, 19, 18)',
              textAlign: 'center',
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            {profile?.name ?? 'Your Name'}
          </h2>

          {/* Flame icon in subtle orange circle */}
          <div
            style={{
              width: '38px', height: '38px',
              borderRadius: '50%',
              backgroundColor: 'rgba(244, 108, 56, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '-4px',
            }}
          >
            <span className="animate-flame" style={{ fontSize: '17px', lineHeight: 1 }}>🔥</span>
          </div>

          {/* Bio */}
          <p
            style={{
              color: 'rgb(106, 107, 110)',
              fontSize: '13px',
              textAlign: 'center',
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            {profile?.bio ?? 'A designer who creates beautiful digital experiences.'}
          </p>

          {/* Social icons */}
          <div style={{ display: 'flex', gap: '22px', alignItems: 'center', marginTop: '6px' }}>
            {socialLinks.map(({ key, Icon, label }) => {
              const href = (profile?.socialLinks as Record<string, string> | undefined)?.[key]
              return (
                <a
                  key={key}
                  href={href || '#'}
                  target={href ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-accent-orange hover:opacity-70 transition-opacity"
                >
                  <Icon size={20} />
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
