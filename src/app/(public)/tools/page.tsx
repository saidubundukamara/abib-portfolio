import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { toSerializedTool } from '@/lib/adapters'
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
    const rows = await prisma.tool.findMany({ orderBy: { order: 'asc' } })
    tools = rows.map(toSerializedTool)
  } catch {
    // DB not connected
  }

  return (
    <TwoColLayout>
      <ToolsSection tools={tools} />
    </TwoColLayout>
  )
}
