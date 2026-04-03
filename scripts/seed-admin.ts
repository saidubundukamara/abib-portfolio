import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import bcrypt from 'bcryptjs'

async function seed() {
  const url = process.env.DATABASE_URL
  if (!url) {
    console.error('DATABASE_URL is not set in .env.local')
    process.exit(1)
  }

  const adapter = new PrismaNeon({ connectionString: url })
  const prisma = new PrismaClient({ adapter })

  console.log('Connected to Neon Postgres')

  const existing = await prisma.user.findUnique({ where: { email: 'admin@portfolio.com' } })
  if (existing) {
    console.log('Admin user already exists: admin@portfolio.com')
    await prisma.$disconnect()
    process.exit(0)
  }

  const hash = await bcrypt.hash('changeme123', 12)
  await prisma.user.create({
    data: {
      email:    'admin@portfolio.com',
      password: hash,
      name:     'Admin',
      role:     'admin',
    },
  })

  console.log('✓ Admin user created:')
  console.log('  Email:    admin@portfolio.com')
  console.log('  Password: changeme123')
  console.log('  → Change the password after first login!')

  await prisma.$disconnect()
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
