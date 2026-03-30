import { notFound } from 'next/navigation'
import { connectDB } from '@/lib/mongodb'
import { DesignThought } from '@/models/DesignThought'
import { serialize } from '@/lib/serialize'
import ThoughtForm from '@/components/admin/ThoughtForm'
import type { Metadata } from 'next'
import type { SerializedThought } from '@/types'

interface Props {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = { title: 'Edit Thought' }

export default async function EditThoughtPage({ params }: Props) {
  const { id } = await params

  await connectDB()
  const thought = await DesignThought.findById(id).lean()
  if (!thought) notFound()

  return (
    <div>
      <h1 className="text-xl font-semibold text-foreground mb-6">Edit Thought</h1>
      <ThoughtForm initialData={serialize(thought) as SerializedThought} />
    </div>
  )
}
