'use client'

import { DataTable } from '@/components/admin/DataTable'
import { format } from 'date-fns'
import type { ColumnDef } from '@tanstack/react-table'
import type { SerializedContactMessage } from '@/types'

const columns: ColumnDef<SerializedContactMessage>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <span className="font-medium text-foreground">{row.original.name}</span>
    ),
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => (
      <a
        href={`mailto:${row.original.email}`}
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        {row.original.email}
      </a>
    ),
  },
  {
    accessorKey: 'budget',
    header: 'Budget',
    cell: ({ row }) => (
      <span className="text-muted-foreground text-xs">
        {row.original.budget || '—'}
      </span>
    ),
  },
  {
    accessorKey: 'message',
    header: 'Message',
    cell: ({ row }) => (
      <span
        className="text-sm text-muted-foreground"
        title={row.original.message}
      >
        {row.original.message.length > 80
          ? row.original.message.slice(0, 80) + '…'
          : row.original.message}
      </span>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Received',
    cell: ({ row }) =>
      row.original.createdAt
        ? format(new Date(row.original.createdAt), 'MMM d, yyyy')
        : '—',
  },
]

export function MessagesTable({ messages }: { messages: SerializedContactMessage[] }) {
  return <DataTable columns={columns} data={messages} searchPlaceholder="Search messages…" />
}
