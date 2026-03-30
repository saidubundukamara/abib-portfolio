'use server'

import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'
import { connectDB } from '@/lib/mongodb'
import { Certification } from '@/models/Certification'
import { serialize } from '@/lib/serialize'
import { z } from 'zod'

const CertificationSchema = z.object({
  name:          z.string().min(1, 'Name is required'),
  issuer:        z.string().min(1, 'Issuer is required'),
  year:          z.number().int().min(1900).max(2100),
  credentialUrl: z.string().optional().default(''),
  badgeImageUrl: z.string().optional().default(''),
  order:         z.number().optional().default(0),
})

async function requireAdmin() {
  const session = await auth()
  if (!session) throw new Error('Unauthorized')
}

function revalidate() {
  revalidatePath('/admin/certifications')
  revalidatePath('/')
}

export async function createCertification(data: unknown) {
  await requireAdmin()

  const parsed = CertificationSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  try {
    await connectDB()
    const cert = await Certification.create(parsed.data)
    revalidate()
    return { success: true, data: serialize(cert.toObject()) }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to create certification'
    return { success: false, error: msg }
  }
}

export async function updateCertification(id: string, data: unknown) {
  await requireAdmin()

  const parsed = CertificationSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  try {
    await connectDB()
    const cert = await Certification.findByIdAndUpdate(id, { $set: parsed.data }, { new: true })
    if (!cert) return { success: false, error: 'Certification not found' }
    revalidate()
    return { success: true, data: serialize(cert.toObject()) }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to update certification'
    return { success: false, error: msg }
  }
}

export async function deleteCertification(id: string) {
  await requireAdmin()

  try {
    await connectDB()
    await Certification.findByIdAndDelete(id)
    revalidate()
    return { success: true }
  } catch {
    return { success: false, error: 'Failed to delete certification' }
  }
}
