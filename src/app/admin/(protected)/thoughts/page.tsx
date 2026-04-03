import { prisma } from '@/lib/prisma'
import { toSerializedThought } from '@/lib/adapters'
import { ThoughtsTable } from '@/components/admin/ThoughtsTable'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Thoughts' }

export default async function ThoughtsPage() {
  const rows = await prisma.designThought.findMany({ orderBy: { createdAt: 'desc' } })
  const thoughts = rows.map(toSerializedThought)

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
