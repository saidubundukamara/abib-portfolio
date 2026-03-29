import Link from 'next/link'
import ThoughtCard from './ThoughtCard'
import type { SerializedThought } from '@/types'

interface Props {
  thoughts: SerializedThought[]
}

export default function ThoughtsSection({ thoughts }: Props) {
  return (
    <section className="py-20 px-4 max-w-5xl mx-auto">
      <div className="flex items-end justify-between mb-10">
        <h2 className="font-bold uppercase tracking-[-0.04em] text-text-secondary text-xs sm:text-sm">
          Design Thoughts
        </h2>
        <Link
          href="/thoughts"
          className="text-text-secondary hover:text-accent-orange text-sm transition-colors"
        >
          View all →
        </Link>
      </div>

      {thoughts.length === 0 ? (
        <p className="text-text-muted text-sm">No articles published yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {thoughts.map((thought) => (
            <ThoughtCard key={thought._id} thought={thought} />
          ))}
        </div>
      )}
    </section>
  )
}
