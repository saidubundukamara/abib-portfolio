'use client'

import { DataTable } from '@/components/admin/DataTable'
import DeleteButton from '@/components/admin/DeleteButton'
import { deleteProject, toggleProjectPublish } from '@/server/projects/actions'
import { CATEGORY_LABELS } from '@/lib/categories'
import Link from 'next/link'
import { format } from 'date-fns'
import type { ColumnDef } from '@tanstack/react-table'
import type { SerializedProject } from '@/types'

function PublishToggle({ project }: { project: SerializedProject }) {
  const action = toggleProjectPublish.bind(null, project._id, !project.published)
  return (
    <form action={action}>
      <button type="submit" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
        {project.published ? 'Unpublish' : 'Publish'}
      </button>
    </form>
  )
}

const columns: ColumnDef<SerializedProject>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => (
      <Link
        href={`/admin/projects/${row.original._id}`}
        className="font-medium text-foreground hover:text-primary transition-colors"
      >
        {row.original.title}
      </Link>
    ),
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => (
      <span className="text-muted-foreground text-xs">
        {CATEGORY_LABELS[row.original.category as keyof typeof CATEGORY_LABELS] ?? row.original.category}
      </span>
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
          href={`/admin/projects/${row.original._id}`}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Edit
        </Link>
        <PublishToggle project={row.original} />
        <DeleteButton action={() => deleteProject(row.original._id)} />
      </div>
    ),
  },
]

export function ProjectsTable({ projects }: { projects: SerializedProject[] }) {
  return <DataTable columns={columns} data={projects} searchPlaceholder="Search projects…" />
}
