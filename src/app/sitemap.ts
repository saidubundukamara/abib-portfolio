import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'
import { SITE_URL } from '@/lib/seo'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/work`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/thoughts`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ]

  try {
    const [projects, thoughts] = await Promise.all([
      prisma.project.findMany({
        where:  { published: true },
        select: { slug: true, updatedAt: true },
      }),
      prisma.designThought.findMany({
        where:  { published: true },
        select: { slug: true, updatedAt: true },
      }),
    ])

    const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
      url: `${SITE_URL}/work/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: 'monthly',
      priority: 0.8,
    }))

    const thoughtRoutes: MetadataRoute.Sitemap = thoughts.map((t) => ({
      url: `${SITE_URL}/thoughts/${t.slug}`,
      lastModified: t.updatedAt,
      changeFrequency: 'monthly',
      priority: 0.7,
    }))

    return [...staticRoutes, ...projectRoutes, ...thoughtRoutes]
  } catch {
    // DB not available — return static routes only
    return staticRoutes
  }
}
