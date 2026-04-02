'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  MessageSquare,
  Wrench,
  Award,
  User,
  Settings,
  X,
  Menu,
} from 'lucide-react'

const navItems = [
  { href: '/admin/dashboard',      label: 'Dashboard',      icon: LayoutDashboard, color: 'text-violet-400' },
  { href: '/admin/projects',       label: 'Projects',       icon: Briefcase,       color: 'text-blue-400'   },
  { href: '/admin/thoughts',       label: 'Thoughts',       icon: FileText,        color: 'text-amber-400'  },
  { href: '/admin/messages',       label: 'Messages',       icon: MessageSquare,   color: 'text-pink-400'   },
  { href: '/admin/tools',          label: 'Tools',          icon: Wrench,          color: 'text-cyan-400'   },
  { href: '/admin/certifications', label: 'Certifications', icon: Award,           color: 'text-emerald-400'},
  { href: '/admin/profile',        label: 'Profile',        icon: User,            color: 'text-orange-400' },
  { href: '/admin/settings',       label: 'Settings',       icon: Settings,        color: 'text-muted-foreground' },
]

export default function AdminSidebarClient() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const sidebar = (
    <nav className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-5 border-b border-border">
        <span className="text-sm font-semibold text-foreground tracking-wide">Portfolio CMS</span>
      </div>

      {/* Nav items */}
      <ul className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon, color }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <li key={href}>
              <Link
                href={href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-white/10 text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${active ? 'text-foreground' : color}`} />
                {label}
              </Link>
            </li>
          )
        })}
      </ul>

      {/* Footer card */}
      <div className="px-3 pb-4">
        <div className="rounded-lg border border-border bg-white/5 p-3">
          <p className="text-xs font-medium text-foreground mb-0.5">Portfolio CMS</p>
          <p className="text-[11px] text-muted-foreground">Manage your content</p>
        </div>
      </div>
    </nav>
  )

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-sidebar-bg border border-border text-foreground"
        aria-label="Open menu"
      >
        <Menu className="h-4 w-4" />
      </button>

      {/* Mobile overlay */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`md:hidden fixed inset-y-0 left-0 z-50 w-60 bg-sidebar-bg border-r border-border transition-transform ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 p-1 text-muted-foreground hover:text-foreground"
          aria-label="Close menu"
        >
          <X className="h-4 w-4" />
        </button>
        {sidebar}
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 shrink-0 flex-col bg-sidebar-bg border-r border-border h-screen sticky top-0">
        {sidebar}
      </aside>
    </>
  )
}
