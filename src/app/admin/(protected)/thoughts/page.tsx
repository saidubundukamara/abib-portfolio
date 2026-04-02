import { connectDB } from '@/lib/mongodb'
import { DesignThought } from '@/models/DesignThought'
import { serialize } from '@/lib/serialize'
import { ThoughtsTable } from '@/components/admin/ThoughtsTable'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { SerializedThought } from '@/types'

export const metadata: Metadata = { title: 'Thoughts' }

export default async function ThoughtsPage() {
  await connectDB()
  const thoughts = serialize(await DesignThought.find().sort({ createdAt: -1 }).lean()) as SerializedThought[]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Thoughts</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{thoughts.length} total</p>
        </div>
        <Link
          href="/admin/thoughts/new"
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
        >
          + New Thought
        </Link>
      </div>

      <ThoughtsTable thoughts={thoughts} />
    </div>
  )
}
