import z from 'zod/v4'

import type { ApiDefaultMethod } from './collection'
import { type ApiReturnType, type InferCreateFields, type InferUpdateFields } from './collection'
import { type ApiConfigHandlerFn } from './collection'
import type { AnyContextable, Contextable } from './context'
import { type ApiRoute, createEndpoint } from './endpoint'
import { type Fields } from './field'
import type { ModelSchemas } from './model'
import {
  transformFieldPayloadToPrismaCreatePayload,
  transformFieldPayloadToPrismaUpdatePayload,
  transformFieldsToPrismaSelectPayload,
  transformPrismaResultToFieldsPayload,
} from './transformer'
import type { ToZodObject } from './utils'

const zStringPositiveNumberOptional = z
  .string()
  .optional()
  .refine((val) => val === undefined || !isNaN(Number(val)), {
    message: 'Value must be a positive number or undefined',
  })
  .refine((val) => val === undefined || Number(val) > 0, {
    message: 'Value must be a positive number',
  })
  .transform((val) => (val ? Number(val) : undefined))

function createCollectionDefaultCreateHandler<TContext extends Contextable, TFields extends Fields>(
  config: { schema: ModelSchemas; context: TContext },
  fields: Fields
): ApiConfigHandlerFn<TContext, TFields, typeof ApiDefaultMethod.CREATE> {
  const prisma = config.context.getPrismaClient()

  const model = config.schema[fields.config.prismaModelName]
  const primaryField = model.shape.columns[model.shape.primaryFields[0]]

  return async (args) => {
    const transformedData = transformFieldPayloadToPrismaCreatePayload(args.fields, args.data)
    const result = await prisma[model.config.prismaModelName].create({
      data: transformedData,
    })

    const __id = result[fields.config.identifierColumn]
    const __pk = result[primaryField.name]
    return { __id: __id, __pk: __pk }
  }
}

function createCollectionDefaultUpdateHandler<TContext extends Contextable, TFields extends Fields>(
  config: { schema: ModelSchemas; context: TContext },
  fields: Fields
): ApiConfigHandlerFn<TContext, TFields, typeof ApiDefaultMethod.UPDATE> {
  const prisma = config.context.getPrismaClient()

  const model = config.schema[fields.config.prismaModelName]
  const primaryField = model.shape.columns[model.shape.primaryFields[0]]

  return async (args) => {
    const transformedData = transformFieldPayloadToPrismaUpdatePayload(args.fields, args.data)
    const result = await prisma[model.config.prismaModelName].update({
      where: { [primaryField.name]: args.id },
      data: transformedData,
    })

    const __id = result[fields.config.identifierColumn]
    const __pk = result[primaryField.name]
    return { __id: __id, __pk: __pk }
  }
}

function createCollectionDefaultDeleteHandler<TContext extends Contextable, TFields extends Fields>(
  config: { schema: ModelSchemas; context: TContext },
  fields: Fields
): ApiConfigHandlerFn<TContext, TFields, typeof ApiDefaultMethod.DELETE> {
  const prisma = config.context.getPrismaClient()

  const model = config.schema[fields.config.prismaModelName]
  const primaryField = model.shape.columns[model.shape.primaryFields[0]]

  return async (args) => {
    await prisma[model.config.prismaModelName].deleteMany({
      where: { [primaryField.name]: { in: args.ids } },
    })

    return {
      success: true,
    }
  }
}

function createCollectionDefaultFindOneHandler<
  TContext extends Contextable,
  TFields extends Fields,
>(
  config: { schema: ModelSchemas; context: TContext },
  fields: Fields
): ApiConfigHandlerFn<TContext, TFields, typeof ApiDefaultMethod.FIND_ONE> {
  const prisma = config.context.getPrismaClient()

  return async (args) => {
    const result = await prisma[fields.config.prismaModelName].findUnique({
      select: transformFieldsToPrismaSelectPayload(fields),
      where: { [fields.config.primaryColumn]: args.id },
    })
    const transformedResult = transformPrismaResultToFieldsPayload(fields, result)
    return transformedResult as any
  }
}

function createCollectionDefaultFindManyHandler<
  TContext extends Contextable,
  TFields extends Fields,
>(
  config: { schema: ModelSchemas; context: TContext },
  fields: Fields
): ApiConfigHandlerFn<TContext, TFields, typeof ApiDefaultMethod.FIND_MANY> {
  const prisma = config.context.getPrismaClient()

  const model = config.schema[fields.config.prismaModelName]

  return async (args) => {
    const page = args.page || 1
    const pageSize = args.pageSize || 10

    const response = await prisma[model.config.prismaModelName].findMany({
      select: transformFieldsToPrismaSelectPayload(fields),
      skip: (page - 1) * pageSize,
      take: pageSize,
    })

    const total = await prisma[model.config.prismaModelName].count()

    return {
      total,
      totalPage: Math.ceil(total / pageSize),
      currentPage: Math.ceil((page - 1) / pageSize) + 1,
      data: response.map((item) => transformPrismaResultToFieldsPayload(fields, item) as any),
    }
  }
}

export type CollectionCreateApiRoute<TSlug extends string, TFields extends Fields> = ApiRoute<{
  path: `/${TSlug}`
  method: 'POST'
  body: ToZodObject<InferCreateFields<TFields>>
  responses: {
    200: ToZodObject<ApiReturnType<typeof ApiDefaultMethod.CREATE, TFields>>
  }
}>

export function getCollectionDefaultCreateApiRoute(args: {
  slug: string
  context: AnyContextable
  schema: ModelSchemas
  fields: Fields
  customHandler?: ApiConfigHandlerFn<AnyContextable, Fields, typeof ApiDefaultMethod.CREATE>
}) {
  const defaultHandler = createCollectionDefaultCreateHandler(
    { schema: args.schema, context: args.context },
    args.fields
  )

  const handler = args.customHandler ?? defaultHandler

  const route = createEndpoint(
    args.context,
    {
      method: 'POST',
      path: `/${args.slug}`,
      // body: fieldsShapeToZodObject(options.fields.shape, ApiDefaultMethod.CREATE),
      body: z.any(),
      responses: {
        200: z.object({
          __id: z.union([z.string(), z.number()]),
          __pk: z.union([z.string(), z.number()]),
        }),
      },
    },
    async (payload) => {
      const response = await handler({
        slug: args.slug,
        context: payload.context,
        data: payload.body as any,
        fields: args.fields,
        defaultApi: defaultHandler as any,
      })

      return {
        status: 200,
        body: {
          __id: response.__id,
          __pk: response.__pk,
        },
      }
    }
  )

  return {
    route: route as unknown as CollectionCreateApiRoute<string, Fields>,
    handler,
    defaultHandler,
  }
}

export type CollectionUpdateApiRoute<TSlug extends string, TFields extends Fields> = ApiRoute<{
  path: `/${TSlug}/:id`
  method: 'PATCH'
  pathParams: ToZodObject<{ id: string }>
  body: ToZodObject<InferUpdateFields<TFields>>
  responses: {
    200: ToZodObject<ApiReturnType<typeof ApiDefaultMethod.UPDATE, TFields>>
  }
}>

export function getCollectionDefaultUpdateApiRoute(args: {
  slug: string
  context: AnyContextable
  schema: ModelSchemas
  fields: Fields
  customHandler?: ApiConfigHandlerFn<AnyContextable, Fields, typeof ApiDefaultMethod.UPDATE>
}) {
  const defaultHandler = createCollectionDefaultUpdateHandler(
    { schema: args.schema, context: args.context },
    args.fields
  )

  const handler = args.customHandler ?? defaultHandler

  const route = createEndpoint(
    args.context,
    {
      method: 'PATCH',
      path: `/${args.slug}/:id`,
      body: z.any(),
      responses: {
        200: z.object({
          __id: z.union([z.string(), z.number()]),
          __pk: z.union([z.string(), z.number()]),
        }),
      },
    },
    async (payload) => {
      const response = await handler({
        id: payload.pathParams.id,
        slug: args.slug,
        context: payload.context,
        data: payload.body as any,
        fields: args.fields,
        defaultApi: defaultHandler as any,
      })

      return {
        status: 200,
        body: {
          __id: response.__id,
          __pk: response.__pk,
        },
      }
    }
  )

  return {
    route: route as unknown as CollectionUpdateApiRoute<string, Fields>,
    handler,
    defaultHandler,
  }
}

export type CollectionUpdateDefaultApiRoute<
  TSlug extends string,
  TFields extends Fields,
> = ApiRoute<{
  path: `/${TSlug}/update-default/:id`
  method: 'GET'
  pathParams: ToZodObject<{ id: string }>
  responses: {
    200: ToZodObject<ApiReturnType<typeof ApiDefaultMethod.FIND_ONE, TFields>>
  }
}>

export function getCollectionDefaultUpdateDefaultApiRoute(args: {
  slug: string
  context: AnyContextable
  schema: ModelSchemas
  fields: Fields
  // TODO: This should return default values for the form, not just findOne response
  customHandler?: ApiConfigHandlerFn<AnyContextable, Fields, typeof ApiDefaultMethod.FIND_ONE>
}) {
  const defaultHandler = createCollectionDefaultFindOneHandler(
    { schema: args.schema, context: args.context },
    args.fields
  )

  const handler = args.customHandler ?? defaultHandler

  const route = createEndpoint(
    args.context,
    {
      method: 'GET',
      path: `/${args.slug}/update-default/:id`,
      pathParams: z.object({
        id: z.union([z.string(), z.number()]),
      }),
      responses: {
        200: z.any(),
      },
    },
    async (payload) => {
      const response = await handler({
        id: payload.pathParams.id,
        slug: args.slug,
        context: payload.context,
        fields: args.fields,
        defaultApi: defaultHandler as any,
      })

      // TODO: Data transformation might be needed here. In order to match form's update payload structure.

      return {
        status: 200,
        body: response,
      }
    }
  )

  return {
    route: route as unknown as CollectionUpdateDefaultApiRoute<string, Fields>,
    handler,
    defaultHandler,
  }
}

export type CollectionDeleteApiRoute<TSlug extends string> = ApiRoute<{
  path: `/${TSlug}`
  method: 'DELETE'
  body: ToZodObject<{ ids: string[] | number[] }>
  responses: {
    200: ToZodObject<ApiReturnType<typeof ApiDefaultMethod.DELETE, Fields>>
  }
}>

export function getCollectionDefaultDeleteApiRoute(args: {
  slug: string
  context: AnyContextable
  schema: ModelSchemas
  fields: Fields
  customHandler?: ApiConfigHandlerFn<AnyContextable, Fields, typeof ApiDefaultMethod.DELETE>
}) {
  const defaultHandler = createCollectionDefaultDeleteHandler(
    { schema: args.schema, context: args.context },
    args.fields
  )

  const handler = args.customHandler ?? defaultHandler

  const route = createEndpoint(
    args.context,
    {
      method: 'DELETE',
      path: `/${args.slug}`,
      body: z.object({
        ids: z.union([z.string().array(), z.number().array()]),
      }),
      responses: {
        200: z.object({
          success: z.boolean(),
        }),
      },
    },
    async (payload) => {
      const response = await handler({
        ids: payload.body.ids,
        slug: args.slug,
        context: payload.context,
        fields: args.fields,
        defaultApi: defaultHandler as any,
      })

      return {
        status: 200,
        body: {
          success: response.success,
        },
      }
    }
  )

  return {
    route: route as unknown as CollectionDeleteApiRoute<string>,
    handler: handler,
    defaultHandler: defaultHandler,
  }
}

export type CollectionFindOneApiRoute<TSlug extends string, TFields extends Fields> = ApiRoute<{
  path: `/${TSlug}/:id`
  method: 'GET'
  pathParams: ToZodObject<{ id: string }>
  responses: {
    200: ToZodObject<ApiReturnType<typeof ApiDefaultMethod.FIND_ONE, TFields>>
  }
}>

export function getCollectionDefaultFindOneApiRoute(args: {
  slug: string
  context: AnyContextable
  schema: ModelSchemas
  fields: Fields
  customHandler?: ApiConfigHandlerFn<AnyContextable, Fields, typeof ApiDefaultMethod.FIND_ONE>
}) {
  const defaultHandler = createCollectionDefaultFindOneHandler(
    { schema: args.schema, context: args.context },
    args.fields
  )

  const handler = args.customHandler ?? defaultHandler

  const route = createEndpoint(
    args.context,
    {
      method: 'GET',
      path: `/${args.slug}/:id`,
      pathParams: z.object({
        id: z.union([z.string(), z.number()]),
      }),
      responses: {
        200: z.any(),
      },
    },
    async (payload) => {
      const response = await handler({
        id: payload.pathParams.id,
        slug: args.slug,
        context: payload.context,
        fields: args.fields,
        defaultApi: defaultHandler as any,
      })

      return {
        status: 200,
        body: response,
      }
    }
  )

  return {
    route: route as unknown as CollectionFindOneApiRoute<string, Fields>,
    handler,
    defaultHandler,
  }
}

export type CollectionFindManyApiRoute<TSlug extends string, TFields extends Fields> = ApiRoute<{
  path: `/${TSlug}`
  method: 'GET'
  query: ToZodObject<{
    limit?: string
    offset?: string
    orderBy?: string
    orderType?: 'asc' | 'desc'
  }>
  responses: {
    200: ToZodObject<ApiReturnType<typeof ApiDefaultMethod.FIND_MANY, TFields>>
  }
}>

export function getCollectionDefaultFindManyApiRoute(args: {
  slug: string
  context: AnyContextable
  schema: ModelSchemas
  fields: Fields
  customHandler?: ApiConfigHandlerFn<AnyContextable, Fields, typeof ApiDefaultMethod.FIND_MANY>
}) {
  const defaultHandler = createCollectionDefaultFindManyHandler(
    { schema: args.schema, context: args.context },
    args.fields
  )
  const handler = args.customHandler ?? defaultHandler

  const route = createEndpoint(
    args.context,
    {
      method: 'GET',
      path: `/${args.slug}`,
      query: z.object({
        page: zStringPositiveNumberOptional,
        pageSize: zStringPositiveNumberOptional,
      }),
      responses: {
        200: z.object({
          total: z.number(),
          totalPage: z.number(),
          currentPage: z.number(),
          data: z.array(z.any()),
        }),
      },
    },
    async (payload) => {
      const response = await handler({
        slug: args.slug,
        context: payload.context,
        fields: args.fields,
        defaultApi: defaultHandler as any,
        page: payload.query.page ?? 1,
        pageSize: payload.query.pageSize ?? 10,
      })

      return {
        status: 200,
        body: {
          total: response.total,
          totalPage: response.totalPage,
          currentPage: response.currentPage,
          data: response.data,
        },
      }
    }
  )

  return {
    route: route as unknown as CollectionFindManyApiRoute<string, Fields>,
    handler,
    defaultHandler,
  }
}

export type CollectionDefaultAdminApiRouter<
  TSlug extends string,
  TOptions extends {
    create: { fields: Fields } | undefined
    update: { fields: Fields } | undefined
    list: { fields: Fields } | undefined
    one: { fields: Fields } | undefined
    delete: { fields: Fields } | undefined
  },
> = (TOptions['create'] extends { fields: Fields }
  ? {
      create: CollectionCreateApiRoute<TSlug, TOptions['create']['fields']>
    }
  : {}) &
  (TOptions['update'] extends { fields: Fields }
    ? {
        update: CollectionUpdateApiRoute<TSlug, TOptions['update']['fields']>
        updateDefault: CollectionUpdateDefaultApiRoute<TSlug, TOptions['update']['fields']>
      }
    : {}) &
  (TOptions['list'] extends { fields: Fields }
    ? {
        findMany: CollectionFindManyApiRoute<TSlug, TOptions['list']['fields']>
      }
    : {}) &
  (TOptions['one'] extends { fields: Fields }
    ? {
        findOne: CollectionFindOneApiRoute<TSlug, TOptions['one']['fields']>
      }
    : {}) &
  (TOptions['delete'] extends { fields: Fields }
    ? {
        delete: CollectionDeleteApiRoute<TSlug>
      }
    : {})
