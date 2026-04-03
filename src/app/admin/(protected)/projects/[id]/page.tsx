import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { toSerializedProject } from '@/lib/adapters'
import ProjectForm from '@/components/admin/ProjectForm'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = { title: 'Edit Project' }

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params

  const project = await prisma.project.findUnique({ where: { id } })
  if (!project) notFound()

  return (
    <div>
      <h1 className="text-xl font-semibold text-foreground mb-6">Edit Project</h1>
      <ProjectForm initialData={toSerializedProject(project)} />
    </div>
  )
}
