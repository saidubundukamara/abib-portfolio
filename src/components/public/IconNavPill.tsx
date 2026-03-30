'use client'

import Link from 'next/link'
import { Home, FolderOpen, Briefcase, Wrench, PenSquare } from 'lucide-react'

const navItems = [
  { Icon: Home,       href: '/',           label: 'Home'       },
  { Icon: FolderOpen, href: '#projects',   label: 'Projects'   },
  { Icon: Briefcase,  href: '#experience', label: 'Experience' },
  { Icon: Wrench,     href: '#tools',      label: 'Tools'      },
  { Icon: PenSquare,  href: '#thoughts',   label: 'Thoughts'   },
]

export default function IconNavPill() {
  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <nav
        className="flex items-center gap-1 px-3 py-2 rounded-[16px]
          border border-[rgba(255,255,255,0.06)]
          bg-[rgba(255,255,255,0.03)] backdrop-blur-md"
      >
        {navItems.map(({ Icon, href, label }) => (
          <Link
            key={label}
            href={href}
            aria-label={label}
            className="p-2 text-text-secondary hover:text-text-primary transition-colors rounded-lg"
          >
            <Icon size={18} />
          </Link>
        ))}
      </nav>
    </header>
  )
}
