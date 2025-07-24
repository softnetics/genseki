import z from 'zod/v4'

import type { ApiDefaultMethod } from './collection'
import {
  type ApiReturnType,
  type InferCreateFieldsShape,
  type InferUpdateFieldsShape,
} from './collection'
import { type ApiConfigHandlerFn, type CollectionOptions } from './collection'
import type { Contextable } from './context'
import { type AnyApiRouter, type ApiRoute, appendApiPathPrefix, createEndpoint } from './endpoint'
import { type Fields } from './field'
import type { ModelSchemas } from './model'
import {
  transformFieldPayloadToPrismaCreatePayload,
  transformFieldPayloadToPrismaUpdatePayload,
} from './transformer'
import type { ToZodObject } from './utils'

function createCollectionDefaultHandler<TContext extends Contextable, TFields extends Fields>(
  config: { schema: ModelSchemas; context: TContext },
  options: CollectionOptions<TContext, TFields, AnyApiRouter>
) {
  const prisma = config.context.getPrismaClient()
  const model = config.schema[options.fields.config.prismaModelName]

  // TODO: Only support single primary key
  const primaryField = model.shape.columns[model.shape.primaryFields[0]]
  const identifierFieldName = options.identifierColumn

  const createHandler: ApiConfigHandlerFn<
    TContext,
    TFields,
    typeof ApiDefaultMethod.CREATE
  > = async (args) => {
    console.log('Create handler called with args:', args)

    const transformedData = transformFieldPayloadToPrismaCreatePayload(args.fields, args.data)
    const result = await prisma[model.config.prismaModelName].create({
      data: transformedData,
    })

    const __id = result[identifierFieldName]
    const __pk = result[primaryField.name]
    return { __id: __id, __pk: __pk }
  }

  const updateHandler: ApiConfigHandlerFn<
    TContext,
    TFields,
    typeof ApiDefaultMethod.UPDATE
  > = async (args) => {
    console.log('Update handler called with args:', args)

    const transformedData = transformFieldPayloadToPrismaUpdatePayload(args.fields, args.data)
    const result = await prisma[model.config.prismaModelName].update({
      where: { [primaryField.name]: args.id },
      data: transformedData,
    })

    const __id = result[identifierFieldName]
    const __pk = result[primaryField.name]
    return { __id: __id, __pk: __pk }
  }

  const deleteHandler: ApiConfigHandlerFn<
    TContext,
    TFields,
    typeof ApiDefaultMethod.DELETE
  > = async (args) => {
    console.log('Delete handler called with args:', args)

    await prisma[model.config.prismaModelName].deleteMany({
      where: { [primaryField.name]: { in: args.ids } },
    })

    return {
      success: true,
    }
  }

  const findOneHandler: ApiConfigHandlerFn<
    TContext,
    TFields,
    typeof ApiDefaultMethod.FIND_ONE
  > = async (args) => {
    console.log('Find one handler called with args:', args)

    const result = await prisma[model.config.prismaModelName].findUnique({
      where: { [primaryField.name]: args.id },
    })

    return {
      __id: result[identifierFieldName],
      __pk: result[primaryField.name],
      ...result,
    }
  }

  const findManyHandler: ApiConfigHandlerFn<
    TContext,
    TFields,
    typeof ApiDefaultMethod.FIND_MANY
  > = async (args) => {
    console.log('Find many handler called with args:', args)

    const response = await prisma[model.config.prismaModelName].findMany({
      orderBy: args.orderBy,
      skip: args.offset,
      take: args.limit,
    })

    const total = await prisma[model.config.prismaModelName].count()

    // TODO: Recheck default limit and offset
    const page = Math.ceil(total / (args.limit || 10))

    return {
      data: response.map((item) => ({
        ...item,
        __id: item[identifierFieldName],
        __pk: item[primaryField.name],
      })),
      total: total,
      page: page,
    }
  }

  return {
    create: createHandler,
    update: updateHandler,
    delete: deleteHandler,
    findOne: findOneHandler,
    findMany: findManyHandler,
  }
}

export type CollectionDefaultAdminApiRouter<TSlug extends string, TFields extends Fields> = {
  create: ApiRoute<{
    path: `/${TSlug}`
    method: 'POST'
    body: ToZodObject<InferCreateFieldsShape<TFields['shape']>>
    responses: {
      200: ToZodObject<ApiReturnType<typeof ApiDefaultMethod.CREATE, TFields>>
    }
  }>
  update: ApiRoute<{
    path: `/${TSlug}/:id`
    method: 'PATCH'
    pathParams: ToZodObject<{ id: string }>
    body: ToZodObject<InferUpdateFieldsShape<TFields['shape']>>
    responses: {
      200: ToZodObject<ApiReturnType<typeof ApiDefaultMethod.UPDATE, TFields>>
    }
  }>
  delete: ApiRoute<{
    path: `/${TSlug}`
    method: 'DELETE'
    body: ToZodObject<{ ids: string[] | number[] }>
    responses: {
      200: ToZodObject<ApiReturnType<typeof ApiDefaultMethod.DELETE, TFields>>
    }
  }>
  findOne: ApiRoute<{
    path: `/${TSlug}/:id`
    method: 'GET'
    pathParams: ToZodObject<{ id: string }>
    responses: {
      200: ToZodObject<ApiReturnType<typeof ApiDefaultMethod.FIND_ONE, TFields>>
    }
  }>
  findMany: ApiRoute<{
    path: `/${TSlug}`
    method: 'GET'
    query: ToZodObject<{
      limit?: number
      offset?: number
      orderBy?: string
      orderType?: 'asc' | 'desc'
    }>
    responses: {
      200: ToZodObject<ApiReturnType<typeof ApiDefaultMethod.FIND_MANY, TFields>>
    }
  }>
}

export function createCollectionDefaultApi<
  TContext extends Contextable,
  TSlug extends string,
  TFields extends Fields,
>(
  slug: TSlug,
  config: { schema: ModelSchemas; context: TContext },
  options: CollectionOptions<TContext, TFields, any>
): CollectionDefaultAdminApiRouter<TSlug, TFields> {
  const defaultHandler = createCollectionDefaultHandler(config, options)

  const api = {
    create: options.admin?.api?.create ?? defaultHandler.create,
    update: options.admin?.api?.update ?? defaultHandler.update,
    delete: options.admin?.api?.delete ?? defaultHandler.delete,
    findOne: options.admin?.api?.findOne ?? defaultHandler.findOne,
    findMany: options.admin?.api?.findMany ?? defaultHandler.findMany,
  }

  const createApi = createEndpoint(
    config.context,
    {
      method: 'POST',
      path: '',
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
      const response = await api.create({
        slug: slug,
        context: payload.context,
        data: payload.body as any,
        fields: options.fields,
        defaultApi: defaultHandler.create as any,
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

  const updateApi = createEndpoint(
    config.context,
    {
      method: 'PUT',
      path: `/${slug}/:id`,
      pathParams: z.object({
        id: z.union([z.string(), z.number()]),
      }),
      // body: fieldsShapeToZodObject(options.fields.shape, ApiDefaultMethod.UPDATE),
      body: z.any(),
      responses: {
        200: z.object({
          __id: z.union([z.string(), z.number()]),
          __pk: z.union([z.string(), z.number()]),
        }),
      },
    },
    async (payload) => {
      const response = await api.update({
        id: payload.pathParams.id,
        slug: slug,
        context: payload.context,
        data: payload.body as any,
        fields: options.fields,
        defaultApi: defaultHandler.create as any,
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

  const deleteApi = createEndpoint(
    config.context,
    {
      method: 'DELETE',
      path: '',
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
      await api.delete({
        slug: slug,
        context: payload.context,
        ids: payload.body.ids,
        fields: options.fields,
        defaultApi: defaultHandler.delete as any,
      })

      return {
        status: 200,
        body: {
          success: true,
        },
      }
    }
  )

  const findOneApi = createEndpoint(
    config.context,
    {
      method: 'GET',
      path: '/:id',
      pathParams: z.object({
        id: z.union([z.string(), z.number()]),
      }),
      responses: {
        200: z.any(),
      },
    },
    async (payload) => {
      const result = await api.findOne({
        id: payload.pathParams.id,
        slug: slug,
        context: payload.context,
        fields: options.fields,
        defaultApi: defaultHandler.findOne as any,
      })

      return {
        status: 200,
        body: result,
      }
    }
  )

  const findManyApi = createEndpoint(
    config.context,
    {
      method: 'GET',
      path: '',
      responses: {
        200: z.object({
          total: z.number(),
          page: z.number(),
          // TODO: Infer zod from fields
          data: z.array(z.any()),
        }),
      },
    },
    async (payload) => {
      const query = (payload as any).query

      const result = await api.findMany({
        slug: slug,
        context: payload.context,
        fields: options.fields,
        defaultApi: defaultHandler.findMany as any,
        limit: query.limit,
        offset: query.offset,
        orderBy: query.orderBy,
        orderType: query.orderType,
      })

      return {
        status: 200,
        body: {
          total: result.total,
          page: result.page,
          data: result.data,
        },
      }
    }
  )

  const apiRouter = appendApiPathPrefix(`/${slug}`, {
    create: createApi,
    update: updateApi,
    delete: deleteApi,
    findOne: findOneApi,
    findMany: findManyApi,
  })

  return apiRouter as unknown as CollectionDefaultAdminApiRouter<TSlug, TFields>
}
