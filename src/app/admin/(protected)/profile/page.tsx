import { prisma } from '@/lib/prisma'
import { toSerializedProfile } from '@/lib/adapters'
import ProfileForm from '@/components/admin/ProfileForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Profile' }

export default async function ProfilePage() {
  const profile = await prisma.profile.findFirst()

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">Profile</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Manage your public-facing bio, stats, and social links
        </p>
      </div>
      <ProfileForm initialData={profile ? toSerializedProfile(profile) : undefined} />
    </div>
  )
}
