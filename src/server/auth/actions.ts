'use server'

import { signIn, signOut } from '@/auth'
import { AuthError } from 'next-auth'

export async function loginAction(
  _prev: { success: boolean; error?: string } | null,
  formData: FormData,
) {
  try {
    await signIn('credentials', {
      email:      formData.get('email'),
      password:   formData.get('password'),
      redirectTo: '/admin/dashboard',
    })
    return { success: true }
  } catch (err) {
    if (err instanceof AuthError) {
      return { success: false, error: 'Invalid email or password.' }
    }
    // Re-throw redirect errors — Next.js uses throw for redirects
    throw err
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: '/admin/login' })
}
