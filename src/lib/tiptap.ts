/**
 * Server-safe Tiptap JSON → HTML renderer.
 * Pure recursive walker — no DOM, no window, works in Node.js RSC.
 */

interface TiptapMark {
  type: string
  attrs?: Record<string, unknown>
}

interface TiptapNode {
  type: string
  attrs?: Record<string, unknown>
  content?: TiptapNode[]
  text?: string
  marks?: TiptapMark[]
}

function esc(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function applyMarks(text: string, marks: TiptapMark[]): string {
  return marks.reduce((html, mark) => {
    switch (mark.type) {
      case 'bold':      return `<strong>${html}</strong>`
      case 'italic':    return `<em>${html}</em>`
      case 'code':      return `<code>${html}</code>`
      case 'strike':    return `<s>${html}</s>`
      case 'underline': return `<u>${html}</u>`
      case 'link': {
        const href = esc(mark.attrs?.href)
        const target = mark.attrs?.target ? ` target="${esc(mark.attrs.target)}"` : ''
        const rel = mark.attrs?.rel ? ` rel="${esc(mark.attrs.rel)}"` : ''
        return `<a href="${href}"${target}${rel}>${html}</a>`
      }
      default: return html
    }
  }, text)
}

function toYoutubeEmbedUrl(url: string): string | null {
  if (!url) return null
  if (url.includes('/embed/')) return url
  // youtu.be/VIDEO_ID
  if (url.includes('youtu.be')) {
    const id = url.split('/').pop()?.split('?')[0]
    return id ? `https://www.youtube.com/embed/${id}` : null
  }
  // youtube.com/watch?v=VIDEO_ID or /shorts/VIDEO_ID
  const m = url.match(/(?:[?&]v=|\/shorts\/)([\w-]+)/)
  return m ? `https://www.youtube.com/embed/${m[1]}` : null
}

function renderNode(node: TiptapNode): string {
  if (node.type === 'text') {
    const escaped = node.text
      ?.replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;') ?? ''
    return node.marks?.length ? applyMarks(escaped, node.marks) : escaped
  }

  const inner = node.content?.map(renderNode).join('') ?? ''

  switch (node.type) {
    case 'doc':             return inner
    case 'paragraph':       return inner ? `<p>${inner}</p>` : '<p></p>'
    case 'hardBreak':       return '<br>'
    case 'horizontalRule':  return '<hr>'
    case 'blockquote':      return `<blockquote>${inner}</blockquote>`
    case 'bulletList':      return `<ul>${inner}</ul>`
    case 'orderedList':     return `<ol>${inner}</ol>`
    case 'listItem':        return `<li>${inner}</li>`
    case 'codeBlock': {
      const lang = node.attrs?.language ? ` class="language-${esc(node.attrs.language)}"` : ''
      return `<pre><code${lang}>${inner}</code></pre>`
    }
    case 'heading': {
      const level = Number(node.attrs?.level ?? 1)
      const tag = `h${Math.min(Math.max(level, 1), 6)}`
      return `<${tag}>${inner}</${tag}>`
    }
    case 'image': {
      const src = esc(node.attrs?.src)
      const alt = node.attrs?.alt ? ` alt="${esc(node.attrs.alt)}"` : ''
      const title = node.attrs?.title ? ` title="${esc(node.attrs.title)}"` : ''
      return `<img src="${src}"${alt}${title}>`
    }
    case 'youtube': {
      const src = toYoutubeEmbedUrl(String(node.attrs?.src ?? ''))
      if (!src) return ''
      const width = esc(node.attrs?.width ?? 640)
      const height = esc(node.attrs?.height ?? 480)
      return `<div class="youtube-embed"><iframe src="${esc(src)}" width="${width}" height="${height}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`
    }
    default: return inner
  }
}

/**
 * Renders a Tiptap JSON document to an HTML string.
 * Safe to call server-side — no DOM is accessed.
 * Returns '' for null/invalid content.
 */
export function renderTiptap(content: unknown): string {
  if (!content) return ''
  try {
    return renderNode(content as TiptapNode)
  } catch (err) {
    console.error('[renderTiptap]', err)
    return ''
  }
}
