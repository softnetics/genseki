import z from 'zod'

import type {
  CollectionCreateApiHandler,
  CollectionCreateApiReturn,
  CollectionDeleteApiHandler,
  CollectionDeleteApiReturn,
  CollectionFindOneApiHandler,
  CollectionFindOneApiReturn,
  CollectionListApiHandler,
  CollectionListApiReturn,
  CollectionUpdateApiHandler,
  CollectionUpdateApiReturn,
  CollectionUpdateDefaultApiHandler,
  CollectionUpdateDefaultApiReturn,
} from './collection'
import type { ListConfiguration } from './collection'
import { type InferCreateFields, type InferUpdateFields } from './collection'
import type { AnyContextable, Contextable } from './context'
import { type ApiRoute, createEndpoint } from './endpoint'
import { HttpInternalServerError } from './error'
import { type FieldOptionsCallback, type Fields, type FieldsOptions } from './field'
import { DataType, type ModelSchemas } from './model'
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
): CollectionCreateApiHandler<TContext, TFields> {
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
): CollectionUpdateApiHandler<TContext, TFields> {
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
): CollectionDeleteApiHandler<TContext, TFields> {
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
): CollectionFindOneApiHandler<TContext, TFields> {
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

function createCollectionDefaultListHandler<TContext extends Contextable, TFields extends Fields>(
  config: { schema: ModelSchemas; context: TContext },
  fields: Fields,
  listConfiguration?: ListConfiguration<TFields>
): CollectionListApiHandler<TContext, TFields> {
  const prisma = config.context.getPrismaClient()
  const model = config.schema[fields.config.prismaModelName]

  return async (args) => {
    const page = args.page || 1
    const pageSize = args.pageSize || 10
    const search = args.search
    const sortBy = args.sortBy
    const sortOrder = args.sortOrder

    const where: any = {}

    // console.log('model >> ', model) // type ?
    // console.log('listConfiguration >>> ', listConfiguration) // ?? whats this
    console.log('+++++ What am I getting at api side >> ', args)

    // Filter === Where

    // Configured searchable columns.
    if (search && search.trim()) {
      const searchFields = listConfiguration?.search
        ? listConfiguration.search.filter(
            (field) => model.shape.columns[field as string]?.dataType === DataType.STRING
          )
        : Object.keys(model.shape.columns).filter(
            (key) => model.shape.columns[key].dataType === DataType.STRING
          )

      if (searchFields.length > 0) {
        where.OR = searchFields.map((field) => ({
          [field]: {
            contains: search.trim(),
            mode: 'insensitive',
          },
        }))
      }
    }

    // Configured sortable columns.
    const orderBy: any = {}
    if (sortBy) {
      const isValidSortField =
        !listConfiguration?.sortBy || listConfiguration.sortBy.includes(sortBy as any)

      if (isValidSortField && model.shape.columns[sortBy]) {
        orderBy[sortBy] = sortOrder ?? 'asc'
      } else {
        const primaryField = model.shape.columns[model.shape.primaryFields[0]]
        orderBy[primaryField.name] = sortOrder ?? 'asc'
      }
    } else {
      // Use default sort configuration.
      if (listConfiguration?.sortBy && listConfiguration.sortBy.length > 0) {
        const defaultSortField = listConfiguration.sortBy[0]
        if (model.shape.columns[defaultSortField as string]) {
          orderBy[defaultSortField] = 'desc'
        } else {
          const primaryField = model.shape.columns[model.shape.primaryFields[0]]
          orderBy[primaryField.name] = 'asc'
        }
      } else {
        const primaryField = model.shape.columns[model.shape.primaryFields[0]]
        orderBy[primaryField.name] = 'asc'
      }
    }

    const response = await prisma[model.config.prismaModelName].findMany({
      select: transformFieldsToPrismaSelectPayload(fields),
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy,
      where,
    })

    const total = await prisma[model.config.prismaModelName].count({
      where,
    })

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
    200: ToZodObject<CollectionCreateApiReturn>
  }
}>

export function getCollectionDefaultCreateApiRoute(args: {
  slug: string
  context: AnyContextable
  schema: ModelSchemas
  fields: Fields
  customHandler?: CollectionCreateApiHandler<AnyContextable, Fields>
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
    200: ToZodObject<CollectionUpdateApiReturn>
  }
}>

export function getCollectionDefaultUpdateApiRoute(args: {
  slug: string
  context: AnyContextable
  schema: ModelSchemas
  fields: Fields
  customHandler?: CollectionUpdateApiHandler<AnyContextable, Fields>
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
    200: ToZodObject<CollectionUpdateDefaultApiReturn<TFields>>
  }
}>

export function getCollectionDefaultUpdateDefaultApiRoute(args: {
  slug: string
  context: AnyContextable
  schema: ModelSchemas
  fields: Fields
  customHandler?: CollectionUpdateDefaultApiHandler<AnyContextable, Fields>
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
    200: ToZodObject<CollectionDeleteApiReturn>
  }
}>

export function getCollectionDefaultDeleteApiRoute(args: {
  slug: string
  context: AnyContextable
  schema: ModelSchemas
  fields: Fields
  customHandler?: CollectionDeleteApiHandler<AnyContextable, Fields>
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
    200: ToZodObject<CollectionFindOneApiReturn<TFields>>
  }
}>

export function getCollectionDefaultFindOneApiRoute(args: {
  slug: string
  context: AnyContextable
  schema: ModelSchemas
  fields: Fields
  customHandler?: CollectionFindOneApiHandler<AnyContextable, Fields>
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

export type CollectionListApiRoute<TSlug extends string, TFields extends Fields> = ApiRoute<{
  path: `/${TSlug}`
  method: 'GET'
  query: ToZodObject<{
    limit?: string
    offset?: string
    orderBy?: string
    orderType?: 'asc' | 'desc'
  }>
  responses: {
    200: ToZodObject<CollectionListApiReturn<TFields>>
  }
}>

export function getCollectionDefaultListApiRoute(args: {
  slug: string
  context: AnyContextable
  schema: ModelSchemas
  fields: Fields
  customHandler?: CollectionListApiHandler<AnyContextable, Fields>
  listConfiguration?: ListConfiguration<Fields>
}) {
  const defaultHandler = createCollectionDefaultListHandler(
    { schema: args.schema, context: args.context },
    args.fields,
    args.listConfiguration
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
        search: z.string().optional(),
        sortBy: z.string().optional(),
        sortOrder: z.enum(['asc', 'desc']).optional(),
        filter: z.string().optional(),
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
        search: payload.query.search,
        sortBy: payload.query.sortBy,
        sortOrder: payload.query.sortOrder,
        filter: payload.query.filter,
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
    route: route as unknown as CollectionListApiRoute<string, Fields>,
    handler,
    defaultHandler,
  }
}

export type CollectionFieldsOptionsApiRoute<TPath extends string> = ApiRoute<{
  path: TPath
  method: 'POST'
  query: ToZodObject<{ name: string }>
  body: z.ZodOptional<z.ZodAny>
  responses: {
    200: ToZodObject<{
      label: string
      value: string | number
    }>
  }
}>

export function getOptionsRoute<TPath extends string>(
  context: AnyContextable,
  path: TPath,
  fieldsOptions: FieldsOptions
) {
  const route = createEndpoint(
    context,
    {
      method: 'POST',
      path: path,
      query: z.object({
        name: z.string(),
      }),
      body: z.any(),
      responses: {
        200: z.object({
          disabled: z.boolean().optional(),
          options: z
            .object({
              label: z.string(),
              value: z.union([z.string(), z.number()]),
            })
            .array(),
        }),
      },
    },
    async (payload) => {
      const name = ((payload as any).query as { name: string }).name
      const body = (payload as any).body as { [key: string]: any }
      const optionsFn = fieldsOptions[name as keyof FieldsOptions] as FieldOptionsCallback

      if (!optionsFn) {
        throw new HttpInternalServerError(`Field options "${name}" not found`)
      }

      const result = await optionsFn({ context: payload.context, body: body })

      return {
        status: 200,
        body: result,
      }
    }
  )

  return { route }
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
  (TOptions['create'] extends { options: FieldsOptions<any, any> }
    ? {
        createOptions: CollectionFieldsOptionsApiRoute<`/${TSlug}/create/options`>
      }
    : {}) &
  (TOptions['update'] extends { fields: Fields }
    ? {
        update: CollectionUpdateApiRoute<TSlug, TOptions['update']['fields']>
        updateDefault: CollectionUpdateDefaultApiRoute<TSlug, TOptions['update']['fields']>
      }
    : {}) &
  (TOptions['update'] extends { options: FieldsOptions<any, any> }
    ? {
        updateOptions: CollectionFieldsOptionsApiRoute<`/${TSlug}/update/options`>
      }
    : {}) &
  (TOptions['list'] extends { fields: Fields }
    ? {
        findMany: CollectionListApiRoute<TSlug, TOptions['list']['fields']>
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
