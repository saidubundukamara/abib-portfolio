import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'
import type { Metadata } from 'next'
import { connectDB } from '@/lib/mongodb'
import { serialize } from '@/lib/serialize'
import { renderTiptap } from '@/lib/tiptap'
import { DesignThought } from '@/models/DesignThought'
import { canonicalUrl, ogImages } from '@/lib/seo'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  try {
    await connectDB()
    const thoughts = await DesignThought.find({ published: true }, 'slug').lean()
    return thoughts.map((t) => ({ slug: t.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    await connectDB()
    const thought = await DesignThought.findOne({ slug, published: true }).lean()
    if (!thought) return {}

    const title       = (thought.metadata?.ogTitle       as string) || thought.title
    const description = (thought.metadata?.ogDescription as string) || thought.excerpt
    const imageUrl    = (thought.metadata?.ogImage        as string) || thought.coverImageUrl || ''

    return {
      title,
      description,
      alternates: {
        canonical: canonicalUrl(`/thoughts/${slug}`),
      },
      openGraph: {
        title,
        description,
        url: canonicalUrl(`/thoughts/${slug}`),
        type: 'article',
        images: ogImages(imageUrl),
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: imageUrl ? [imageUrl] : [],
      },
    }
  } catch {
    return {}
  }
}

export default async function ThoughtDetailPage({ params }: Props) {
  const { slug } = await params

  let thought = null
  try {
    await connectDB()
    thought = await DesignThought.findOne({ slug, published: true }).lean()
  } catch {
    // DB not connected
  }

  if (!thought) notFound()

  const html = renderTiptap(thought.content)
  const s = serialize(thought)

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Cover image */}
      {s.coverImageUrl && (
        <div className="relative w-full h-[40vh] md:h-[55vh] bg-[rgba(255,255,255,0.05)]">
          <Image
            src={s.coverImageUrl}
            alt={s.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-transparent" />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 mt-10">
        {/* Back link */}
        <Link
          href="/thoughts"
          className="text-text-muted hover:text-accent-orange text-sm transition-colors mb-8 inline-block"
        >
          ← Back to Thoughts
        </Link>

        {/* Meta */}
        <div className="flex items-center gap-4 mb-4 text-text-muted text-xs">
          {s.publishedAt && (
            <time>{format(new Date(s.publishedAt), 'MMMM d, yyyy')}</time>
          )}
          <span>·</span>
          <span>{s.readTime} min read</span>
        </div>

        {/* Title */}
        <h1 className="font-bold text-text-primary text-3xl md:text-5xl leading-tight mb-4">
          {s.title}
        </h1>

        {/* Excerpt */}
        <p className="text-text-secondary text-lg leading-relaxed mb-10">{s.excerpt}</p>

        {/* Rich text */}
        {html && (
          <div
            className="prose prose-invert prose-sm md:prose-base max-w-none
              prose-headings:text-text-primary prose-p:text-text-secondary
              prose-a:text-accent-cyan prose-strong:text-text-primary
              prose-img:rounded-card prose-img:shadow-card"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}
      </div>
    </div>
  )
}
