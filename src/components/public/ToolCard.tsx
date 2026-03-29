import Image from 'next/image'
import { ExternalLink } from 'lucide-react'
import type { SerializedTool } from '@/types'

interface Props {
  tool: Pick<SerializedTool, '_id' | 'name' | 'description' | 'logoUrl' | 'externalUrl'>
}

export default function ToolCard({ tool }: Props) {
  const { name, description, logoUrl, externalUrl } = tool

  return (
    <a
      href={externalUrl || '#'}
      target={externalUrl ? '_blank' : undefined}
      rel="noopener noreferrer"
      className="group flex items-start gap-4 rounded-card shadow-card p-5
        bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.05)]
        border border-[rgba(255,255,255,0.06)] transition-colors duration-200"
    >
      {/* Logo */}
      <div className="relative shrink-0 w-10 h-10 rounded-lg overflow-hidden bg-[rgba(255,255,255,0.08)]">
        {logoUrl ? (
          <Image src={logoUrl} alt={name} fill className="object-contain p-1" sizes="40px" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-muted text-xs font-bold">
            {name[0]}
          </div>
        )}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-text-primary text-sm">{name}</span>
          {externalUrl && (
            <ExternalLink size={12} className="text-text-muted group-hover:text-accent-orange transition-colors" />
          )}
        </div>
        <p className="text-text-secondary text-xs mt-1 leading-relaxed line-clamp-2">
          {description}
        </p>
      </div>
    </a>
  )
}
