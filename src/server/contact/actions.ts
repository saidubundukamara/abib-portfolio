'use server'

import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const schema = z.object({
  name:    z.string().min(1, 'Name is required'),
  email:   z.string().email('Invalid email'),
  budget:  z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

export async function submitContactMessage(
  _prev: { success: boolean; error?: string } | null,
  formData: FormData,
) {
  // Honeypot — bots fill this hidden field; silently accept so they move on
  const honeypot = formData.get('website')
  if (typeof honeypot === 'string' && honeypot.length > 0) {
    return { success: true }
  }

  // Time gate — bots submit instantly; require at least 3 seconds
  const loadedAt = formData.get('form_loaded_at')
  if (typeof loadedAt === 'string' && loadedAt.length > 0) {
    const elapsed = Date.now() - Number(loadedAt)
    if (elapsed < 3000) {
      return { success: false, error: 'Please take a moment before submitting.' }
    }
  }

  const parsed = schema.safeParse({
    name:    formData.get('name'),
    email:   formData.get('email'),
    budget:  formData.get('budget'),
    message: formData.get('message'),
  })

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  try {
    await prisma.contactMessage.create({ data: parsed.data })
    return { success: true }
  } catch {
    return { success: false, error: 'Failed to send message. Please try again.' }
  }
}
