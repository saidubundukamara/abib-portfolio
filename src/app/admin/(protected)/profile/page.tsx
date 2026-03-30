import { connectDB } from '@/lib/mongodb'
import { Profile } from '@/models/Profile'
import { serialize } from '@/lib/serialize'
import ProfileForm from '@/components/admin/ProfileForm'
import type { Metadata } from 'next'
import type { SerializedProfile } from '@/types'

export const metadata: Metadata = { title: 'Profile' }

export default async function ProfilePage() {
  await connectDB()
  const profile = await Profile.findOne().lean()

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">Profile</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Manage your public-facing bio, stats, and social links
        </p>
      </div>
      <ProfileForm initialData={profile ? (serialize(profile) as SerializedProfile) : undefined} />
    </div>
  )
}
