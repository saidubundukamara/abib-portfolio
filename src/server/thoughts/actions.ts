'use server'

import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'
import { connectDB } from '@/lib/mongodb'
import { DesignThought } from '@/models/DesignThought'
import { serialize } from '@/lib/serialize'
import { z } from 'zod'
import slugify from 'slugify'

const ThoughtSchema = z.object({
  title:         z.string().min(1, 'Title is required'),
  excerpt:       z.string().min(1, 'Excerpt is required'),
  content:       z.any().optional(),
  coverImageUrl: z.string().optional().default(''),
  published:     z.boolean().optional().default(false),
  metadata: z.object({
    ogTitle:       z.string().optional().default(''),
    ogDescription: z.string().optional().default(''),
    ogImage:       z.string().optional().default(''),
  }).optional().default({ ogTitle: '', ogDescription: '', ogImage: '' }),
})

async function requireAdmin() {
  const session = await auth()
  if (!session) throw new Error('Unauthorized')
}

function revalidate() {
  revalidatePath('/thoughts')
  revalidatePath('/thoughts/[slug]', 'page')
  revalidatePath('/admin/thoughts')
  revalidatePath('/')
}

export async function createThought(data: unknown) {
  await requireAdmin()

  const parsed = ThoughtSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  try {
    await connectDB()
    const slug = slugify(parsed.data.title, { lower: true, strict: true })
    const thought = await DesignThought.create({ ...parsed.data, slug })
    revalidate()
    return { success: true, data: serialize(thought.toObject()) }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to create thought'
    return { success: false, error: msg }
  }
}

export async function updateThought(id: string, data: unknown) {
  await requireAdmin()

  const parsed = ThoughtSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  try {
    await connectDB()
    // Use .save() so pre-save hook recalculates readTime
    const thought = await DesignThought.findById(id)
    if (!thought) return { success: false, error: 'Thought not found' }

    Object.assign(thought, parsed.data)
    await thought.save()
    revalidate()
    return { success: true, data: serialize(thought.toObject()) }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to update thought'
    return { success: false, error: msg }
  }
}

export async function deleteThought(id: string) {
  await requireAdmin()

  try {
    await connectDB()
    await DesignThought.findByIdAndDelete(id)
    revalidate()
    return { success: true }
  } catch {
    return { success: false, error: 'Failed to delete thought' }
  }
}

export async function toggleThoughtPublish(id: string, published: boolean) {
  await requireAdmin()

  try {
    await connectDB()
    await DesignThought.findByIdAndUpdate(id, {
      published,
      publishedAt: published ? new Date() : null,
    })
    revalidate()
    return { success: true }
  } catch {
    return { success: false, error: 'Failed to update publish status' }
  }
}
