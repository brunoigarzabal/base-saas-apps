import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client'

const connectionString = `${process.env.DATABASE_URL}`

export const pgAdapter = new PrismaPg({ connectionString })
export const prisma = new PrismaClient({ adapter: pgAdapter, log: ['query'] })
