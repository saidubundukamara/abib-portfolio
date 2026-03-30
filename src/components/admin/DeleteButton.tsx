'use client'

import { useTransition } from 'react'

interface Props {
  action: () => Promise<{ success: boolean; error?: string }>
  label?: string
}

export default function DeleteButton({ action, label = 'Delete' }: Props) {
  const [pending, startTransition] = useTransition()

  function handleClick() {
    if (!confirm('Are you sure? This cannot be undone.')) return
    startTransition(async () => {
      const result = await action()
      if (!result.success) alert(result.error ?? 'Delete failed')
    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      className="text-sm text-destructive hover:text-destructive/80 transition-colors disabled:opacity-50"
    >
      {pending ? 'Deleting…' : label}
    </button>
  )
}
