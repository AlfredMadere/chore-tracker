// src/lib/prisma.ts

import { PrismaClient } from '@/generated/prisma'

declare global {
  // Allow globalThis.prisma to be reused across module reloads in dev
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

const prisma = globalThis.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma
}

export default prisma
