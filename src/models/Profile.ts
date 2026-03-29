import { Schema, model, models, InferSchemaType } from 'mongoose'

const ProfileSchema = new Schema({
  name:  { type: String, required: true },
  title: { type: String, required: true },
  bio:   { type: String, required: true },
  avatarUrl: { type: String, default: '' },
  socialLinks: {
    dribbble:  { type: String, default: '' },
    twitter:   { type: String, default: '' },
    instagram: { type: String, default: '' },
    email:     { type: String, default: '' },
  },
  yearsOfExperience: { type: Number, default: 0 },
  projectsCompleted: { type: Number, default: 0 },
  worldwideClients:  { type: Number, default: 0 },
}, { timestamps: true })

export type IProfile = InferSchemaType<typeof ProfileSchema>
export const Profile = models.Profile ?? model('Profile', ProfileSchema)
