import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { toSerializedThought } from '@/lib/adapters'
import { renderTiptap } from '@/lib/tiptap'
import FadeContent from '@/components/public/FadeContent'
import SplitTextReveal from '@/components/public/SplitTextReveal'
import { canonicalUrl, ogImages } from '@/lib/seo'
import ContactSection from '@/components/public/ContactSection'
import { isValidUrl } from '@/lib/url'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  try {
    const thoughts = await prisma.designThought.findMany({
      where:  { published: true },
      select: { slug: true },
    })
    return thoughts.map((t) => ({ slug: t.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const thought = await prisma.designThought.findFirst({ where: { slug, published: true } })
    if (!thought) return {}

    const title       = thought.ogTitle       || thought.title
    const description = thought.ogDescription || thought.excerpt
    const imageUrl    = thought.ogImage        || thought.coverImageUrl || ''

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
    const row = await prisma.designThought.findFirst({ where: { slug, published: true } })
    if (row) thought = toSerializedThought(row)
  } catch {
    // DB not connected
  }

  if (!thought) notFound()

  const html = renderTiptap(thought.content)

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Cover image */}
      {thought.coverImageUrl && isValidUrl(thought.coverImageUrl) && (
        <FadeContent duration={800} ease="power2.out">
          <div className="relative w-full h-[40vh] md:h-[55vh] bg-[rgba(255,255,255,0.05)]">
            <Image
              src={thought.coverImageUrl}
              alt={thought.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-transparent" />
          </div>
        </FadeContent>
      )}

      <div className="max-w-3xl mx-auto px-4 mt-10">
        {/* Back link + header */}
        <FadeContent duration={700} ease="power2.out">
          <Link
            href="/thoughts"
            className="text-text-muted hover:text-accent-orange text-sm transition-colors mb-8 inline-block"
          >
            ← Back to Thoughts
          </Link>

          {/* Meta */}
          <div className="flex items-center gap-4 mb-4 text-text-muted text-xs">
            {thought.publishedAt && (
              <time>{format(new Date(thought.publishedAt), 'MMMM d, yyyy')}</time>
            )}
            <span>·</span>
            <span>{thought.readTime} min read</span>
          </div>

          {/* Title */}
          <h1 className="font-bold text-text-primary text-3xl md:text-5xl leading-tight mb-4">
            <SplitTextReveal
              text={thought.title}
              triggerOnMount
              duration={1}
              stagger={0.03}
              delay={0.1}
            />
          </h1>

          {/* Excerpt */}
          <p className="text-text-secondary text-lg leading-relaxed mb-10">{thought.excerpt}</p>
        </FadeContent>

        {/* Rich text */}
        {html && (
          <FadeContent duration={700} delay={100} ease="power2.out">
            <div
              className="prose prose-invert prose-sm md:prose-base max-w-none
                prose-headings:text-text-primary prose-p:text-text-secondary
                prose-a:text-accent-cyan prose-strong:text-text-primary
                prose-img:rounded-card prose-img:shadow-card"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </FadeContent>
        )}

        <FadeContent duration={700} ease="power2.out">
          <ContactSection />
        </FadeContent>
      </div>
    </div>
  )
}
