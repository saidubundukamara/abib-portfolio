import { Schema, model, models, InferSchemaType } from 'mongoose'

const CertificationSchema = new Schema({
  name:          { type: String, required: true },
  issuer:        { type: String, required: true },
  year:          { type: Number, required: true },
  credentialUrl: { type: String, default: '' },
  badgeImageUrl: { type: String, default: '' },
  order:         { type: Number, default: 0 },
}, { timestamps: true })

export type ICertification = InferSchemaType<typeof CertificationSchema>
export const Certification = models.Certification ?? model('Certification', CertificationSchema)
