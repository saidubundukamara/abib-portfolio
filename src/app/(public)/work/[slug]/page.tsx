import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { toSerializedProject } from '@/lib/adapters'
import { renderTiptap } from '@/lib/tiptap'
import ProjectCard from '@/components/public/ProjectCard'
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
    const projects = await prisma.project.findMany({
      where:  { published: true },
      select: { slug: true },
    })
    return projects.map((p) => ({ slug: p.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const project = await prisma.project.findFirst({ where: { slug, published: true } })
    if (!project) return {}

    const title       = project.ogTitle       || project.title
    const description = project.ogDescription || project.excerpt
    const imageUrl    = project.ogImage        || project.coverImageUrl || ''

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
    const projectRow = await prisma.project.findFirst({ where: { slug, published: true } })
    if (projectRow) {
      project = toSerializedProject(projectRow)
      const relatedRows = await prisma.project.findMany({
        where: {
          published: true,
          category:  projectRow.category,
          slug:      { not: slug },
        },
        take: 3,
      })
      related = relatedRows.map(toSerializedProject)
    }
  } catch {
    // DB not connected
  }

  if (!project) notFound()

  const html = renderTiptap(project.content)

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Cover image */}
      {project.coverImageUrl && isValidUrl(project.coverImageUrl) && (
        <FadeContent duration={800} ease="power2.out">
          <div className="relative w-full h-[40vh] md:h-[55vh] bg-[rgba(255,255,255,0.05)]">
            <Image
              src={project.coverImageUrl}
              alt={project.title}
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
            href="/work"
            className="text-text-muted hover:text-accent-orange text-sm transition-colors mb-8 inline-block"
          >
            ← Back to Work
          </Link>

          {/* Category + date */}
          <div className="flex items-center gap-4 mb-4">
            <span className="text-[11px] font-bold uppercase tracking-widest text-accent-orange">
              {project.category.replace(/-/g, ' ')}
            </span>
            {project.publishedAt && (
              <time className="text-text-muted text-xs">
                {format(new Date(project.publishedAt), 'MMMM d, yyyy')}
              </time>
            )}
          </div>

          {/* Title */}
          <h1 className="font-bold text-text-primary text-3xl md:text-5xl leading-tight mb-4">
            <SplitTextReveal
              text={project.title}
              triggerOnMount
              duration={1}
              stagger={0.03}
              delay={0.1}
            />
          </h1>

          {/* Excerpt */}
          <p className="text-text-secondary text-lg leading-relaxed mb-10">{project.excerpt}</p>
        </FadeContent>

        {/* Rich text content */}
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

        {/* Tools used */}
        {project.tools && project.tools.length > 0 && (
          <FadeContent duration={600} delay={150} ease="power2.out">
            <div className="mt-12 pt-8 border-t border-[rgba(255,255,255,0.08)]">
              <h3 className="font-bold uppercase tracking-[-0.04em] text-text-secondary text-xs mb-4">
                Tools Used
              </h3>
              <div className="flex flex-wrap gap-2">
                {(project.tools as string[]).map((tool: string) => (
                  <span
                    key={tool}
                    className="px-3 py-1 rounded-btn bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] text-text-secondary text-xs"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </FadeContent>
        )}

        {/* Related projects */}
        {related.length > 0 && (
          <div className="mt-16">
            <FadeContent duration={600} ease="power2.out">
              <h3 className="font-bold uppercase tracking-[-0.04em] text-text-secondary text-xs mb-8">
                Related Projects
              </h3>
            </FadeContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((p, i) => (
                <FadeContent key={p.id} duration={600} delay={i * 80} ease="power2.out">
                  <ProjectCard project={p} />
                </FadeContent>
              ))}
            </div>
          </div>
        )}

        <FadeContent duration={700} ease="power2.out">
          <ContactSection />
        </FadeContent>
      </div>
    </div>
  )
}
