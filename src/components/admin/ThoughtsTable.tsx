'use client'

import { DataTable } from '@/components/admin/DataTable'
import DeleteButton from '@/components/admin/DeleteButton'
import { deleteThought, toggleThoughtPublish } from '@/server/thoughts/actions'
import Link from 'next/link'
import { format } from 'date-fns'
import type { ColumnDef } from '@tanstack/react-table'
import type { SerializedThought } from '@/types'

function PublishToggle({ thought }: { thought: SerializedThought }) {
  async function action() {
    await toggleThoughtPublish(thought.id, !thought.published)
  }
  return (
    <form action={action}>
      <button type="submit" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
        {thought.published ? 'Unpublish' : 'Publish'}
      </button>
    </form>
  )
}

const columns: ColumnDef<SerializedThought>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => (
      <Link
        href={`/admin/thoughts/${row.original.id}`}
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
          href={`/admin/thoughts/${row.original.id}`}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Edit
        </Link>
        <PublishToggle thought={row.original} />
        <DeleteButton action={() => deleteThought(row.original.id)} />
      </div>
    ),
  },
]

export function ThoughtsTable({ thoughts }: { thoughts: SerializedThought[] }) {
  return <DataTable columns={columns} data={thoughts} searchPlaceholder="Search thoughts…" />
}
