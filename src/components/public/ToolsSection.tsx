import ToolCard from './ToolCard'
import type { SerializedTool } from '@/types'

interface Props {
  tools: SerializedTool[]
}

export default function ToolsSection({ tools }: Props) {
  return (
    <section className="py-20 px-4 max-w-5xl mx-auto">
      <h2 className="font-bold uppercase tracking-[-0.04em] text-text-secondary text-xs sm:text-sm mb-10">
        Premium Tools
      </h2>

      {tools.length === 0 ? (
        <p className="text-text-muted text-sm">No tools listed yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <ToolCard key={tool._id} tool={tool} />
          ))}
        </div>
      )}
    </section>
  )
}
