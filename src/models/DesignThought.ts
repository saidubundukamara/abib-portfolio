import { Schema, model, models, InferSchemaType } from 'mongoose'

/** Recursively extract plain text from a Tiptap JSON node */
function extractText(node: Record<string, unknown>): string {
  if (node.type === 'text') return (node.text as string) ?? ''
  if (Array.isArray(node.content)) {
    return (node.content as Record<string, unknown>[]).map(extractText).join(' ')
  }
  return ''
}

function calcReadTime(content: unknown): number {
  if (!content || typeof content !== 'object') return 1
  const wordCount = extractText(content as Record<string, unknown>)
    .split(/\s+/)
    .filter(Boolean).length
  return Math.max(1, Math.ceil(wordCount / 200))
}

const DesignThoughtSchema = new Schema({
  title:         { type: String, required: true },
  slug:          { type: String, required: true, unique: true },
  excerpt:       { type: String, required: true },
  content:       { type: Schema.Types.Mixed, default: null }, // Tiptap JSON
  coverImageUrl: { type: String, default: '' },
  readTime:      { type: Number, default: 1 },
  published:     { type: Boolean, default: false },
  publishedAt:   { type: Date, default: null },
  metadata: {
    ogTitle:       { type: String, default: '' },
    ogDescription: { type: String, default: '' },
    ogImage:       { type: String, default: '' },
  },
}, { timestamps: true })

DesignThoughtSchema.pre('save', async function () {
  if (this.isModified('content')) {
    this.readTime = calcReadTime(this.content)
  }
  if (this.isModified('published') && this.published && !this.publishedAt) {
    this.publishedAt = new Date()
  }
})

export type IDesignThought = InferSchemaType<typeof DesignThoughtSchema>
export const DesignThought = models.DesignThought ?? model('DesignThought', DesignThoughtSchema)
