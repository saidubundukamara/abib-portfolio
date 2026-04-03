import { ImageResponse } from 'next/og'
import { prisma } from '@/lib/prisma'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  let title = 'Portfolio Project'
  let coverImageUrl = ''

  try {
    const project = await prisma.project.findFirst({ where: { slug, published: true } })
    if (project) {
      title = project.ogTitle || project.title
      coverImageUrl = project.ogImage || project.coverImageUrl || ''
    }
  } catch {
    // fallback to defaults
  }

  return new ImageResponse(
    (
      <div
        style={{
          background: 'rgb(21,19,18)',
          color: '#ffffff',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: 60,
          position: 'relative',
        }}
      >
        {coverImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverImageUrl}
            alt=""
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.35,
            }}
          />
        )}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(21,19,18,0.95) 40%, transparent)',
          }}
        />
        <div style={{ position: 'relative', fontSize: 52, fontWeight: 700, lineHeight: 1.1 }}>
          {title}
        </div>
      </div>
    ),
  )
}
