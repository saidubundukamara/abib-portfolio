'use server'

import { connectDB } from '@/lib/mongodb'
import { ContactMessage } from '@/models/ContactMessage'
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
    await connectDB()
    await ContactMessage.create(parsed.data)
    return { success: true }
  } catch {
    return { success: false, error: 'Failed to send message. Please try again.' }
  }
}
