import { Simplify } from 'drizzle-orm'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import * as R from 'remeda'

import { AuthConfig, createAuth } from './auth'
import {
  ClientCollection,
  Collection,
  ExtractAllCollectionCustomEndpoints,
  ExtractAllCollectionDefaultEndpoints,
  getAllCollectionEndpoints,
  ToClientCollection,
  ToClientCollectionList,
} from './collection'
import { ApiRouter, ClientApiRouter, ToClientApiRouter } from './endpoint'
import { Field, FieldClient } from './field'
import { isRelationField } from './utils'

export type MinimalContext<
  TFullSchema extends Record<string, unknown> = Record<string, unknown>,
  TContext extends Record<string, unknown> = Record<string, unknown>,
> = Simplify<
  TContext & {
    db: NodePgDatabase<TFullSchema>
  }
>

export interface BaseConfig<
  TFullSchema extends Record<string, unknown> = Record<string, unknown>,
  TContext extends Record<string, unknown> = Record<string, unknown>,
> {
  db: NodePgDatabase<TFullSchema>
  schema: TFullSchema
  context?: TContext
  auth: AuthConfig
}

export interface ServerConfig<
  TFullSchema extends Record<string, unknown> = Record<string, unknown>,
  TContext extends MinimalContext<TFullSchema> = MinimalContext<TFullSchema>,
  TCollections extends Collection<any, any, any, any, any, any>[] = Collection<
    any,
    any,
    any,
    any,
    any,
    any
  >[],
  TApiRouter extends ApiRouter<TContext> = ReturnType<typeof createAuth<TContext>>['handlers'],
> extends BaseConfig<TFullSchema> {
  context: TContext
  collections: TCollections
  endpoints: TApiRouter
}

export type InferApiRouterFromServerConfig<TServerConfig extends ServerConfig<any, any, any, any>> =
  TServerConfig extends ServerConfig<any, any, any, infer TApiRouter>
    ? TApiRouter extends ApiRouter
      ? TApiRouter
      : never
    : never

export function defineBaseConfig<
  TFullSchema extends Record<string, unknown> = Record<string, unknown>,
  TContext extends Record<string, unknown> = Record<string, unknown>,
>(config: BaseConfig<TFullSchema, TContext>) {
  const context = {
    ...config.context,
    db: config.db,
  } as MinimalContext<TFullSchema, TContext>

  function toServerConfig<
    const TCollections extends Collection<any, any, any, any, any, any>[] = Collection<
      any,
      any,
      any,
      any,
      any,
      any
    >[],
    const TEndpoints extends ApiRouter<MinimalContext<TFullSchema, TContext>> = {},
  >(args: { collections: TCollections; endpoints?: TEndpoints }) {
    const auth = createAuth(config.auth, context)
    const collectionEndpoints = getAllCollectionEndpoints(args.collections)

    return {
      ...config,
      context: context,
      collections: args.collections,
      endpoints: {
        ...args.endpoints,
        ...auth.handlers,
        ...collectionEndpoints,
      } as TEndpoints &
        typeof auth.handlers &
        ExtractAllCollectionCustomEndpoints<TCollections> &
        ExtractAllCollectionDefaultEndpoints<TCollections>,
    } satisfies ServerConfig<
      TFullSchema,
      MinimalContext<TFullSchema, TContext>,
      TCollections,
      TEndpoints &
        typeof auth.handlers &
        ExtractAllCollectionCustomEndpoints<TCollections> &
        ExtractAllCollectionDefaultEndpoints<TCollections>
    >
  }

  return {
    ...config,
    context,
    toServerConfig,
  }
}

export interface ClientConfig<
  TCollections extends ClientCollection[] = ClientCollection[],
  TApiRouter extends ClientApiRouter = ClientApiRouter,
> {
  collections: TCollections
  $types: {
    endpoints: TApiRouter
  }
}

export function getBaseField<const TField extends Field>(name: string, field: TField): FieldClient {
  if (isRelationField(field)) {
    if (field.type === 'create' || field.type === 'connectOrCreate') {
      const sanitizedFields = Object.fromEntries(
        Object.entries(field.fields).map(([key, value]) => {
          return [key, getBaseField(key, value)]
        })
      )

      return R.omit(
        {
          ...field,
          fields: sanitizedFields,
        },
        ['_', 'options' as any]
      ) as unknown as FieldClient
    }

    return R.omit(
      {
        ...field,
        label: field.label ?? name,
        placeholder: field.placeholder ?? name,
      },
      ['_', 'options' as any]
    ) as unknown as FieldClient
  }

  return R.omit(
    {
      ...field,
      label: field.label ?? name,
      placeholder: field.placeholder ?? name,
    },
    ['_', 'options' as any]
  ) as unknown as FieldClient
}

export function getClientCollection<const TCollection extends Collection>(
  collection: TCollection
): ToClientCollection<TCollection> {
  return R.pipe(collection, R.omit(['_', 'admin']), (collection) => ({
    ...collection,
    fields: R.mapValues(collection.fields as Record<string, Field>, (value, key) =>
      getBaseField(key, value)
    ),
  })) as unknown as ToClientCollection<TCollection>
}

export type ToClientConfig<TServerConfig extends ServerConfig<any, any, any, any>> = ClientConfig<
  ToClientCollectionList<TServerConfig['collections']>,
  ToClientApiRouter<InferApiRouterFromServerConfig<TServerConfig>>
>

export function getClientConfig<const TServerConfig extends ServerConfig<any, any, any, any>>(
  serverConfig: TServerConfig
) {
  const collections = serverConfig.collections

  return {
    collections: collections.map(getClientCollection) as ToClientCollectionList<
      TServerConfig['collections']
    >,
  } as Simplify<ToClientConfig<TServerConfig>>
}
