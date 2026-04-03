import Image from 'next/image'
import type { SerializedTool } from '@/types'

interface Props {
  tool: Pick<SerializedTool, 'id' | 'name' | 'description' | 'logoUrl' | 'externalUrl' | 'category'>
}

export default function ToolCard({ tool }: Props) {
  const { name, description, logoUrl, externalUrl, category } = tool

  return (
    <a
      href={externalUrl || '#'}
      target={externalUrl ? '_blank' : undefined}
      rel="noopener noreferrer"
      className="flex items-center gap-4 p-4 rounded-[12px]
        bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]
        hover:border-[rgba(255,255,255,0.12)] transition-colors duration-200"
    >
      {/* Logo */}
      <div className="relative shrink-0 w-12 h-12 rounded-xl overflow-hidden bg-[rgba(255,255,255,0.08)]">
        {logoUrl ? (
          <Image src={logoUrl} alt={name} fill className="object-contain p-1" sizes="48px" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-muted text-sm font-bold">
            {name[0]}
          </div>
        )}
      </div>

      {/* Text */}
      <div className="min-w-0">
        <span className="font-bold text-text-primary text-sm block">{name}</span>
        <span className="text-text-secondary text-xs leading-relaxed line-clamp-1">
          {category || description}
        </span>
      </div>
    </a>
  )
}
