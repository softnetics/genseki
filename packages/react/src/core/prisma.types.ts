interface PrismaUpdateArgs {
  where: Record<string, any>
  data: Record<string, any>
}

interface PrismaFindManyArgs {
  where?: Record<string, any>
  orderBy?: Record<string, any>
  take?: number
  skip?: number
}

interface PrismaFindFirstArgs {
  where?: Record<string, any>
  orderBy?: Record<string, any>
}

interface PrismaFindUniqueArgs {
  where: Record<string, any>
}

interface PrismaCreateArgs {
  data: Record<string, any>
}

interface PrismaDeleteArgs {
  where: Record<string, any>
}

export interface MockPrismaClient {
  [key: string]: {
    findMany: (args?: PrismaFindManyArgs) => Promise<any[]>
    findFirst: (args?: PrismaFindFirstArgs) => Promise<any | null>
    findUnique: (args?: PrismaFindUniqueArgs) => Promise<any | null>
    create: (args?: PrismaCreateArgs) => Promise<any>
    update: (args?: PrismaUpdateArgs) => Promise<any>
    delete: (args?: PrismaDeleteArgs) => Promise<any>
  }
}
