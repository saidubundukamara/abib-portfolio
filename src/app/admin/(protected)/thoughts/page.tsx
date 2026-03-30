import { connectDB } from '@/lib/mongodb'
import { DesignThought } from '@/models/DesignThought'
import { serialize } from '@/lib/serialize'
import { DataTable } from '@/components/admin/DataTable'
import DeleteButton from '@/components/admin/DeleteButton'
import { deleteThought, toggleThoughtPublish } from '@/server/thoughts/actions'
import Link from 'next/link'
import { format } from 'date-fns'
import type { Metadata } from 'next'
import type { ColumnDef } from '@tanstack/react-table'
import type { SerializedThought } from '@/types'

export const metadata: Metadata = { title: 'Thoughts' }

export default async function ThoughtsPage() {
  await connectDB()
  const thoughts = serialize(await DesignThought.find().sort({ createdAt: -1 }).lean()) as SerializedThought[]

  const columns: ColumnDef<SerializedThought>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => (
        <Link
          href={`/admin/thoughts/${row.original._id}`}
          className="font-medium text-foreground hover:text-primary transition-colors"
        >
          {row.original.title}
        </Link>
      ),
    },
    {
      accessorKey: 'readTime',
      header: 'Read Time',
      cell: ({ row }) => (
        <span className="text-muted-foreground text-xs">{row.original.readTime} min</span>
      ),
    },
    {
      accessorKey: 'published',
      header: 'Status',
      cell: ({ row }) => (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
            row.original.published
              ? 'bg-cyan-500/15 text-cyan-400'
              : 'bg-amber-500/15 text-amber-400'
          }`}
        >
          {row.original.published ? 'Published' : 'Draft'}
        </span>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }) =>
        row.original.createdAt
          ? format(new Date(row.original.createdAt), 'MMM d, yyyy')
          : '—',
    },
    {
      id: 'actions',
      header: 'Actions',
      size: 180,
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Link
            href={`/admin/thoughts/${row.original._id}`}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Edit
          </Link>
          <PublishToggle thought={row.original} />
          <DeleteButton action={() => deleteThought(row.original._id)} />
        </div>
      ),
    },
  ]

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

      <DataTable columns={columns} data={thoughts} searchPlaceholder="Search thoughts…" />
    </div>
  )
}

function PublishToggle({ thought }: { thought: SerializedThought }) {
  return (
    <form
      action={async () => {
        'use server'
        await toggleThoughtPublish(thought._id, !thought.published)
      }}
    >
      <button type="submit" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
        {thought.published ? 'Unpublish' : 'Publish'}
      </button>
    </form>
  )
}
