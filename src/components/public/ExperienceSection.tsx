const experiences = [
  {
    company: 'Freelance',
    role:    'Senior Brand Designer',
    period:  '2022 — Present',
    desc:    'End-to-end brand identities, motion graphics, and social campaigns for global clients.',
  },
  {
    company: 'Creative Studio',
    role:    'Graphic & Motion Designer',
    period:  '2020 — 2022',
    desc:    'Led visual design for campaigns across print, digital, and video channels.',
  },
  {
    company: 'Design Agency',
    role:    'Junior Designer',
    period:  '2018 — 2020',
    desc:    'Assisted senior designers on logo, packaging, and event flyer projects.',
  },
]

export default function ExperienceSection() {
  return (
    <section className="py-20 px-4 max-w-5xl mx-auto">
      <h2 className="font-bold uppercase tracking-[-0.04em] text-text-secondary text-xs sm:text-sm mb-10">
        Experience
      </h2>

      <div className="relative flex flex-col gap-0 pl-6 border-l border-[rgba(255,255,255,0.1)]">
        {experiences.map(({ company, role, period, desc }, i) => (
          <div key={i} className="relative pb-10 last:pb-0">
            {/* Timeline dot */}
            <span className="absolute -left-[25px] top-1 w-3 h-3 rounded-full bg-accent-orange border-2 border-bg-primary" />

            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
              <div>
                <h3 className="font-semibold text-text-primary text-base">{role}</h3>
                <span className="text-text-secondary text-sm">{company}</span>
              </div>
              <time className="text-text-muted text-xs sm:text-sm shrink-0">{period}</time>
            </div>
            <p className="text-text-secondary text-sm mt-2 leading-relaxed max-w-lg">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
