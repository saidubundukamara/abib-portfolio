'use client'

import { useState, useEffect, useTransition } from 'react'
import { DataTable } from '@/components/admin/DataTable'
import DeleteButton from '@/components/admin/DeleteButton'
import ToolForm from '@/components/admin/ToolForm'
import { deleteTool } from '@/server/tools/actions'
import Image from 'next/image'
import type { ColumnDef } from '@tanstack/react-table'
import type { SerializedTool } from '@/types'

// Client component since we show inline add/edit panel without full page navigation
export default function ToolsPage() {
  const [tools, setTools] = useState<SerializedTool[]>([])
  const [editing, setEditing] = useState<SerializedTool | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [, startTransition] = useTransition()

  async function loadTools() {
    const res = await fetch('/api/admin/tools')
    if (res.ok) setTools(await res.json())
  }

  useEffect(() => { loadTools() }, [])

  function handleDone() {
    setShowForm(false)
    setEditing(null)
    startTransition(() => { loadTools() })
  }

  const columns: ColumnDef<SerializedTool>[] = [
    {
      accessorKey: 'name',
      header: 'Tool',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          {row.original.logoUrl && (
            <Image
              src={row.original.logoUrl}
              alt={row.original.name}
              width={24}
              height={24}
              className="rounded object-contain"
            />
          )}
          <span className="font-medium text-foreground">{row.original.name}</span>
        </div>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => (
        <span className="text-muted-foreground text-xs">{row.original.category || '—'}</span>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm truncate max-w-xs block">
          {row.original.description || '—'}
        </span>
      ),
    },
    {
      accessorKey: 'order',
      header: 'Order',
      size: 80,
      cell: ({ row }) => (
        <span className="text-muted-foreground text-xs">{row.original.order}</span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      size: 120,
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setEditing(row.original); setShowForm(true) }}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Edit
          </button>
          <DeleteButton
            action={async () => {
              const result = await deleteTool(row.original.id)
              if (result.success) await loadTools()
              return result
            }}
          />
        </div>
      ),
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Tools</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{tools.length} total</p>
        </div>
        <button
          onClick={() => { setEditing(null); setShowForm(true) }}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
        >
          + Add Tool
        </button>
      </div>

      {showForm && (
        <div className="rounded-xl border border-border bg-card p-5 mb-6">
          <h2 className="text-sm font-semibold text-foreground mb-4">
            {editing ? 'Edit Tool' : 'Add Tool'}
          </h2>
          <ToolForm initialData={editing ?? undefined} onDone={handleDone} />
        </div>
      )}

      <DataTable columns={columns} data={tools} searchPlaceholder="Search tools…" />
    </div>
  )
}
