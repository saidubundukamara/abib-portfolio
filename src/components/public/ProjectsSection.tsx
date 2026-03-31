import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import SectionHeading from './SectionHeading'
import FadeContent from './FadeContent'
import type { SerializedProject } from '@/types'

interface Props {
  projects: SerializedProject[]
}

export default function ProjectsSection({ projects }: Props) {
  return (
    <section id="projects" className="py-12 lg:py-16">
      <SectionHeading white="RECENT" ghost="PROJECTS" />

      {projects.length === 0 ? (
        <p className="text-text-muted text-sm">No projects yet.</p>
      ) : (
        <div>
          {projects.map((project, i) => (
            <FadeContent key={project._id} duration={600} delay={i * 60} ease="power2.out">
              <Link
                href={`/work/${project.slug}`}
                className="flex items-center gap-4 py-5 border-b border-[rgba(255,255,255,0.06)]
                  hover:bg-[rgba(255,255,255,0.02)] transition-colors group"
              >
                {/* Thumbnail */}
                <div className="relative shrink-0 w-[72px] h-[72px] rounded-lg overflow-hidden bg-[rgba(255,255,255,0.05)]">
                  {project.coverImageUrl && (
                    <Image
                      src={project.coverImageUrl}
                      alt={project.title}
                      fill
                      className="object-cover"
                      sizes="72px"
                    />
                  )}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-text-primary text-base leading-snug">
                    {project.title}
                  </h3>
                  {project.excerpt && (
                    <p className="text-text-secondary text-sm mt-0.5 truncate">
                      {project.excerpt}
                    </p>
                  )}
                </div>

                {/* Arrow */}
                <ArrowUpRight size={18} className="text-accent-orange shrink-0" />
              </Link>
            </FadeContent>
          ))}
        </div>
      )}
    </section>
  )
}
