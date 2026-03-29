import { Schema, model, models, InferSchemaType } from 'mongoose'

const ToolSchema = new Schema({
  name:        { type: String, required: true },
  description: { type: String, required: true },
  logoUrl:     { type: String, default: '' },
  externalUrl: { type: String, default: '' },
  category:    { type: String, default: '' },
  order:       { type: Number, default: 0 },
}, { timestamps: true })

export type ITool = InferSchemaType<typeof ToolSchema>
export const Tool = models.Tool ?? model('Tool', ToolSchema)
