import { connectDB } from '@/lib/mongodb'
import { serialize } from '@/lib/serialize'
import { Profile } from '@/models/Profile'
import ProfileCard from './ProfileCard'
import StickyProfileWrapper from './StickyProfileWrapper'
import ContactSection from './ContactSection'

export default async function TwoColLayout({ children }: { children: React.ReactNode }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let profile: any = null
  try {
    await connectDB()
    profile = await Profile.findOne().lean()
  } catch {
    // DB not connected — render with empty profile
  }

  const serializedProfile = profile ? serialize(profile) : null

  return (
    <div className="flex min-h-screen pt-16 max-w-[1400px] mx-auto px-6 lg:px-16 gap-8 lg:gap-12">
      <aside className="hidden lg:block lg:w-[400px] xl:w-[440px] shrink-0">
        <StickyProfileWrapper>
          <ProfileCard profile={serializedProfile} />
        </StickyProfileWrapper>
      </aside>
      <main className="flex-1 min-w-0 py-8 lg:py-12">
        {children}
        <ContactSection />
      </main>
    </div>
  )
}
