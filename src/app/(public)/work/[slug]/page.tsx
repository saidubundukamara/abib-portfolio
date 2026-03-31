import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'
import type { Metadata } from 'next'
import { connectDB } from '@/lib/mongodb'
import { serialize } from '@/lib/serialize'
import { renderTiptap } from '@/lib/tiptap'
import { Project } from '@/models/Project'
import ProjectCard from '@/components/public/ProjectCard'
import { canonicalUrl, ogImages } from '@/lib/seo'
import ContactSection from '@/components/public/ContactSection'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  try {
    await connectDB()
    const projects = await Project.find({ published: true }, 'slug').lean()
    return projects.map((p) => ({ slug: p.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    await connectDB()
    const project = await Project.findOne({ slug, published: true }).lean()
    if (!project) return {}

    const title       = (project.metadata?.ogTitle       as string) || project.title
    const description = (project.metadata?.ogDescription as string) || project.excerpt
    const imageUrl    = (project.metadata?.ogImage        as string) || project.coverImageUrl || ''

    return {
      title,
      description,
      alternates: {
        canonical: canonicalUrl(`/work/${slug}`),
      },
      openGraph: {
        title,
        description,
        url: canonicalUrl(`/work/${slug}`),
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

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params

  let project = null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let related: any[] = []
  try {
    await connectDB()
    project = await Project.findOne({ slug, published: true }).lean()
    if (project) {
      related = await Project.find({
        published: true,
        category: project.category,
        slug: { $ne: slug },
      }).limit(3).lean()
    }
  } catch {
    // DB not connected
  }

  if (!project) notFound()

  const html = renderTiptap(project.content)
  const s = serialize(project)

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
          href="/work"
          className="text-text-muted hover:text-accent-orange text-sm transition-colors mb-8 inline-block"
        >
          ← Back to Work
        </Link>

        {/* Category + date */}
        <div className="flex items-center gap-4 mb-4">
          <span className="text-[11px] font-bold uppercase tracking-widest text-accent-orange">
            {s.category.replace(/-/g, ' ')}
          </span>
          {s.publishedAt && (
            <time className="text-text-muted text-xs">
              {format(new Date(s.publishedAt), 'MMMM d, yyyy')}
            </time>
          )}
        </div>

        {/* Title */}
        <h1 className="font-bold text-text-primary text-3xl md:text-5xl leading-tight mb-4">
          {s.title}
        </h1>

        {/* Excerpt */}
        <p className="text-text-secondary text-lg leading-relaxed mb-10">{s.excerpt}</p>

        {/* Rich text content */}
        {html && (
          <div
            className="prose prose-invert prose-sm md:prose-base max-w-none
              prose-headings:text-text-primary prose-p:text-text-secondary
              prose-a:text-accent-cyan prose-strong:text-text-primary
              prose-img:rounded-card prose-img:shadow-card"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}

        {/* Tools used */}
        {s.tools && s.tools.length > 0 && (
          <div className="mt-12 pt-8 border-t border-[rgba(255,255,255,0.08)]">
            <h3 className="font-bold uppercase tracking-[-0.04em] text-text-secondary text-xs mb-4">
              Tools Used
            </h3>
            <div className="flex flex-wrap gap-2">
              {(s.tools as string[]).map((tool: string) => (
                <span
                  key={tool}
                  className="px-3 py-1 rounded-btn bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] text-text-secondary text-xs"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Related projects */}
        {related.length > 0 && (
          <div className="mt-16">
            <h3 className="font-bold uppercase tracking-[-0.04em] text-text-secondary text-xs mb-8">
              Related Projects
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {serialize(related).map((p) => (
                <ProjectCard key={p._id} project={p} />
              ))}
            </div>
          </div>
        )}

        <ContactSection />
      </div>
    </div>
  )
}
