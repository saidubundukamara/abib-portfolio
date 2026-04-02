import { connectDB } from '@/lib/mongodb'
import { Project } from '@/models/Project'
import { serialize } from '@/lib/serialize'
import { ProjectsTable } from '@/components/admin/ProjectsTable'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { SerializedProject } from '@/types'

export const metadata: Metadata = { title: 'Projects' }

export default async function ProjectsPage() {
  await connectDB()
  const projects = serialize(await Project.find().sort({ createdAt: -1 }).lean()) as SerializedProject[]

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
