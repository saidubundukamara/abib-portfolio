import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const UserSchema = new mongoose.Schema({
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  name:     { type: String, required: true },
  role:     { type: String, enum: ['admin'], default: 'admin' },
}, { timestamps: true })

async function seed() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    console.error('MONGODB_URI is not set in .env.local')
    process.exit(1)
  }

  await mongoose.connect(uri)
  console.log('Connected to MongoDB')

  const UserModel = mongoose.models.User ?? mongoose.model('User', UserSchema)

  const existing = await UserModel.findOne({ email: 'admin@portfolio.com' })
  if (existing) {
    console.log('Admin user already exists: admin@portfolio.com')
    process.exit(0)
  }

  const hash = await bcrypt.hash('changeme123', 12)
  await UserModel.create({
    email:    'admin@portfolio.com',
    password: hash,
    name:     'Admin',
    role:     'admin',
  })

  console.log('✓ Admin user created:')
  console.log('  Email:    admin@portfolio.com')
  console.log('  Password: changeme123')
  console.log('  → Change the password after first login!')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
