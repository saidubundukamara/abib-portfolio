import { connectDB } from '@/lib/mongodb'
import { serialize } from '@/lib/serialize'
import { DesignThought } from '@/models/DesignThought'
import ThoughtCard from '@/components/public/ThoughtCard'
import type { Metadata } from 'next'

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
    <div className="min-h-screen pt-28 pb-20 px-4 max-w-3xl mx-auto">
      <h1 className="font-bold text-text-primary text-3xl md:text-4xl mb-3">Design Thoughts</h1>
      <p className="text-text-secondary text-sm mb-12">
        Articles and perspectives on design, branding, and creative process.
      </p>

      {thoughts.length === 0 ? (
        <p className="text-text-muted text-sm">No articles published yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {serialize(thoughts).map((thought) => (
            <ThoughtCard key={thought._id} thought={thought} />
          ))}
        </div>
      )}
    </div>
  )
}
