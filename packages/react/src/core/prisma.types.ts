interface PrismaUpdateArgs {
  where: any
  data: any
}

interface PrismaUpdateManyArgs {
  where: any
  data: any
}

interface PrismaUpsertArgs {
  where: any
  create: any
  update: any
}

interface PrismaFindManyArgs {
  select?: Record<string, any>
  where?: any
  orderBy?: any
  take?: number
  skip?: number
}

interface PrismaFindFirstArgs {
  select?: Record<string, any>
  where?: any
  orderBy?: any
}

interface PrismaFindUniqueArgs {
  select?: Record<string, any>
  where: any
  orderBy?: any
}

interface PrismaCreateArgs {
  data: any
}

interface PrismaDeleteArgs {
  where: any
}

interface PrismaDeleteManyArgs {
  where?: any
}

interface PrismaCountArgs {
  where?: any
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
