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
import { type ModelSchemas } from './model'
import type { PrismaOrderByCondition, PrismaSearchCondition } from './prisma.types'
import {
  transformFieldPayloadToPrismaCreatePayload,
  transformFieldPayloadToPrismaUpdatePayload,
  transformFieldPayloadToUpdateOrderPayload,
  transformFieldsToPrismaSelectPayload,
  transformPrismaResultToFieldsPayload,
} from './transformer'
import { isFieldRelation, type ToZodObject } from './utils'

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
    const updateTransformedData = transformFieldPayloadToUpdateOrderPayload(args.fields, args.data)
    const result = await prisma.$transaction(async (tx) => {
      const result = tx[model.config.prismaModelName].create({
        data: transformedData,
      })
      Object.entries(updateTransformedData).map(async ([key, value]) => {
        if (Array.isArray(value)) {
          await Promise.all(
            value.map(async (item) => {
              await tx[key].update(item)
            })
          )
        } else {
          await tx[key].update(value)
        }
      })

      return result
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

export function buildSearchCondition(
  path: string | string[],
  searchValue: string,
  fields: Fields
): PrismaSearchCondition {
  const pathSegments = typeof path === 'string' ? path.split('.') : path
  if (pathSegments.length === 1) {
    const fieldName = pathSegments[0]
    return {
      [fieldName]: {
        contains: searchValue,
        mode: 'insensitive',
      },
    }
  }

  const [currentRelationName, ...remainingPathSegments] = pathSegments
  const currentFieldDefinition = fields.shape[currentRelationName]

  if (isFieldRelation(currentFieldDefinition)) {
    const prismaRelationName = currentFieldDefinition.$server.relation.name

    const nestedFields = 'fields' in currentFieldDefinition ? currentFieldDefinition.fields : fields

    return {
      [prismaRelationName]: buildSearchCondition(remainingPathSegments, searchValue, nestedFields),
    }
  }

  return {
    [currentRelationName]: buildSearchCondition(remainingPathSegments, searchValue, fields),
  }
}

export function buildOrderByCondition(
  pathSegments: string[],
  sortDirection: string,
  fields: Fields
): PrismaOrderByCondition {
  if (pathSegments.length === 0) return {}

  if (pathSegments.length === 1) {
    return { [pathSegments[0]]: sortDirection }
  }

  const [currentSegment, ...remainingSegments] = pathSegments
  const currentFieldDefinition = fields.shape[currentSegment]

  if (isFieldRelation(currentFieldDefinition)) {
    const prismaRelationName = currentFieldDefinition.$server.relation.name

    const nestedFields = 'fields' in currentFieldDefinition ? currentFieldDefinition.fields : fields

    return {
      [prismaRelationName]: buildOrderByCondition(remainingSegments, sortDirection, nestedFields),
    }
  }

  return {
    [currentSegment]: buildOrderByCondition(remainingSegments, sortDirection, fields),
  }
}
export function createOrderByCondition(
  sortPath: string | undefined,
  sortDirection: string | undefined,
  allowedSortPaths: any,
  model: any,
  fields: Fields
): PrismaOrderByCondition[] {
  if (sortPath) {
    const allowedPaths = allowedSortPaths?.sortBy?.map(
      (item: ([string, 'asc' | 'desc'] | [string])[]) => item[0]
    )

    const isAllowedSortPath = !allowedSortPaths?.sortBy || allowedPaths.includes(sortPath)

    if (isAllowedSortPath) {
      const pathSegments = sortPath.split('.')
      if (pathSegments.length > 1) {
        return [buildOrderByCondition(pathSegments, sortDirection ?? 'asc', fields)]
      } else if (model.shape.columns[sortPath]) {
        return [{ [sortPath]: sortDirection ?? 'asc' }]
      } else {
        const primaryFieldDefinition = model.shape.columns[model.shape.primaryFields[0]]
        return [{ [primaryFieldDefinition.name]: sortDirection ?? 'asc' }]
      }
    } else {
      const primaryFieldDefinition = model.shape.columns[model.shape.primaryFields[0]]
      return [{ [primaryFieldDefinition.name]: sortDirection ?? 'asc' }]
    }
  } else {
    if (allowedSortPaths?.sortBy && allowedSortPaths.sortBy.length > 0) {
      const orderByArray = allowedSortPaths.sortBy.map((sortConfig: any) => {
        const [defaultSortPath, direction = 'asc'] = sortConfig
        const pathSegments = defaultSortPath.split('.')
        if (pathSegments.length > 1) {
          return buildOrderByCondition(pathSegments, direction, fields)
        } else if (model.shape.columns[defaultSortPath]) {
          return { [defaultSortPath]: direction }
        } else {
          const primaryFieldDefinition = model.shape.columns[model.shape.primaryFields[0]]
          return { [primaryFieldDefinition.name]: 'asc' }
        }
      })

      return orderByArray
    } else {
      const primaryFieldDefinition = model.shape.columns[model.shape.primaryFields[0]]
      return [{ [primaryFieldDefinition.name]: 'asc' }]
    }
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

    if (search && search.trim()) {
      const searchConditions: any[] = []
      const searchFields = listConfiguration?.search || []

      for (const fieldPath of searchFields) {
        const searchCondition = buildSearchCondition(fieldPath, search.trim(), fields)
        if (searchCondition) {
          searchConditions.push(searchCondition)
        }
      }

      if (searchConditions.length > 0) {
        where.OR = searchConditions
      }
    }
    const orderBy = createOrderByCondition(sortBy, sortOrder, listConfiguration, model, fields)

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

export function getCollectionDefaultListApiRoute<TFields extends Fields>(args: {
  slug: string
  context: AnyContextable
  schema: ModelSchemas
  fields: TFields
  customHandler?: CollectionListApiHandler<AnyContextable, TFields>
  listConfiguration?: ListConfiguration<TFields>
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
    route: route as unknown as CollectionListApiRoute<string, TFields>,
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
