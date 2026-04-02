import { connectDB } from '@/lib/mongodb'
import { ContactMessage } from '@/models/ContactMessage'
import { serialize } from '@/lib/serialize'
import { MessagesTable } from '@/components/admin/MessagesTable'
import type { Metadata } from 'next'
import type { SerializedContactMessage } from '@/types'

export const metadata: Metadata = { title: 'Messages' }

export default async function MessagesPage() {
  await connectDB()
  const messages = serialize(
    await ContactMessage.find().sort({ createdAt: -1 }).lean()
  ) as SerializedContactMessage[]

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
