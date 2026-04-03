import Link from 'next/link'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { toSerializedProject } from '@/lib/adapters'
import { PROJECT_CATEGORIES, CATEGORY_LABELS } from '@/lib/categories'
import TwoColLayout from '@/components/public/TwoColLayout'
import SectionHeading from '@/components/public/SectionHeading'
import ProjectCard from '@/components/public/ProjectCard'
import FadeContent from '@/components/public/FadeContent'

export const metadata: Metadata = {
  title: 'Work',
  description: 'Explore my portfolio of design projects.',
}

interface Props {
  searchParams: Promise<{ category?: string }>
}

export default async function WorkPage({ searchParams }: Props) {
  const { category } = await searchParams

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let projects: any[] = []
  try {
    const rows = await prisma.project.findMany({
      where:   { published: true, ...(category ? { category } : {}) },
      orderBy: { publishedAt: 'desc' },
    })
    projects = rows.map(toSerializedProject)
  } catch {
    // DB not connected
  }

  return (
    <TwoColLayout>
      <FadeContent duration={700} ease="power2.out">
        <SectionHeading white="RECENT" ghost="PROJECTS" />

        {/* Category filter tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          <Link
            href="/work"
            className={`px-4 py-2 rounded-btn text-sm font-medium transition-colors duration-200 ${
              !category
                ? 'bg-accent-orange text-white'
                : 'bg-[rgba(255,255,255,0.05)] text-text-secondary hover:text-text-primary border border-[rgba(255,255,255,0.08)]'
            }`}
          >
            All
          </Link>
          {PROJECT_CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/work?category=${cat}`}
              className={`px-4 py-2 rounded-btn text-sm font-medium transition-colors duration-200 ${
                category === cat
                  ? 'bg-accent-orange text-white'
                  : 'bg-[rgba(255,255,255,0.05)] text-text-secondary hover:text-text-primary border border-[rgba(255,255,255,0.08)]'
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </Link>
          ))}
        </div>
      </FadeContent>

      {/* Grid */}
      {projects.length === 0 ? (
        <p className="text-text-muted text-sm">No projects found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <FadeContent key={project.id} duration={600} delay={i * 80} ease="power2.out">
              <ProjectCard project={project} />
            </FadeContent>
          ))}
        </div>
      )}
    </TwoColLayout>
  )
}
