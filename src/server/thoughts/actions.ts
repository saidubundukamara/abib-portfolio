'use server'

import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { calcReadTime } from '@/lib/tiptap'
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
    const { metadata, ...rest } = parsed.data
    const slug     = slugify(parsed.data.title, { lower: true, strict: true })
    const readTime = calcReadTime(rest.content)

    await prisma.designThought.create({
      data: {
        ...rest,
        slug,
        readTime,
        publishedAt:   rest.published ? new Date() : null,
        ogTitle:       metadata.ogTitle,
        ogDescription: metadata.ogDescription,
        ogImage:       metadata.ogImage,
      },
    })
    revalidate()
    return { success: true }
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
    const { metadata, ...rest } = parsed.data
    const readTime = calcReadTime(rest.content)

    // Replicate the Mongoose pre-save publishedAt hook:
    // only set publishedAt when first transitioning to published
    const existing = await prisma.designThought.findUnique({
      where:  { id },
      select: { published: true, publishedAt: true },
    })
    if (!existing) return { success: false, error: 'Thought not found' }

    const publishedAt =
      !existing.published && rest.published && !existing.publishedAt
        ? new Date()
        : rest.published
        ? existing.publishedAt
        : null

    await prisma.designThought.update({
      where: { id },
      data: {
        ...rest,
        readTime,
        publishedAt,
        ogTitle:       metadata.ogTitle,
        ogDescription: metadata.ogDescription,
        ogImage:       metadata.ogImage,
      },
    })
    revalidate()
    return { success: true }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to update thought'
    return { success: false, error: msg }
  }
}

export async function deleteThought(id: string) {
  await requireAdmin()

  try {
    await prisma.designThought.delete({ where: { id } })
    revalidate()
    return { success: true }
  } catch {
    return { success: false, error: 'Failed to delete thought' }
  }
}

export async function toggleThoughtPublish(id: string, published: boolean) {
  await requireAdmin()

  try {
    await prisma.designThought.update({
      where: { id },
      data: {
        published,
        publishedAt: published ? new Date() : null,
      },
    })
    revalidate()
    return { success: true }
  } catch {
    return { success: false, error: 'Failed to update publish status' }
  }
}
