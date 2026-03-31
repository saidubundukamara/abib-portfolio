import Link from 'next/link'
import type { Metadata } from 'next'
import { connectDB } from '@/lib/mongodb'
import { serialize } from '@/lib/serialize'
import { Project } from '@/models/Project'
import { PROJECT_CATEGORIES, CATEGORY_LABELS } from '@/lib/categories'
import TwoColLayout from '@/components/public/TwoColLayout'
import SectionHeading from '@/components/public/SectionHeading'
import ProjectCard from '@/components/public/ProjectCard'

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
    await connectDB()
    const query = { published: true, ...(category ? { category } : {}) }
    projects = await Project.find(query).sort({ publishedAt: -1 }).lean()
  } catch {
    // DB not connected
  }

  return (
    <TwoColLayout>
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

      {/* Grid */}
      {projects.length === 0 ? (
        <p className="text-text-muted text-sm">No projects found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {serialize(projects).map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}
    </TwoColLayout>
  )
}
