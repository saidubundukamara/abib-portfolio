import type { Metadata } from 'next'
import { connectDB } from '@/lib/mongodb'
import { serialize } from '@/lib/serialize'
import { Tool } from '@/models/Tool'
import TwoColLayout from '@/components/public/TwoColLayout'
import ToolsSection from '@/components/public/ToolsSection'

export const metadata: Metadata = {
  title: 'Tools',
  description: 'The tools and software I use to create great work.',
}

export default async function ToolsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let tools: any[] = []
  try {
    await connectDB()
    tools = await Tool.find().sort({ order: 1 }).lean()
  } catch {
    // DB not connected
  }

  return (
    <TwoColLayout>
      <ToolsSection tools={serialize(tools)} />
    </TwoColLayout>
  )
}
