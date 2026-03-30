import { ArrowUpRight } from 'lucide-react'
import SectionHeading from './SectionHeading'

const experiences = [
  {
    company: 'Freelance',
    role:    'Senior Brand Designer',
    period:  'Jan 2022 – Present',
    desc:    'End-to-end brand identities, motion graphics, and social campaigns for global clients.',
  },
  {
    company: 'Creative Studio',
    role:    'Graphic & Motion Designer',
    period:  'Jun 2020 – Dec 2021',
    desc:    'Led visual design for campaigns across print, digital, and video channels.',
  },
  {
    company: 'Design Agency',
    role:    'Junior Designer',
    period:  'Mar 2018 – May 2020',
    desc:    'Assisted senior designers on logo, packaging, and event flyer projects.',
  },
]

export default function ExperienceSection() {
  return (
    <section id="experience" className="py-12 lg:py-16">
      <SectionHeading white="YEARS OF" ghost="EXPERIENCE" />

      <div>
        {experiences.map(({ company, role, desc, period }, i) => (
          <div
            key={i}
            className="relative py-5 border-b border-[rgba(255,255,255,0.06)] pr-8"
          >
            <ArrowUpRight
              size={16}
              className="absolute top-5 right-0 text-accent-orange"
            />
            <h3 className="font-bold text-text-primary text-base">{company}</h3>
            <p className="text-text-secondary text-sm mt-1 leading-relaxed">{desc}</p>
            <time className="text-text-secondary text-xs mt-2 block">{period}</time>
          </div>
        ))}
      </div>
    </section>
  )
}
