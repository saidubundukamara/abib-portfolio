import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { toSerializedThought } from '@/lib/adapters'
import ThoughtForm from '@/components/admin/ThoughtForm'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = { title: 'Edit Thought' }

export default async function EditThoughtPage({ params }: Props) {
  const { id } = await params

  const thought = await prisma.designThought.findUnique({ where: { id } })
  if (!thought) notFound()

  return (
    <div>
      <h1 className="text-xl font-semibold text-foreground mb-6">Edit Thought</h1>
      <ThoughtForm initialData={toSerializedThought(thought)} />
    </div>
  )
}
