interface PrismaUpdateArgs {
  where: Record<string, any>
  data: Record<string, any>
}

interface PrismaUpdateManyArgs {
  where: Record<string, any>
  data: Record<string, any>
}

interface PrismaUpsertArgs {
  select: Record<string, any>
  where: Record<string, any>
  create: Record<string, any>
  update: Record<string, any>
}

interface PrismaFindManyArgs {
  select?: Record<string, any>
  where?: Record<string, any>
  orderBy?: Record<string, any>
  take?: number
  skip?: number
}

interface PrismaFindFirstArgs {
  select?: Record<string, any>
  where?: Record<string, any>
  orderBy?: Record<string, any>
}

interface PrismaFindUniqueArgs {
  select?: Record<string, any>
  where: Record<string, any>
  orderBy?: Record<string, any>
}

interface PrismaCreateArgs {
  select?: Record<string, any>
  data: Record<string, any>
}

interface PrismaDeleteArgs {
  where: Record<string, any>
}

interface PrismaDeleteManyArgs {
  where?: Record<string, any>
}

interface PrismaCountArgs {
  where?: Record<string, any>
}

export type MockPrismaClient = {
  [key: string]: {
    findMany: (args?: PrismaFindManyArgs) => Promise<any[]>
    findFirst: (args: PrismaFindFirstArgs) => Promise<any | null>
    findUnique: (args: PrismaFindUniqueArgs) => Promise<any | null>
    create: (args: PrismaCreateArgs) => Promise<any>
    update: (args: PrismaUpdateArgs) => Promise<any>
    updateMany: (args: PrismaUpdateManyArgs) => Promise<any>
    upsert: (args: PrismaUpsertArgs) => Promise<any>
    delete: (args: PrismaDeleteArgs) => Promise<any>
    deleteMany: (args?: PrismaDeleteManyArgs) => Promise<any>
    count: (args?: PrismaCountArgs) => Promise<number>
  } & {}
} & {
  $transaction<T>(cb: (tx: MockPrismaClient) => Promise<T> | T): Promise<T>
} & {}

export type PrismaSearchCondition = {
  [fieldName: string]:
    | {
        contains: string
        mode: 'insensitive'
      }
    | PrismaSearchCondition
}

export type PrismaOrderByCondition = {
  [fieldName: string]: string | PrismaOrderByCondition
}
