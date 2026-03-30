import { auth } from '@/auth'
import { connectDB } from '@/lib/mongodb'
import { Tool } from '@/models/Tool'
import { serialize } from '@/lib/serialize'

export async function GET() {
  const session = await auth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()
  const tools = await Tool.find().sort({ order: 1 }).lean()
  return Response.json(serialize(tools))
}
