import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { toSerializedTool } from '@/lib/adapters'

export async function GET() {
  const session = await auth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const tools = await prisma.tool.findMany({ orderBy: { order: 'asc' } })
  return Response.json(tools.map(toSerializedTool))
}
