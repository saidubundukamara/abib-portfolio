import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import type { SerializedThought } from '@/types'

interface Props {
  thought: Pick<SerializedThought, '_id' | 'title' | 'slug' | 'excerpt' | 'coverImageUrl' | 'readTime' | 'publishedAt'>
}

export default function ThoughtCard({ thought }: Props) {
  const { title, slug, excerpt, coverImageUrl, readTime, publishedAt } = thought

  return (
    <Link
      href={`/thoughts/${slug}`}
      className="group flex gap-5 rounded-card shadow-card overflow-hidden
        bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.05)]
        border border-[rgba(255,255,255,0.06)] transition-colors duration-200 p-4"
    >
      {/* Thumbnail */}
      {coverImageUrl && (
        <div className="relative shrink-0 w-24 h-24 rounded-btn overflow-hidden bg-[rgba(255,255,255,0.05)]">
          <Image
            src={coverImageUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="96px"
          />
        </div>
      )}

      {/* Text */}
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        <h3 className="font-semibold text-text-primary text-sm leading-snug line-clamp-2 group-hover:text-accent-orange transition-colors">
          {title}
        </h3>
        <p className="text-text-secondary text-xs leading-relaxed line-clamp-2">
          {excerpt}
        </p>
        <div className="flex items-center gap-3 mt-auto text-text-muted text-xs">
          {publishedAt && (
            <time>{format(new Date(publishedAt), 'MMM d, yyyy')}</time>
          )}
          <span>·</span>
          <span>{readTime} min read</span>
        </div>
      </div>
    </Link>
  )
}
