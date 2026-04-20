import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import type { SerializedProject } from '@/types'

import { isValidUrl } from '@/lib/url'

interface Props {
  project: Pick<SerializedProject, 'id' | 'title' | 'slug' | 'excerpt' | 'category' | 'coverImageUrl' | 'publishedAt'>
}

const categoryLabels: Record<string, string> = {
  'logo-design':     'Logo Design',
  'event-flyers':    'Event Flyers',
  'motion-graphics': 'Motion Graphics',
  'social-media':    'Social Media',
  'branding':        'Branding',
}

export default function ProjectCard({ project }: Props) {
  const { title, slug, excerpt, category, coverImageUrl, publishedAt } = project

  return (
    <Link
      href={`/work/${slug}`}
      className="group flex flex-col rounded-card shadow-card overflow-hidden
        bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.05)]
        border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.14)]
        hover:-translate-y-1 hover:shadow-[0_24px_48px_-16px_rgba(0,0,0,0.5)]
        transition-[background-color,border-color,transform,box-shadow] duration-300 ease-out"
    >
      {/* Cover image */}
      <div className="relative w-full aspect-video bg-[rgba(255,255,255,0.05)] overflow-hidden">
        {coverImageUrl && isValidUrl(coverImageUrl) ? (
          <Image
            src={coverImageUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-[rgba(244,108,56,0.08)] flex items-center justify-center">
            <span className="text-text-muted text-xs">No image</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        {/* Category badge */}
        <span className="text-[11px] font-bold uppercase tracking-widest text-accent-orange">
          {categoryLabels[category] ?? category}
        </span>

        <h3 className="font-semibold text-text-primary text-base leading-snug line-clamp-2 group-hover:text-accent-orange transition-colors duration-300">
          {title}
        </h3>

        <p className="text-text-secondary text-sm leading-relaxed line-clamp-2 flex-1">
          {excerpt}
        </p>

        {publishedAt && (
          <time className="text-text-muted text-xs mt-auto">
            {format(new Date(publishedAt), 'MMM d, yyyy')}
          </time>
        )}
      </div>
    </Link>
  )
}
