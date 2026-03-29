import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Globe, Share2, AtSign, Mail } from 'lucide-react'
import type { SerializedProfile } from '@/types'

interface Props {
  profile: SerializedProfile | null
}

const stats = [
  { key: 'yearsOfExperience' as const, label: 'Years of Experience' },
  { key: 'projectsCompleted' as const, label: 'Projects Completed' },
  { key: 'worldwideClients' as const, label: 'Worldwide Clients' },
]

const socialIcons: { key: 'dribbble'|'twitter'|'instagram'|'email'; Icon: React.ComponentType<{ size?: number }>; label: string; isEmail?: boolean }[] = [
  { key: 'dribbble',  Icon: Globe,   label: 'Dribbble' },
  { key: 'twitter',   Icon: Share2,  label: 'Twitter'  },
  { key: 'instagram', Icon: AtSign,  label: 'Instagram' },
  { key: 'email',     Icon: Mail,    label: 'Email',   isEmail: true },
]

export default function HeroSection({ profile }: Props) {
  return (
    <section className="min-h-screen flex flex-col justify-center px-4 pt-24 pb-16 max-w-5xl mx-auto">
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-12">

        {/* Text content */}
        <div className="flex-1">
          {/* Name */}
          <h1 className="font-bold text-text-primary leading-none tracking-tight
            text-[40px] sm:text-[60px] md:text-[75px] xl:text-[90px]">
            {profile?.name ?? 'Your Name'}
          </h1>

          {/* Title */}
          <p className="mt-4 text-text-secondary text-lg md:text-xl font-normal">
            {profile?.title ?? 'Product & Motion Designer'}
          </p>

          {/* Bio */}
          {profile?.bio && (
            <p className="mt-6 text-text-secondary text-sm md:text-base leading-relaxed max-w-lg">
              {profile.bio}
            </p>
          )}

          {/* Social links */}
          <div className="flex items-center gap-5 mt-8">
            {socialIcons.map(({ key, Icon, label, isEmail }) => {
              const href = profile?.socialLinks?.[key]
              if (!href) return null
              return (
                <a
                  key={key}
                  href={isEmail ? `mailto:${href}` : href}
                  target={isEmail ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-text-muted hover:text-accent-orange transition-colors"
                >
                  <Icon size={20} />
                </a>
              )
            })}
          </div>

          {/* CTA buttons */}
          <div className="flex items-center gap-4 mt-8">
            <Link
              href="/work"
              className="bg-accent-orange hover:bg-accent-lime text-white font-display font-bold
                text-sm rounded-btn px-6 py-3 transition-colors duration-200"
            >
              View My Work
            </Link>
            <Link
              href="#contact"
              className="border border-[rgba(255,255,255,0.15)] hover:border-[rgba(255,255,255,0.3)]
                text-text-secondary hover:text-text-primary text-sm rounded-btn px-6 py-3
                transition-colors duration-200"
            >
              Contact Me
            </Link>
          </div>
        </div>

        {/* Avatar */}
        {profile?.avatarUrl && (
          <div className="relative shrink-0 w-64 h-64 lg:w-80 lg:h-80 rounded-2xl overflow-hidden
            shadow-card border border-[rgba(255,255,255,0.06)]">
            <Image
              src={profile.avatarUrl}
              alt={profile.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 256px, 320px"
            />
          </div>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-8 mt-16 pt-12 border-t border-[rgba(255,255,255,0.06)]">
        {stats.map(({ key, label }) => (
          <div key={key} className="flex flex-col gap-1">
            <span className="font-semibold text-text-primary leading-none tracking-[-0.01em]
              text-[40px] sm:text-[55px] md:text-[70px]">
              {profile?.[key] ?? 0}+
            </span>
            <span className="text-text-secondary text-xs sm:text-sm">{label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
