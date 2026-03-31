'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, FolderOpen, Briefcase, Wrench, PenSquare } from 'lucide-react'

const navItems = [
  { Icon: Home,       href: '/',           label: 'Home'       },
  { Icon: FolderOpen, href: '/work',       label: 'Projects'   },
  { Icon: Briefcase,  href: '/experience', label: 'Experience' },
  { Icon: Wrench,     href: '/tools',      label: 'Tools'      },
  { Icon: PenSquare,  href: '/thoughts',   label: 'Thoughts'   },
]

function isActive(href: string, pathname: string): boolean {
  if (href === '/') return pathname === '/'
  return pathname.startsWith(href)
}

export default function IconNavPill() {
  const pathname = usePathname()

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <nav
        className="flex items-center gap-1 px-3 py-2 rounded-[16px]
          border border-[rgba(255,255,255,0.06)]
          bg-[rgba(255,255,255,0.03)] backdrop-blur-md"
      >
        {navItems.map(({ Icon, href, label }) => (
          <div key={label} className="relative group/item">
            <Link
              href={href}
              aria-label={label}
              className={`p-2 transition-colors rounded-lg flex ${
                isActive(href, pathname)
                  ? 'text-text-primary'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Icon size={18} />
            </Link>
            <span className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-2
              px-2 py-0.5 rounded-md bg-[rgba(30,28,27,0.95)] border border-[rgba(255,255,255,0.08)]
              text-text-primary text-[11px] font-medium whitespace-nowrap
              opacity-0 group-hover/item:opacity-100 transition-opacity duration-150">
              {label}
            </span>
          </div>
        ))}
      </nav>
    </header>
  )
}
