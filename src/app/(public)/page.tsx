import { connectDB } from '@/lib/mongodb'
import { serialize } from '@/lib/serialize'
import { Profile } from '@/models/Profile'
import { Project } from '@/models/Project'
import { Tool } from '@/models/Tool'
import { DesignThought } from '@/models/DesignThought'

import ProfileCard from '@/components/public/ProfileCard'
import StickyProfileWrapper from '@/components/public/StickyProfileWrapper'
import HeroSection from '@/components/public/HeroSection'
import ProjectsSection from '@/components/public/ProjectsSection'
import ExperienceSection from '@/components/public/ExperienceSection'
import ToolsSection from '@/components/public/ToolsSection'
import ThoughtsSection from '@/components/public/ThoughtsSection'
import ContactSection from '@/components/public/ContactSection'

export default async function HomePage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let profile: any = null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let featuredProjects: any[] = []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let tools: any[] = []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let thoughts: any[] = []

  try {
    await connectDB()
    ;[profile, featuredProjects, tools, thoughts] = await Promise.all([
      Profile.findOne().lean(),
      Project.find({ published: true }).sort({ publishedAt: -1 }).limit(6).lean(),
      Tool.find().sort({ order: 1 }).lean(),
      DesignThought.find({ published: true }).sort({ publishedAt: -1 }).limit(3).lean(),
    ])
  } catch {
    // DB not connected — render with empty state
  }

  const serializedProfile = profile ? serialize(profile) : null

  return (
    <div className="flex min-h-screen pt-16 max-w-[1400px] mx-auto px-6 lg:px-16 gap-8 lg:gap-12">
      {/* LEFT: sticky profile card */}
      <aside className="hidden lg:block lg:w-[400px] xl:w-[440px] shrink-0">
        <StickyProfileWrapper>
          <ProfileCard profile={serializedProfile} />
        </StickyProfileWrapper>
      </aside>

      {/* RIGHT: scrollable content sections */}
      <main className="flex-1 min-w-0 py-8 lg:py-12">
        <HeroSection profile={serializedProfile} />
        <ProjectsSection projects={serialize(featuredProjects)} />
        <ExperienceSection />
        <ToolsSection tools={serialize(tools)} />
        <ThoughtsSection thoughts={serialize(thoughts)} />
        <ContactSection />
      </main>
    </div>
  )
}
