import { Schema, model, models, InferSchemaType } from 'mongoose'

const UserSchema = new Schema({
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true }, // bcrypt hash
  name:     { type: String, required: true },
  role:     { type: String, enum: ['admin'], default: 'admin' },
}, { timestamps: true })

export type IUser = InferSchemaType<typeof UserSchema>
export const User = models.User ?? model('User', UserSchema)
