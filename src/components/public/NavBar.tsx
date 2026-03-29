'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'Work',     href: '/work' },
  { label: 'Thoughts', href: '/thoughts' },
  { label: 'Contact',  href: '#contact' },
]

export default function NavBar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      <nav
        className="max-w-5xl mx-auto flex items-center justify-between px-6 py-3
          rounded-nav border border-[rgba(255,255,255,0.06)]
          bg-[rgba(255,255,255,0.03)] backdrop-blur-md"
      >
        {/* Logo */}
        <Link
          href="/"
          className="font-display font-bold text-text-primary text-sm tracking-wide"
        >
          Portfolio
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map(({ label, href }) => (
            <li key={label}>
              <Link
                href={href}
                className="text-[12px] font-normal text-text-secondary hover:text-text-primary transition-colors"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA button */}
        <Link
          href="#contact"
          className="hidden md:inline-flex items-center bg-accent-orange hover:bg-accent-lime
            text-white font-display font-bold text-[14px] rounded-btn px-5 py-2
            transition-colors duration-200"
        >
          Let&apos;s Talk
        </Link>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-text-secondary hover:text-text-primary"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden max-w-5xl mx-auto mt-2 rounded-nav border border-[rgba(255,255,255,0.06)]
            bg-[rgba(21,19,18,0.95)] backdrop-blur-md px-6 py-4 flex flex-col gap-4"
        >
          {navLinks.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setOpen(false)}
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              {label}
            </Link>
          ))}
          <Link
            href="#contact"
            onClick={() => setOpen(false)}
            className="inline-flex justify-center bg-accent-orange hover:bg-accent-lime
              text-white font-display font-bold text-sm rounded-btn px-5 py-2
              transition-colors duration-200"
          >
            Let&apos;s Talk
          </Link>
        </div>
      )}
    </header>
  )
}
