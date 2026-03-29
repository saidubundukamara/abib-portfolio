import { Schema, model, models, InferSchemaType } from 'mongoose'

const ContactMessageSchema = new Schema({
  name:    { type: String, required: true },
  email:   { type: String, required: true },
  budget:  { type: String, default: '' },
  message: { type: String, required: true },
}, { timestamps: true })

export type IContactMessage = InferSchemaType<typeof ContactMessageSchema>
export const ContactMessage = models.ContactMessage ?? model('ContactMessage', ContactMessageSchema)
