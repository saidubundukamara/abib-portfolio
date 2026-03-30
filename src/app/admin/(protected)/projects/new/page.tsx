import ProjectForm from '@/components/admin/ProjectForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'New Project' }

export default function NewProjectPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-foreground mb-6">New Project</h1>
      <ProjectForm />
    </div>
  )
}
