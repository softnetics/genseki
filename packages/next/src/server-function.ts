import { ExtractObjectValues, Simplify } from 'drizzle-orm'

import {
  ApiDefaultMethod,
  ApiReturnType,
  ApiRoute,
  ApiRouteHandlerPayload,
  ApiRouter,
  ApiRouteSchema,
  ClientApiArgs,
  ClientApiRouteHandlerPayload,
  Collection,
  InferApiRouteResponses,
  InferApiRouterFromCollection,
  ServerConfig,
} from '@kivotos/core'

export type ServerFunction<TServerConfig extends ServerConfig<any, any, any, any>> = <
  const TMethod extends GetServerMethod<TServerConfig> = GetServerMethod<TServerConfig>,
>(
  args: TMethod
) => Promise<GetServerMethodResponse<TServerConfig, TMethod>>

export type DefaultMethodFromCollection<
  TCollection extends Collection<any, any, any, any, any, any>,
> =
  TCollection extends Collection<any, any, any, any, any, any>
    ? Simplify<
        ExtractObjectValues<{
          [TMethod in ApiDefaultMethod]: TMethod extends ApiDefaultMethod
            ? {
                slug: TCollection['slug']
                method: TMethod
                payload: Simplify<ClientApiArgs<TMethod, TCollection['fields']>>
              }
            : never
        }>
      >
    : never

export type CustomMethodFromCollection<
  TCollection extends Collection<any, any, any, any, any, any>,
> =
  TCollection extends Collection<any, any, any, any, any, any>
    ? Simplify<
        ExtractObjectValues<{
          [TMethod in keyof InferApiRouterFromCollection<TCollection>]: {
            slug: TCollection['slug']
            method: TMethod
            payload: InferApiRouterFromCollection<TCollection>[TMethod] extends ApiRouteSchema
              ? Simplify<
                  ClientApiRouteHandlerPayload<InferApiRouterFromCollection<TCollection>[TMethod]>
                >
              : never
          }
        }>
      >
    : never

type AllMethodFromCollection<TCollection extends Collection<any, any, any, any, any, any>> =
  TCollection extends Collection<any, any, any, any, any, any>
    ? Simplify<DefaultMethodFromCollection<TCollection> | CustomMethodFromCollection<TCollection>>
    : never

export type CustomMethodFromServerConfig<TServerConfig extends ServerConfig> =
  Exclude<TServerConfig['endpoints'], undefined> extends infer TRouter extends ApiRouter<any>
    ? ExtractObjectValues<{
        [TMethod in keyof TRouter]: {
          slug: 'custom'
          method: TMethod
          payload: TRouter[TMethod] extends ApiRouteSchema
            ? Simplify<ClientApiRouteHandlerPayload<TRouter[TMethod]>>
            : never
        }
      }>
    : never

type CustomMethodFromServerConfigResponse<
  TServerConfig extends ServerConfig<any, any, any, any>,
  TMethodName extends string,
> =
  Exclude<TServerConfig['endpoints'], undefined> extends infer TRouter extends ApiRouter<any>
    ? TMethodName extends keyof TRouter
      ? TRouter[TMethodName] extends infer TRoute extends ApiRouteSchema
        ? Simplify<InferApiRouteResponses<TRoute>>
        : never
      : never
    : never

type CustomMethodFromCollectionResponse<
  TCollection extends Collection<any, any, any, any, any, any>,
  TMethodName extends string,
> = Exclude<TCollection['admin']['endpoints'], undefined>[TMethodName] extends infer TRoute extends
  ApiRouteSchema
  ? TRoute extends ApiRouteSchema
    ? Simplify<InferApiRouteResponses<TRoute>>
    : never
  : never

type DefaultMethodFromCollectionResponse<
  TCollection extends Collection<any, any, any, any, any, any>,
  TMethodName extends string,
> = TMethodName extends ApiDefaultMethod
  ? Simplify<ApiReturnType<TMethodName, TCollection['fields']>>
  : never

export type GetServerMethodResponse<
  TServerConfig extends ServerConfig<any, any, any, any>,
  TMethod extends GetServerMethod<TServerConfig>,
> = TMethod['slug'] extends 'custom'
  ? CustomMethodFromServerConfigResponse<TServerConfig, TMethod['method']>
  : TMethod['method'] extends ApiDefaultMethod
    ? DefaultMethodFromCollectionResponse<
        Extract<TServerConfig['collections'][number], { slug: TMethod['slug'] }>,
        TMethod['method']
      >
    : CustomMethodFromCollectionResponse<
        Extract<TServerConfig['collections'][number], { slug: TMethod['slug'] }>,
        TMethod['method']
      >

export type GetServerMethod<TServerConfig extends ServerConfig<any, any, any, any>> = Simplify<
  | AllMethodFromCollection<TServerConfig['collections'][number]>
  | CustomMethodFromServerConfig<TServerConfig>
>

function isCustomMethodFromServerConfig<TMethod extends { slug: string }>(method: TMethod) {
  return (method as any).slug === 'custom'
}

function isCustomMethodFromCollection<TMethod extends { slug: string; method: string }>(
  method: TMethod
) {
  return (
    (method as any).slug !== 'custom' &&
    !Object.values(ApiDefaultMethod).includes(method.method as any)
  )
}

function isDefaultMethodFromCollection<TMethod extends { slug: string; method: string }>(
  method: TMethod
) {
  return (
    (method as any).slug !== 'custom' &&
    Object.values(ApiDefaultMethod).includes(method.method as any)
  )
}

export async function handleServerFunction<
  TServerConfig extends ServerConfig<any, any, any, ApiRouter>,
  TMethod extends GetServerMethod<TServerConfig>,
>(
  serverConfig: TServerConfig,
  method: TMethod
): Promise<GetServerMethodResponse<TServerConfig, TMethod>> {
  const slug = method.slug

  if (isCustomMethodFromServerConfig(method)) {
    const handlers = serverConfig.endpoints
    if (!handlers) throw new Error('No endpoints found in server config')

    const handler = handlers[method.method] as ApiRoute<any, ApiRouteSchema>
    if (!handler) {
      throw new Error(`Method ${method.method} not found`)
    }

    const result = await handler.handler({
      context: serverConfig.context,
      ...(method.payload as any),
    } as ApiRouteHandlerPayload<any, ApiRouteSchema>)

    return result as GetServerMethodResponse<TServerConfig, TMethod>
  } else if (isCustomMethodFromCollection(method)) {
    const collection = serverConfig.collections.find(
      (collection: Collection) => collection.slug === slug
    )
    if (!collection) {
      throw new Error(`Collection ${slug} not found`)
    }

    const handlers = collection.admin.endpoints

    const handler = handlers?.[method.method] as ApiRoute<any, ApiRouteSchema>
    if (!handler) {
      throw new Error(`Method ${method.method} not found`)
    }

    const result = await handler.handler({
      context: { ...serverConfig.context, db: serverConfig.db },
      ...(method.payload as any),
    } as ApiRouteHandlerPayload<any, ApiRouteSchema>)

    return result as GetServerMethodResponse<TServerConfig, TMethod>
  } else if (isDefaultMethodFromCollection(method)) {
    const collection = serverConfig.collections.find(
      (collection: Collection) => collection.slug === slug
    )
    if (!collection) {
      throw new Error(`Collection ${slug} not found`)
    }

    const handlers = collection.admin.api

    const handler = handlers[method.method as ApiDefaultMethod]
    if (!handler) {
      throw new Error(`Method ${method.method} not found`)
    }

    // TODO: Fix request
    const request = new Request('')
    const result = await handler(
      {
        context: { ...serverConfig.context, db: serverConfig.db },
        fields: collection.fields,
        slug: collection.slug,
        ...(method.payload as any),
      } as any,
      request
    )

    return result as GetServerMethodResponse<TServerConfig, TMethod>
  }

  throw new Error(`Method ${method.method} not found`)
}
