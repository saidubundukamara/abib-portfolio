import { prisma } from '@/lib/prisma'
import { toSerializedProject } from '@/lib/adapters'
import { ProjectsTable } from '@/components/admin/ProjectsTable'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Projects' }

export default async function ProjectsPage() {
  const rows = await prisma.project.findMany({ orderBy: { createdAt: 'desc' } })
  const projects = rows.map(toSerializedProject)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Projects</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{projects.length} total</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
        >
          + New Project
        </Link>
      </div>

      <ProjectsTable projects={projects} />
    </div>
  )
}
