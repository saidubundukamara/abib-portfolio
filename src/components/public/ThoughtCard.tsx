import Link from 'next/link'
import { format } from 'date-fns'
import { ArrowUpRight } from 'lucide-react'
import type { SerializedThought } from '@/types'

interface Props {
  thought: Pick<SerializedThought, 'id' | 'title' | 'slug' | 'excerpt' | 'readTime' | 'publishedAt'>
}

export default function ThoughtCard({ thought }: Props) {
  const { title, slug, excerpt, readTime, publishedAt } = thought

  return (
    <Link
      href={`/thoughts/${slug}`}
      className="flex items-start justify-between gap-4 py-5
        border-b border-[rgba(255,255,255,0.06)]
        hover:bg-[rgba(255,255,255,0.02)] hover:-translate-x-1
        transition-[background-color,transform] duration-300 ease-out group"
    >
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-text-primary text-base leading-snug group-hover:text-accent-orange transition-colors duration-300">
          {title}
        </h3>
        {excerpt && (
          <p className="text-text-secondary text-sm mt-1 line-clamp-2 leading-relaxed">
            {excerpt}
          </p>
        )}
        <div className="flex items-center justify-between mt-2">
          {publishedAt && (
            <time className="text-text-secondary text-xs">
              {format(new Date(publishedAt), 'MMM d, yyyy')}
            </time>
          )}
          {readTime && (
            <span className="text-text-secondary text-xs">{readTime} min read</span>
          )}
        </div>
      </div>

      <span className="inline-flex shrink-0 mt-0.5 transition-transform duration-300 ease-out group-hover:translate-x-1 group-hover:-translate-y-1">
        <ArrowUpRight size={18} className="text-accent-orange" />
      </span>
    </Link>
  )
}
