import ThoughtForm from '@/components/admin/ThoughtForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'New Thought' }

export default function NewThoughtPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-foreground mb-6">New Thought</h1>
      <ThoughtForm />
    </div>
  )
}
