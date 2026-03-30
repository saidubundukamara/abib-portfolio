import SectionHeading from './SectionHeading'
import ThoughtCard from './ThoughtCard'
import type { SerializedThought } from '@/types'

interface Props {
  thoughts: SerializedThought[]
}

export default function ThoughtsSection({ thoughts }: Props) {
  return (
    <section id="thoughts" className="py-12 lg:py-16">
      <SectionHeading white="DESIGN" ghost="THOUGHTS" />

      {thoughts.length === 0 ? (
        <p className="text-text-muted text-sm">No articles published yet.</p>
      ) : (
        <div>
          {thoughts.map((thought) => (
            <ThoughtCard key={thought._id} thought={thought} />
          ))}
        </div>
      )}
    </section>
  )
}
