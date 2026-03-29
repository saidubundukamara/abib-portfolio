import { ImageResponse } from 'next/og'
import { connectDB } from '@/lib/mongodb'
import { DesignThought } from '@/models/DesignThought'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  let title = 'Design Thought'
  let coverImageUrl = ''

  try {
    await connectDB()
    const thought = await DesignThought.findOne(
      { slug, published: true },
      'title coverImageUrl metadata',
    ).lean()
    if (thought) {
      title = (thought.metadata?.ogTitle as string) || thought.title
      coverImageUrl = (thought.metadata?.ogImage as string) || thought.coverImageUrl || ''
    }
  } catch {
    // fallback
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
