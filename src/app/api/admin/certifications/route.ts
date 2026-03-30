import { auth } from '@/auth'
import { connectDB } from '@/lib/mongodb'
import { Certification } from '@/models/Certification'
import { serialize } from '@/lib/serialize'

export async function GET() {
  const session = await auth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()
  const certs = await Certification.find().sort({ order: 1 }).lean()
  return Response.json(serialize(certs))
}
