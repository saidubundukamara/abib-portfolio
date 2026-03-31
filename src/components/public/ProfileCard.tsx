import Image from 'next/image'
import { SiDribbble, SiX, SiInstagram, SiYoutube } from 'react-icons/si'
import type { SerializedProfile } from '@/types'

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
     * Outer wrapper — 16px padding gives the rotated dashed-rect decoration
     * room to peek out from behind the white card on all sides.
     */
    <div style={{ position: 'relative', width: '360px', padding: '16px', flexShrink: 0 }}>

      {/* ── Dashed orange border rectangle, slightly counter-rotated ── */}
      <svg
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          transform: 'rotate(-2.5deg)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
        viewBox="0 0 360 700"
        preserveAspectRatio="none"
      >
        <rect
          x="3" y="3" width="354" height="694"
          rx="28" ry="28"
          fill="none"
          stroke="rgb(244,108,56)"
          strokeWidth="2.2"
          strokeDasharray="9 6"
        />
      </svg>

      {/* ── White card ─────────────────────────────────────────────── */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >

        {/* Internal arc 1 — sweeps from mid-left across the top of the photo */}
        <svg
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '440px',
            zIndex: 2,
            pointerEvents: 'none',
          }}
          viewBox="0 0 328 440"
          fill="none"
        >
          <path
            d="M -24 210 Q 100 -10 310 55"
            stroke="rgb(244,108,56)"
            strokeWidth="2.5"
            strokeDasharray="9 6"
            strokeLinecap="round"
          />
        </svg>

        {/* Internal arc 2 — sweeps from below the flame icon toward lower-left */}
        <svg
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '55%',
            height: '220px',
            zIndex: 2,
            pointerEvents: 'none',
          }}
          viewBox="0 0 200 220"
          fill="none"
        >
          <path
            d="M 155 30 Q 90 90 -10 200"
            stroke="rgb(244,108,56)"
            strokeWidth="2.5"
            strokeDasharray="9 6"
            strokeLinecap="round"
          />
        </svg>

        {/* ── Photo ───────────────────────────────────────────────── */}
        <div style={{ padding: '14px 14px 0 14px', width: '100%' }}>
          <div
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '4 / 5',
              backgroundColor: 'rgb(244,108,56)',
              borderRadius: '14px',
              overflow: 'hidden',
            }}
          >
            <Image
              src={avatarSrc}
              alt={profile?.name ?? 'Profile'}
              fill
              className="object-cover object-top"
              sizes="300px"
              priority
            />
          </div>
        </div>

        {/* ── Text content ────────────────────────────────────────── */}
        <div
          style={{
            position: 'relative',
            zIndex: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '14px',
            padding: '22px 24px 30px',
            width: '100%',
          }}
        >
          {/* Name */}
          <h2
            style={{
              fontFamily: 'var(--font-sans)',
              fontWeight: 800,
              fontSize: '34px',
              color: 'rgb(14,13,12)',
              textAlign: 'center',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              margin: 0,
            }}
          >
            {profile?.name ?? 'Your Name'}
          </h2>

          {/* Flame — solid vivid orange disc */}
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              backgroundColor: 'rgb(244,108,56)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: '21px', lineHeight: 1 }}>🔥</span>
          </div>

          {/* Bio */}
          <p
            style={{
              color: 'rgb(110,111,115)',
              fontSize: '14px',
              textAlign: 'center',
              lineHeight: 1.65,
              margin: 0,
              maxWidth: '230px',
            }}
          >
            {profile?.bio ?? 'A designer who creates beautiful digital experiences.'}
          </p>

          {/* Social icons */}
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center', marginTop: '4px' }}>
            {socialLinks.map(({ key, Icon, label }) => {
              const href = (profile?.socialLinks as Record<string, string> | undefined)?.[key]
              return (
                <a
                  key={key}
                  href={href || '#'}
                  target={href ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  aria-label={label}
                  style={{ color: 'rgb(244,108,56)', display: 'flex' }}
                  className="hover:opacity-70 transition-opacity"
                >
                  <Icon size={22} />
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
