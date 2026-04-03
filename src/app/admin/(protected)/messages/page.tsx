import { prisma } from '@/lib/prisma'
import { toSerializedMessage } from '@/lib/adapters'
import { MessagesTable } from '@/components/admin/MessagesTable'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Messages' }

export default async function MessagesPage() {
  const rows = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } })
  const messages = rows.map(toSerializedMessage)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Messages</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{messages.length} total</p>
        </div>
      </div>

      <MessagesTable messages={messages} />
    </div>
  )
}
