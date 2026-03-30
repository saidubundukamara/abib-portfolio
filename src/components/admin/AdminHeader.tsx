'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'
import { logoutAction } from '@/server/auth/actions'

interface Props {
  user: { name?: string | null; email?: string | null }
}

function getBreadcrumb(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean)
  return segments
    .slice(1) // drop 'admin'
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' / ')
}

function getInitials(name?: string | null, email?: string | null): string {
  if (name) return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
  if (email) return email[0].toUpperCase()
  return 'A'
}

export default function AdminHeader({ user }: Props) {
  const pathname = usePathname()
  const breadcrumb = getBreadcrumb(pathname)
  const [isDark, setIsDark] = useState(true)

  // Apply .dark class to the admin shell root — the layout already sets it,
  // this toggle allows switching between dark/light within the admin.
  useEffect(() => {
    const shell = document.getElementById('admin-shell')
    if (!shell) return
    if (isDark) {
      shell.classList.add('dark')
    } else {
      shell.classList.remove('dark')
    }
  }, [isDark])

  return (
    <header className="h-14 shrink-0 border-b border-border flex items-center justify-between px-6 bg-background">
      <span className="text-sm text-muted-foreground">{breadcrumb || 'Dashboard'}</span>

      <div className="flex items-center gap-3">
        {/* Theme toggle */}
        <button
          onClick={() => setIsDark((v) => !v)}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
          aria-label="Toggle theme"
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-semibold select-none">
            {getInitials(user.name, user.email)}
          </div>
          <span className="text-sm text-muted-foreground hidden sm:block">
            {user.name ?? user.email}
          </span>
        </div>

        <form action={logoutAction}>
          <button
            type="submit"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign out
          </button>
        </form>
      </div>
    </header>
  )
}
