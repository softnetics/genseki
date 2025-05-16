import { Simplify } from 'drizzle-orm'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import * as R from 'remeda'

import { AuthConfig, createAuth } from './auth'
import { createAuthContext } from './auth/context'
import { Builder } from './builder'
import {
  ClientCollection,
  Collection,
  ToClientCollection,
  ToClientCollectionList,
} from './collection'
import { ApiRouter, ClientApiRouter, ToClientApiRouter } from './endpoint'
import { BaseField, Field } from './field'
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
  TApiRouter extends ApiRouter<TContext> = ApiRouter<TContext>,
> extends BaseConfig<TFullSchema> {
  context: TContext
  collections: TCollections
  endpoints?: TApiRouter
}

export type InferApiRouterFromServerConfig<TServerConfig extends ServerConfig> =
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
    TCollections extends Collection<any, any, any, any, any, any>[] = Collection<
      any,
      any,
      any,
      any,
      any,
      any
    >[],
    TEndpoints extends ApiRouter<MinimalContext<TFullSchema, TContext>> = {},
  >(args: { collections: TCollections; endpoints?: TEndpoints }) {
    const auth = createAuth(config.auth, context)

    return {
      ...config,
      context: context,
      collections: args.collections,
      endpoints: {
        ...args.endpoints,
        ...auth.handlers,
      } as TEndpoints & typeof auth.handlers,
    } satisfies ServerConfig<
      TFullSchema,
      MinimalContext<TFullSchema, TContext>,
      TCollections,
      TEndpoints & typeof auth.handlers
    >
  }

  function builder() {
    const authContext = createAuthContext(config.auth, context)

    return new Builder({
      schema: config.schema,
      context: { ...context, auth: authContext },
    })
  }

  return {
    ...config,
    context,
    toServerConfig,
    builder,
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

export function getBaseField<const TField extends Field>(name: string, field: TField): BaseField {
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
      ) as unknown as BaseField
    }

    return R.omit(
      {
        ...field,
        label: field.label ?? name,
        placeholder: field.placeholder ?? name,
      },
      ['_', 'options' as any]
    ) as unknown as BaseField
  }

  return R.omit(
    {
      ...field,
      label: field.label ?? name,
      placeholder: field.placeholder ?? name,
    },
    ['_', 'options' as any]
  ) as BaseField
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

export type ToClientConfig<TServerConfig extends ServerConfig<any, any, any, ApiRouter>> =
  ClientConfig<
    ToClientCollectionList<TServerConfig['collections']>,
    ToClientApiRouter<InferApiRouterFromServerConfig<TServerConfig>>
  >

export function getClientConfig<const TServerConfig extends ServerConfig<any, any, any, ApiRouter>>(
  serverConfig: TServerConfig
) {
  const collections = serverConfig.collections

  return {
    collections: collections.map(getClientCollection) as ToClientCollectionList<
      TServerConfig['collections']
    >,
  } as Simplify<ToClientConfig<TServerConfig>>
}
