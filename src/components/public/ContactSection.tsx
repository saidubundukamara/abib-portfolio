'use client'

import { useActionState } from 'react'
import { submitContactMessage } from '@/server/contact/actions'
import SectionHeading from './SectionHeading'

const budgetOptions = [
  'Under $500',
  '$500 – $2,000',
  '$2,000 – $5,000',
  '$5,000+',
]

const inputClass =
  'w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-btn px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-orange transition-colors'

export default function ContactSection() {
  const [state, action, pending] = useActionState(submitContactMessage, null)

  if (state?.success) {
    return (
      <section id="contact" className="py-12 lg:py-16">
        <SectionHeading white="LET'S WORK" ghost="TOGETHER" />
        <div className="rounded-card border border-[rgba(255,255,255,0.08)] p-10 bg-[rgba(255,255,255,0.03)] text-center">
          <p className="text-2xl font-bold text-text-primary mb-2">Message sent! 🎉</p>
          <p className="text-text-secondary text-sm">I&apos;ll get back to you within 24 hours.</p>
        </div>
        <Footer />
      </section>
    )
  }

  return (
    <section id="contact" className="py-12 lg:py-16">
      <SectionHeading white="LET'S WORK" ghost="TOGETHER" />

      <form action={action} className="flex flex-col gap-4">
        {/* Name + Email row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-text-secondary text-xs">Name</label>
            <input
              name="name"
              type="text"
              placeholder="Your Name"
              required
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-text-secondary text-xs">Email</label>
            <input
              name="email"
              type="email"
              placeholder="Your@email.com"
              required
              className={inputClass}
            />
          </div>
        </div>

        {/* Budget */}
        <div className="flex flex-col gap-1">
          <label className="text-text-secondary text-xs">Budget</label>
          <select name="budget" className={inputClass} defaultValue="">
            <option value="" disabled className="bg-[rgb(21,19,18)]">
              Select...
            </option>
            {budgetOptions.map((opt) => (
              <option key={opt} value={opt} className="bg-[rgb(21,19,18)]">
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Message */}
        <div className="flex flex-col gap-1">
          <label className="text-text-secondary text-xs">Message</label>
          <textarea
            name="message"
            placeholder="Message"
            required
            rows={5}
            className={`${inputClass} resize-none`}
          />
        </div>

        {state?.error && (
          <p className="text-red-400 text-sm">{state.error}</p>
        )}

        {/* Full-width submit */}
        <button
          type="submit"
          disabled={pending}
          className="w-full bg-accent-orange hover:bg-accent-lime disabled:opacity-60
            text-white font-display font-bold text-sm rounded-btn py-4
            transition-colors duration-200"
        >
          {pending ? 'Sending…' : 'Submit'}
        </button>
      </form>

      <Footer />
    </section>
  )
}

function Footer() {
  return (
    <p className="text-text-secondary text-xs text-center mt-16 pb-8">
      Made by Abib &nbsp;·&nbsp; Portfolio {new Date().getFullYear()}
    </p>
  )
}
