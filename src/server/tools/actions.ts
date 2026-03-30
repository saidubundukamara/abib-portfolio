'use server'

import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'
import { connectDB } from '@/lib/mongodb'
import { Tool } from '@/models/Tool'
import { serialize } from '@/lib/serialize'
import { z } from 'zod'

const ToolSchema = z.object({
  name:        z.string().min(1, 'Name is required'),
  description: z.string().optional().default(''),
  logoUrl:     z.string().optional().default(''),
  externalUrl: z.string().optional().default(''),
  category:    z.string().optional().default(''),
  order:       z.number().optional().default(0),
})

async function requireAdmin() {
  const session = await auth()
  if (!session) throw new Error('Unauthorized')
}

function revalidate() {
  revalidatePath('/admin/tools')
  revalidatePath('/')
}

export async function createTool(data: unknown) {
  await requireAdmin()

  const parsed = ToolSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  try {
    await connectDB()
    const tool = await Tool.create(parsed.data)
    revalidate()
    return { success: true, data: serialize(tool.toObject()) }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to create tool'
    return { success: false, error: msg }
  }
}

export async function updateTool(id: string, data: unknown) {
  await requireAdmin()

  const parsed = ToolSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  try {
    await connectDB()
    const tool = await Tool.findByIdAndUpdate(id, { $set: parsed.data }, { new: true })
    if (!tool) return { success: false, error: 'Tool not found' }
    revalidate()
    return { success: true, data: serialize(tool.toObject()) }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to update tool'
    return { success: false, error: msg }
  }
}

export async function deleteTool(id: string) {
  await requireAdmin()

  try {
    await connectDB()
    await Tool.findByIdAndDelete(id)
    revalidate()
    return { success: true }
  } catch {
    return { success: false, error: 'Failed to delete tool' }
  }
}
