import { PrismaClient } from '@prisma/client'

// allow using a separate url for tests; useful for in-memory sqlite
const datasourceUrl = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
  datasources: {
    db: {
      url: datasourceUrl,
    },
  },
})

export default prisma