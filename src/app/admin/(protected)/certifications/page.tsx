'use client'

import { useState, useEffect, useTransition } from 'react'
import { DataTable } from '@/components/admin/DataTable'
import DeleteButton from '@/components/admin/DeleteButton'
import CertificationForm from '@/components/admin/CertificationForm'
import { deleteCertification } from '@/server/certifications/actions'
import Image from 'next/image'
import type { ColumnDef } from '@tanstack/react-table'
import type { SerializedCertification } from '@/types'

export default function CertificationsPage() {
  const [certs, setCerts] = useState<SerializedCertification[]>([])
  const [editing, setEditing] = useState<SerializedCertification | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [, startTransition] = useTransition()

  async function loadCerts() {
    const res = await fetch('/api/admin/certifications')
    if (res.ok) setCerts(await res.json())
  }

  useEffect(() => { loadCerts() }, [])

  function handleDone() {
    setShowForm(false)
    setEditing(null)
    startTransition(() => { loadCerts() })
  }

  const columns: ColumnDef<SerializedCertification>[] = [
    {
      accessorKey: 'name',
      header: 'Certification',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          {row.original.badgeImageUrl && (
            <Image
              src={row.original.badgeImageUrl}
              alt={row.original.name}
              width={28}
              height={28}
              className="rounded object-contain"
            />
          )}
          <span className="font-medium text-foreground">{row.original.name}</span>
        </div>
      ),
    },
    {
      accessorKey: 'issuer',
      header: 'Issuer',
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">{row.original.issuer}</span>
      ),
    },
    {
      accessorKey: 'year',
      header: 'Year',
      size: 80,
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">{row.original.year}</span>
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
              const result = await deleteCertification(row.original.id)
              if (result.success) await loadCerts()
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
          <h1 className="text-xl font-semibold text-foreground">Certifications</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{certs.length} total</p>
        </div>
        <button
          onClick={() => { setEditing(null); setShowForm(true) }}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
        >
          + Add Certification
        </button>
      </div>

      {showForm && (
        <div className="rounded-xl border border-border bg-card p-5 mb-6">
          <h2 className="text-sm font-semibold text-foreground mb-4">
            {editing ? 'Edit Certification' : 'Add Certification'}
          </h2>
          <CertificationForm initialData={editing ?? undefined} onDone={handleDone} />
        </div>
      )}

      <DataTable columns={columns} data={certs} searchPlaceholder="Search certifications…" />
    </div>
  )
}
