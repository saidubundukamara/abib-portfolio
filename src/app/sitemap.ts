import type { MetadataRoute } from 'next'
import { connectDB } from '@/lib/mongodb'
import { Project } from '@/models/Project'
import { DesignThought } from '@/models/DesignThought'
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
    await connectDB()

    const [projects, thoughts] = await Promise.all([
      Project.find({ published: true }, 'slug updatedAt').lean(),
      DesignThought.find({ published: true }, 'slug updatedAt').lean(),
    ])

    const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
      url: `${SITE_URL}/work/${p.slug}`,
      lastModified: p.updatedAt ?? new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    }))

    const thoughtRoutes: MetadataRoute.Sitemap = thoughts.map((t) => ({
      url: `${SITE_URL}/thoughts/${t.slug}`,
      lastModified: t.updatedAt ?? new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    }))

    return [...staticRoutes, ...projectRoutes, ...thoughtRoutes]
  } catch {
    // DB not available — return static routes only
    return staticRoutes
  }
}
