import { prisma } from '@/lib/prisma'
import {
  toSerializedProfile,
  toSerializedProject,
  toSerializedTool,
  toSerializedThought,
  toSerializedCertification,
} from '@/lib/adapters'

import ProfileCard from '@/components/public/ProfileCard'
import StickyProfileWrapper from '@/components/public/StickyProfileWrapper'
import HeroSection from '@/components/public/HeroSection'
import ProjectsSection from '@/components/public/ProjectsSection'
// import ExperienceSection from '@/components/public/ExperienceSection'
import ToolsSection from '@/components/public/ToolsSection'
import ThoughtsSection from '@/components/public/ThoughtsSection'
import ContactSection from '@/components/public/ContactSection'
import FadeContent from '@/components/public/FadeContent'

export default async function HomePage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let serializedProfile: any = null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let featuredProjects: any[] = []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let tools: any[] = []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let thoughts: any[] = []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let certifications: any[] = []

  try {
    const [profileRow, projectRows, toolRows, thoughtRows, certRows] = await Promise.all([
      prisma.profile.findFirst(),
      prisma.project.findMany({
        where:   { published: true },
        orderBy: { publishedAt: 'desc' },
        take:    6,
      }),
      prisma.tool.findMany({ orderBy: { order: 'asc' } }),
      prisma.designThought.findMany({
        where:   { published: true },
        orderBy: { publishedAt: 'desc' },
        take:    3,
      }),
      prisma.certification.findMany({ orderBy: { order: 'asc' } }),
    ])

    serializedProfile = profileRow ? toSerializedProfile(profileRow) : null
    featuredProjects  = projectRows.map(toSerializedProject)
    tools             = toolRows.map(toSerializedTool)
    thoughts          = thoughtRows.map(toSerializedThought)
    certifications    = certRows.map(toSerializedCertification)
  } catch {
    // DB not connected — render with empty state
  }

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
        <FadeContent duration={800} ease="power2.out">
          <HeroSection profile={serializedProfile} certifications={certifications} />
        </FadeContent>
        <FadeContent duration={800} ease="power2.out">
          <ProjectsSection projects={featuredProjects} />
        </FadeContent>
        {/* <FadeContent duration={800} ease="power2.out">
          <ExperienceSection />
        </FadeContent> */}
        <FadeContent duration={800} ease="power2.out">
          <ToolsSection tools={tools} />
        </FadeContent>
        <FadeContent duration={800} ease="power2.out">
          <ThoughtsSection thoughts={thoughts} />
        </FadeContent>
        <FadeContent duration={800} ease="power2.out">
          <ContactSection />
        </FadeContent>
      </main>
    </div>
  )
}
