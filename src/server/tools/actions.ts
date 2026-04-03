'use server'

import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { toSerializedTool } from '@/lib/adapters'
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
    const tool = await prisma.tool.create({ data: parsed.data })
    revalidate()
    return { success: true, data: toSerializedTool(tool) }
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
    const tool = await prisma.tool.update({ where: { id }, data: parsed.data })
    revalidate()
    return { success: true, data: toSerializedTool(tool) }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to update tool'
    return { success: false, error: msg }
  }
}

export async function deleteTool(id: string) {
  await requireAdmin()

  try {
    await prisma.tool.delete({ where: { id } })
    revalidate()
    return { success: true }
  } catch {
    return { success: false, error: 'Failed to delete tool' }
  }
}
