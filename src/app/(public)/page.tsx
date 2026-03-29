import { connectDB } from '@/lib/mongodb'
import { serialize } from '@/lib/serialize'
import { Profile } from '@/models/Profile'
import { Project } from '@/models/Project'
import { Tool } from '@/models/Tool'
import { DesignThought } from '@/models/DesignThought'

import HeroSection from '@/components/public/HeroSection'
import SkillsSection from '@/components/public/SkillsSection'
import ProjectsSection from '@/components/public/ProjectsSection'
import CategoriesSection from '@/components/public/CategoriesSection'
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
  let allProjects: any[] = []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let tools: any[] = []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let thoughts: any[] = []

  try {
    await connectDB()
    ;[profile, featuredProjects, allProjects, tools, thoughts] = await Promise.all([
      Profile.findOne().lean(),
      Project.find({ published: true, featured: true }).sort({ publishedAt: -1 }).limit(6).lean(),
      Project.find({ published: true }).sort({ publishedAt: -1 }).lean(),
      Tool.find().sort({ order: 1 }).lean(),
      DesignThought.find({ published: true }).sort({ publishedAt: -1 }).limit(3).lean(),
    ])
  } catch {
    // DB not connected (e.g. MONGODB_URI not set) — render with empty state
  }

  return (
    <>
      <HeroSection profile={profile ? serialize(profile) : null} />
      <SkillsSection />
      <ProjectsSection projects={serialize(featuredProjects)} title="RECENT PROJECTS" />
      <CategoriesSection allProjects={serialize(allProjects)} />
      <ExperienceSection />
      <ToolsSection tools={serialize(tools)} />
      <ThoughtsSection thoughts={serialize(thoughts)} />
      <ContactSection />
    </>
  )
}
