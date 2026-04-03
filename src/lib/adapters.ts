import type {
  SerializedProject,
  SerializedThought,
  SerializedProfile,
  SerializedTool,
  SerializedCertification,
  SerializedContactMessage,
} from '@/types'

// Prisma v7 returns opaque types from @ts-nocheck'd generated files.
// We accept `any` from the Prisma client and produce typed serialized shapes.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PrismaRow = any

export function toSerializedProject(p: PrismaRow): SerializedProject {
  return {
    id:            p.id,
    title:         p.title,
    slug:          p.slug,
    excerpt:       p.excerpt,
    content:       p.content,
    category:      p.category,
    coverImageUrl: p.coverImageUrl,
    images:        p.images,
    tools:         p.tools,
    featured:      p.featured,
    published:     p.published,
    publishedAt:   p.publishedAt ? (p.publishedAt instanceof Date ? p.publishedAt.toISOString() : p.publishedAt) : null,
    createdAt:     p.createdAt instanceof Date ? p.createdAt.toISOString() : p.createdAt,
    updatedAt:     p.updatedAt instanceof Date ? p.updatedAt.toISOString() : p.updatedAt,
    metadata: {
      ogTitle:       p.ogTitle,
      ogDescription: p.ogDescription,
      ogImage:       p.ogImage,
    },
  }
}

export function toSerializedThought(t: PrismaRow): SerializedThought {
  return {
    id:            t.id,
    title:         t.title,
    slug:          t.slug,
    excerpt:       t.excerpt,
    content:       t.content,
    coverImageUrl: t.coverImageUrl,
    readTime:      t.readTime,
    published:     t.published,
    publishedAt:   t.publishedAt ? (t.publishedAt instanceof Date ? t.publishedAt.toISOString() : t.publishedAt) : null,
    createdAt:     t.createdAt instanceof Date ? t.createdAt.toISOString() : t.createdAt,
    updatedAt:     t.updatedAt instanceof Date ? t.updatedAt.toISOString() : t.updatedAt,
    metadata: {
      ogTitle:       t.ogTitle,
      ogDescription: t.ogDescription,
      ogImage:       t.ogImage,
    },
  }
}

export function toSerializedProfile(p: PrismaRow): SerializedProfile {
  return {
    id:                p.id,
    name:              p.name,
    title:             p.title,
    bio:               p.bio,
    avatarUrl:         p.avatarUrl,
    yearsOfExperience: p.yearsOfExperience,
    projectsCompleted: p.projectsCompleted,
    worldwideClients:  p.worldwideClients,
    createdAt:         p.createdAt instanceof Date ? p.createdAt.toISOString() : p.createdAt,
    updatedAt:         p.updatedAt instanceof Date ? p.updatedAt.toISOString() : p.updatedAt,
    socialLinks: {
      dribbble:  p.socialDribbble,
      twitter:   p.socialTwitter,
      instagram: p.socialInstagram,
      email:     p.socialEmail,
      youtube:   p.socialYoutube,
    },
  }
}

export function toSerializedTool(t: PrismaRow): SerializedTool {
  return {
    id:          t.id,
    name:        t.name,
    description: t.description,
    logoUrl:     t.logoUrl,
    externalUrl: t.externalUrl,
    category:    t.category,
    order:       t.order,
    createdAt:   t.createdAt instanceof Date ? t.createdAt.toISOString() : t.createdAt,
    updatedAt:   t.updatedAt instanceof Date ? t.updatedAt.toISOString() : t.updatedAt,
  }
}

export function toSerializedCertification(c: PrismaRow): SerializedCertification {
  return {
    id:            c.id,
    name:          c.name,
    issuer:        c.issuer,
    year:          c.year,
    credentialUrl: c.credentialUrl,
    badgeImageUrl: c.badgeImageUrl,
    order:         c.order,
    createdAt:     c.createdAt instanceof Date ? c.createdAt.toISOString() : c.createdAt,
    updatedAt:     c.updatedAt instanceof Date ? c.updatedAt.toISOString() : c.updatedAt,
  }
}

export function toSerializedMessage(m: PrismaRow): SerializedContactMessage {
  return {
    id:        m.id,
    name:      m.name,
    email:     m.email,
    budget:    m.budget,
    message:   m.message,
    createdAt: m.createdAt instanceof Date ? m.createdAt.toISOString() : m.createdAt,
    updatedAt: m.updatedAt instanceof Date ? m.updatedAt.toISOString() : m.updatedAt,
  }
}
