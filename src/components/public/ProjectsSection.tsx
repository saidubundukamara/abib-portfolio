import Link from 'next/link'
import ProjectCard from './ProjectCard'
import type { SerializedProject } from '@/types'

interface Props {
  projects: SerializedProject[]
  title?: string
  showViewAll?: boolean
}

export default function ProjectsSection({
  projects,
  title = 'RECENT PROJECTS',
  showViewAll = true,
}: Props) {
  return (
    <section className="py-20 px-4 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-end justify-between mb-10">
        <h2 className="font-bold uppercase tracking-[-0.04em] text-text-secondary text-xs sm:text-sm">
          {title}
        </h2>
        {showViewAll && (
          <Link
            href="/work"
            className="bg-accent-orange hover:bg-accent-lime text-white font-display font-bold
              text-[13px] rounded-btn px-4 py-2 transition-colors duration-200"
          >
            View All Work
          </Link>
        )}
      </div>

      {projects.length === 0 ? (
        <p className="text-text-muted text-sm">No projects yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}
    </section>
  )
}
