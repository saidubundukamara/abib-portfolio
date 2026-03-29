'use client'

import { useActionState } from 'react'
import { submitContactMessage } from '@/server/contact/actions'

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
      <section id="contact" className="py-20 px-4 max-w-2xl mx-auto text-center">
        <h2 className="font-bold uppercase tracking-[-0.04em] text-text-secondary text-xs sm:text-sm mb-6">
          Let&apos;s Work Together
        </h2>
        <div className="rounded-card border border-[rgba(255,255,255,0.08)] p-10 bg-[rgba(255,255,255,0.03)]">
          <p className="text-2xl font-bold text-text-primary mb-2">Message sent! 🎉</p>
          <p className="text-text-secondary text-sm">I&apos;ll get back to you within 24 hours.</p>
        </div>
      </section>
    )
  }

  return (
    <section id="contact" className="py-20 px-4 max-w-2xl mx-auto">
      <h2 className="font-bold uppercase tracking-[-0.04em] text-text-secondary text-xs sm:text-sm mb-3">
        Let&apos;s Work Together
      </h2>
      <p className="text-text-secondary text-sm mb-10">
        Have a project in mind? Fill out the form and I&apos;ll get back to you.
      </p>

      <form action={action} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            name="name"
            type="text"
            placeholder="Your name"
            required
            className={inputClass}
          />
          <input
            name="email"
            type="email"
            placeholder="your@email.com"
            required
            className={inputClass}
          />
        </div>

        <select name="budget" className={inputClass} defaultValue="">
          <option value="" disabled className="bg-[rgb(21,19,18)]">
            Budget range
          </option>
          {budgetOptions.map((opt) => (
            <option key={opt} value={opt} className="bg-[rgb(21,19,18)]">
              {opt}
            </option>
          ))}
        </select>

        <textarea
          name="message"
          placeholder="Tell me about your project…"
          required
          rows={5}
          className={`${inputClass} resize-none`}
        />

        {state?.error && (
          <p className="text-red-400 text-sm">{state.error}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="bg-accent-orange hover:bg-accent-lime disabled:opacity-60
            text-white font-display font-bold text-sm rounded-btn px-6 py-3
            transition-colors duration-200 self-start"
        >
          {pending ? 'Sending…' : 'Send Message'}
        </button>
      </form>
    </section>
  )
}
