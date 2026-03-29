import { Schema, model, models, InferSchemaType } from 'mongoose'

const PROJECT_CATEGORIES = [
  'logo-design',
  'event-flyers',
  'motion-graphics',
  'social-media',
  'branding',
] as const

const ProjectSchema = new Schema({
  title:         { type: String, required: true },
  slug:          { type: String, required: true, unique: true },
  excerpt:       { type: String, required: true },
  content:       { type: Schema.Types.Mixed, default: null }, // Tiptap JSON
  category:      { type: String, enum: PROJECT_CATEGORIES, required: true },
  coverImageUrl: { type: String, default: '' },
  images:        [{ type: String }],
  tools:         [{ type: String }],
  featured:      { type: Boolean, default: false },
  published:     { type: Boolean, default: false },
  publishedAt:   { type: Date, default: null },
  metadata: {
    ogTitle:       { type: String, default: '' },
    ogDescription: { type: String, default: '' },
    ogImage:       { type: String, default: '' },
  },
}, { timestamps: true })

// Auto-set publishedAt when first published
ProjectSchema.pre('save', async function () {
  if (this.isModified('published') && this.published && !this.publishedAt) {
    this.publishedAt = new Date()
  }
})

export type IProject = InferSchemaType<typeof ProjectSchema>
export const PROJECT_CATEGORY_VALUES = PROJECT_CATEGORIES
export const Project = models.Project ?? model('Project', ProjectSchema)
