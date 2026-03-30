import SectionHeading from './SectionHeading'
import ToolCard from './ToolCard'
import type { SerializedTool } from '@/types'

interface Props {
  tools: SerializedTool[]
}

export default function ToolsSection({ tools }: Props) {
  return (
    <section id="tools" className="py-12 lg:py-16">
      <SectionHeading white="PREMIUM" ghost="TOOLS" />

      {tools.length === 0 ? (
        <p className="text-text-muted text-sm">No tools listed yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {tools.map((tool) => (
            <ToolCard key={tool._id} tool={tool} />
          ))}
        </div>
      )}
    </section>
  )
}
