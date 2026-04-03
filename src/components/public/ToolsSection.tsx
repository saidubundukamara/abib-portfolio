import SectionHeading from './SectionHeading'
import ToolCard from './ToolCard'
import FadeContent from './FadeContent'
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
          {tools.map((tool, i) => (
            <FadeContent key={tool.id} duration={600} delay={i * 80} ease="power2.out">
              <ToolCard tool={tool} />
            </FadeContent>
          ))}
        </div>
      )}
    </section>
  )
}
