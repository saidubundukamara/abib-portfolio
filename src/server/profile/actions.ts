'use server'

import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'
import { connectDB } from '@/lib/mongodb'
import { Profile } from '@/models/Profile'
import { serialize } from '@/lib/serialize'
import { z } from 'zod'

const ProfileSchema = z.object({
  name:  z.string().min(1, 'Name is required'),
  title: z.string().min(1, 'Title is required'),
  bio:   z.string().min(1, 'Bio is required'),
  avatarUrl: z.string().optional().default(''),
  socialLinks: z.object({
    dribbble:  z.string().optional().default(''),
    twitter:   z.string().optional().default(''),
    instagram: z.string().optional().default(''),
    email:     z.string().optional().default(''),
  }).optional().default({ dribbble: '', twitter: '', instagram: '', email: '' }),
  yearsOfExperience: z.number().optional().default(0),
  projectsCompleted: z.number().optional().default(0),
  worldwideClients:  z.number().optional().default(0),
})

export async function updateProfile(data: unknown) {
  const session = await auth()
  if (!session) throw new Error('Unauthorized')

  const parsed = ProfileSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  try {
    await connectDB()
    const profile = await Profile.findOneAndUpdate(
      {},
      { $set: parsed.data },
      { new: true, upsert: true },
    )
    revalidatePath('/')
    revalidatePath('/admin/profile')
    return { success: true, data: serialize(profile.toObject()) }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to update profile'
    return { success: false, error: msg }
  }
}
