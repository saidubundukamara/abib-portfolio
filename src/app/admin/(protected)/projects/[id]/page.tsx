import { notFound } from 'next/navigation'
import { connectDB } from '@/lib/mongodb'
import { Project } from '@/models/Project'
import { serialize } from '@/lib/serialize'
import ProjectForm from '@/components/admin/ProjectForm'
import type { Metadata } from 'next'
import type { SerializedProject } from '@/types'

interface Props {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = { title: 'Edit Project' }

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params

  await connectDB()
  const project = await Project.findById(id).lean()
  if (!project) notFound()

  return (
    <div>
      <h1 className="text-xl font-semibold text-foreground mb-6">Edit Project</h1>
      <ProjectForm initialData={serialize(project) as SerializedProject} />
    </div>
  )
}
