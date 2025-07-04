import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import * as R from 'remeda'

import {
  type AnyCollection,
  type ClientCollection,
  type Collection,
  getAllCollectionEndpoints,
  type ToClientCollection,
  type ToClientCollectionList,
} from './collection'
import { Context } from './context'
import {
  type ApiRoute,
  type ApiRouter,
  type ClientApiRouter,
  getClientEndpoint,
  type ToClientApiRouteSchema,
  type ToRecordApiRouteSchema,
} from './endpoint'
import type { AnyField, AnyFields, FieldClient, FieldsClient } from './field'
import {
  getStorageAdapterClient,
  type StorageAdapter,
  type StorageAdapterClient,
} from './file-storage-adapters/generic-adapter'
import { createFileUploadHandlers } from './file-storage-adapters/handlers'
import type { GensekiPlugin, MergePlugins } from './plugins'
import { getClientEditorProviderProps } from './richtext'
import { isMediaField, isRelationField, isRichTextField } from './utils'

import {
  type AuthClient,
  type AuthConfig,
  type AuthHandlers,
  createAuth,
  getAuthClient,
} from '../auth'

export interface BaseConfigOptions<
  TFullSchema extends Record<string, unknown> = Record<string, unknown>,
  TContextValue extends Record<string, unknown> = Record<string, unknown>,
> {
  db: NodePgDatabase<TFullSchema>
  schema: TFullSchema
  context?: TContextValue
  storageAdapter?: StorageAdapter
  auth: AuthConfig
}

export interface BaseConfig<
  TFullSchema extends Record<string, unknown> = Record<string, unknown>,
  TContext extends Context<TFullSchema> = Context<TFullSchema>,
> extends Omit<BaseConfigOptions<TFullSchema>, 'context'> {
  context: TContext
}

export interface ServerConfig<
  TFullSchema extends Record<string, unknown> = Record<string, unknown>,
  TContext extends Context<TFullSchema> = Context<TFullSchema>,
  TCollections extends Record<string, AnyCollection> = Record<string, AnyCollection>,
  TApiRouter extends ApiRouter<TContext> = AuthHandlers & ApiRouter<TContext>,
> extends BaseConfig<TFullSchema> {
  context: TContext
  collections: TCollections
  endpoints: TApiRouter
}

export interface AnyServerConfig extends ServerConfig<Record<string, unknown>, Context, {}, {}> {}

export type InferApiRouterFromServerConfig<TServerConfig extends ServerConfig<any, any, any, any>> =
  TServerConfig extends ServerConfig<any, any, any, infer TApiRouter>
    ? TApiRouter extends ApiRouter<any>
      ? TApiRouter
      : never
    : never

export function defineBaseConfig<
  const TFullSchema extends Record<string, unknown> = Record<string, unknown>,
  const TContextValue extends Record<string, unknown> = Record<string, unknown>,
>(
  config: BaseConfigOptions<TFullSchema, TContextValue>
): BaseConfig<TFullSchema, Context<TFullSchema, TContextValue>> {
  const context = new Context(config.db, { ...config.context }) as Context<
    TFullSchema,
    TContextValue
  >

  return {
    ...config,
    context,
  }
}

export function defineServerConfig<
  const TFullSchema extends Record<string, unknown>,
  const TContext extends Context<TFullSchema>,
  const TCollections extends Record<string, AnyCollection>,
  const TEndpoints extends ApiRouter<TContext>,
  const TPlugins extends GensekiPlugin<any>[] = [...GensekiPlugin<any>[]],
>(
  baseConfig: BaseConfig<TFullSchema, TContext>,
  config: { collections: TCollections; endpoints?: TEndpoints; plugins?: TPlugins }
) {
  const auth = createAuth<TContext>(baseConfig.auth, baseConfig.context)
  const fileUploadHandlers = createFileUploadHandlers<TContext>(baseConfig.storageAdapter)
  const collectionEndpoints = getAllCollectionEndpoints(config.collections)

  let serverConfig: ServerConfig<
    TFullSchema,
    TContext,
    TCollections,
    TEndpoints & AuthHandlers & typeof collectionEndpoints & typeof fileUploadHandlers.handlers
  > = {
    ...baseConfig,
    collections: config.collections,
    endpoints: {
      ...config.endpoints,
      ...auth.handlers,
      ...collectionEndpoints,
      ...fileUploadHandlers.handlers,
    } as TEndpoints &
      typeof auth.handlers &
      typeof collectionEndpoints &
      typeof fileUploadHandlers.handlers,
  }

  for (const { plugin } of config.plugins ?? []) {
    serverConfig = plugin(serverConfig) as any
  }

  return serverConfig as MergePlugins<typeof serverConfig, TPlugins>
}

export interface ClientConfig<
  TCollections extends Record<string, ClientCollection<any, any, any, any, any, any>>,
  TApiRouter extends ClientApiRouter,
> {
  auth: AuthClient
  collections: TCollections
  endpoints: TApiRouter
  storageAdapter?: StorageAdapterClient
}

export function getFieldClient(name: string, field: AnyField): FieldClient & { fieldName: string } {
  if (isRelationField(field)) {
    if (field._.source === 'relation') {
      const sanitizedFields = Object.fromEntries(
        Object.entries(field.fields).map(([key, value]) => {
          return [key, getFieldClient(key, value)]
        })
      )

      return R.omit(
        {
          ...field,
          fields: sanitizedFields,
        },
        ['_', 'options' as any]
      ) as FieldClient & { fieldName: string }
    }

    return R.omit(
      {
        ...field,
        label: field.label ?? name,
        placeholder: field.placeholder ?? name,
      },
      ['_', 'options' as any]
    ) as FieldClient & { fieldName: string }
  }

  if (isRichTextField(field)) {
    const sanitizedBaseField = R.omit(
      {
        ...field,
        label: field.label ?? name,
      },
      ['_', 'options' as any]
    ) as FieldClient & { fieldName: string }

    const sanitizedRichTextField = {
      ...sanitizedBaseField,
      editor: getClientEditorProviderProps(field.editor),
    }

    return sanitizedRichTextField
  }

  if (isMediaField(field)) {
    return R.omit(
      {
        ...field,
        label: field.label ?? name,
      },
      ['_', 'options' as any]
    ) as FieldClient & { fieldName: string }
  }

  return R.omit(
    {
      ...field,
      label: field.label ?? name,
      placeholder: field.placeholder ?? name,
    },
    ['_', 'options' as any]
  ) as FieldClient & { fieldName: string }
}

export function getFieldsClient(fields: AnyFields): FieldsClient {
  return R.mapValues(fields, (value, key) => getFieldClient(key, value))
}

export function getClientCollection<
  const TCollection extends Collection<any, any, any, any, any, any>,
>(collection: TCollection): ToClientCollection<TCollection> {
  return R.pipe(
    collection,
    R.omit(['_', 'admin']),
    (collection) =>
      ({
        ...collection,
        fields: getFieldsClient(collection.fields),
      }) as unknown as ToClientCollection<TCollection>
  )
}

export function getClientConfig<
  TCollections extends Record<string, AnyCollection>,
  TApiRouter extends ApiRouter<any>,
>(
  serverConfig: ServerConfig<any, any, TCollections, TApiRouter>
): ClientConfig<ToClientCollectionList<TCollections>, ToClientApiRouteSchema<TApiRouter>> & {
  $types: ToRecordApiRouteSchema<TApiRouter>
} {
  const collections = serverConfig.collections

  const clientEndpoints = R.mapValues(serverConfig.endpoints, (value) =>
    getClientEndpoint(value as ApiRoute<any, any>)
  ) as ToClientApiRouteSchema<TApiRouter>

  return {
    auth: getAuthClient(serverConfig.auth),
    collections: R.mapValues(collections, (s) =>
      getClientCollection(s as AnyCollection)
    ) as unknown as ToClientCollectionList<TCollections>,
    endpoints: clientEndpoints,
    $types: undefined as any,
    ...(serverConfig.storageAdapter && {
      storageAdapter: getStorageAdapterClient({
        storageAdapter: serverConfig.storageAdapter,
        grabPutObjectSignedUrlApiRoute: clientEndpoints['file.generatePutObjSignedUrl'],
        grabGetObjectSignedUrlApiRoute: clientEndpoints['file.generateGetObjSignedUrl'],
      }),
    }),
  }
}
