'use server'

import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'
import { connectDB } from '@/lib/mongodb'
import { Project, PROJECT_CATEGORY_VALUES } from '@/models/Project'
import { serialize } from '@/lib/serialize'
import { z } from 'zod'
import slugify from 'slugify'

const ProjectSchema = z.object({
  title:         z.string().min(1, 'Title is required'),
  excerpt:       z.string().min(1, 'Excerpt is required'),
  content:       z.any().optional(),
  category:      z.enum(PROJECT_CATEGORY_VALUES),
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
    await connectDB()
    const slug = slugify(parsed.data.title, { lower: true, strict: true })
    await Project.create({ ...parsed.data, slug })
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
    await connectDB()
    const project = await Project.findByIdAndUpdate(
      id,
      { $set: parsed.data },
      { new: true },
    )
    if (!project) return { success: false, error: 'Project not found' }
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
    await connectDB()
    await Project.findByIdAndDelete(id)
    revalidate()
    return { success: true }
  } catch {
    return { success: false, error: 'Failed to delete project' }
  }
}

export async function toggleProjectPublish(id: string, published: boolean) {
  await requireAdmin()

  try {
    await connectDB()
    await Project.findByIdAndUpdate(id, {
      published,
      publishedAt: published ? new Date() : null,
    })
    revalidate()
    return { success: true }
  } catch {
    return { success: false, error: 'Failed to update publish status' }
  }
}
