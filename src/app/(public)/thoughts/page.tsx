import type { Metadata } from 'next'
import { connectDB } from '@/lib/mongodb'
import { serialize } from '@/lib/serialize'
import { DesignThought } from '@/models/DesignThought'
import TwoColLayout from '@/components/public/TwoColLayout'
import SectionHeading from '@/components/public/SectionHeading'
import ThoughtCard from '@/components/public/ThoughtCard'
import FadeContent from '@/components/public/FadeContent'

export const metadata: Metadata = {
  title: 'Thoughts',
  description: 'Articles and perspectives on design, branding, and creative process.',
}

export default async function ThoughtsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let thoughts: any[] = []
  try {
    await connectDB()
    thoughts = await DesignThought.find({ published: true })
      .sort({ publishedAt: -1 })
      .lean()
  } catch {
    // DB not connected
  }

  return (
    <TwoColLayout>
      <FadeContent duration={700} ease="power2.out">
        <SectionHeading white="DESIGN" ghost="THOUGHTS" />
      </FadeContent>

      {thoughts.length === 0 ? (
        <p className="text-text-muted text-sm">No articles published yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {serialize(thoughts).map((thought, i) => (
            <FadeContent key={thought._id} duration={600} delay={i * 70} ease="power2.out">
              <ThoughtCard thought={thought} />
            </FadeContent>
          ))}
        </div>
      )}
    </TwoColLayout>
  )
}
