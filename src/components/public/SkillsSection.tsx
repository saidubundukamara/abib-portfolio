'use client'

const disciplines = [
  'Logo Design',
  'Brand Identity',
  'Motion Graphics',
  'Social Media Design',
  'Event Flyers',
  'UI / UX Design',
]

// Duplicate for seamless loop
const items = [...disciplines, ...disciplines]

export default function SkillsSection() {
  return (
    <section className="py-12 border-y border-[rgba(255,255,255,0.06)] overflow-hidden">
      <div className="flex animate-marquee">
        {items.map((item, i) => (
          <span
            key={i}
            className="shrink-0 flex items-center gap-6 mx-6 text-text-secondary font-semibold
              uppercase text-sm tracking-widest whitespace-nowrap"
          >
            {item}
            <span className="text-accent-orange text-lg" aria-hidden>★</span>
          </span>
        ))}
      </div>
    </section>
  )
}
