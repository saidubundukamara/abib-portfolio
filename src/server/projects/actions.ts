'use server'

import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import slugify from 'slugify'
import { PROJECT_CATEGORIES } from '@/lib/categories'

const ProjectSchema = z.object({
  title:         z.string().min(1, 'Title is required'),
  excerpt:       z.string().min(1, 'Excerpt is required'),
  content:       z.any().optional(),
  category:      z.enum(PROJECT_CATEGORIES),
  coverImageUrl: z.string().optional().default(''),
  images:        z.array(z.string()).optional().default([]),
  tools:         z.array(z.string()).optional().default([]),
  featured:      z.boolean().optional().default(false),
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
  revalidatePath('/work')
  revalidatePath('/work/[slug]', 'page')
  revalidatePath('/admin/projects')
  revalidatePath('/')
}

export async function createProject(data: unknown) {
  await requireAdmin()

  const parsed = ProjectSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  try {
    const { metadata, ...rest } = parsed.data
    const slug = slugify(parsed.data.title, { lower: true, strict: true })
    await prisma.project.create({
      data: {
        ...rest,
        slug,
        publishedAt:   rest.published ? new Date() : null,
        ogTitle:       metadata.ogTitle,
        ogDescription: metadata.ogDescription,
        ogImage:       metadata.ogImage,
      },
    })
    revalidate()
    return { success: true }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to create project'
    return { success: false, error: msg }
  }
}

export async function updateProject(id: string, data: unknown) {
  await requireAdmin()

  const parsed = ProjectSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  try {
    const { metadata, ...rest } = parsed.data

    // Replicate the Mongoose pre-save publishedAt hook:
    // only set publishedAt when first transitioning to published
    const existing = await prisma.project.findUnique({
      where:  { id },
      select: { published: true, publishedAt: true },
    })
    if (!existing) return { success: false, error: 'Project not found' }

    const publishedAt =
      !existing.published && rest.published && !existing.publishedAt
        ? new Date()
        : rest.published
        ? existing.publishedAt
        : null

    await prisma.project.update({
      where: { id },
      data: {
        ...rest,
        publishedAt,
        ogTitle:       metadata.ogTitle,
        ogDescription: metadata.ogDescription,
        ogImage:       metadata.ogImage,
      },
    })
    revalidate()
    return { success: true }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to update project'
    return { success: false, error: msg }
  }
}

export async function deleteProject(id: string) {
  await requireAdmin()

  try {
    await prisma.project.delete({ where: { id } })
    revalidate()
    return { success: true }
  } catch {
    return { success: false, error: 'Failed to delete project' }
  }
}

export async function toggleProjectPublish(id: string, published: boolean) {
  await requireAdmin()

  try {
    await prisma.project.update({
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
