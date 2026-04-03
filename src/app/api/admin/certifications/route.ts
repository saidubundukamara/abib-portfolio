import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { toSerializedCertification } from '@/lib/adapters'

export async function GET() {
  const session = await auth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const certs = await prisma.certification.findMany({ orderBy: { order: 'asc' } })
  return Response.json(certs.map(toSerializedCertification))
}
