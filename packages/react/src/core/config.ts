import type { PropsWithChildren, ReactNode } from 'react'

import * as R from 'remeda'

import { type AnyApiRouter } from './endpoint'
import type { FieldBase, FieldClient, Fields, FieldsClient } from './field'
import {
  getStorageAdapterClient,
  type StorageAdapter,
  type StorageAdapterClient,
} from './file-storage-adapters/generic-adapter'
import { getEditorProviderClientProps } from './richtext'
import { isMediaField, isRelationField, isRichTextField } from './utils'

interface RenderArgs {
  params: Record<string, string>
  headers: Headers
  searchParams: { [key: string]: string | string[] }
}

// TODO: Fix this type
interface AuthenticatedRenderArgs extends RenderArgs {}

// TODO: Revise this one
export type GensekiUiRouter<TProps extends Record<string, unknown> = Record<string, unknown>> =
  | {
      requiredAuthenticated: true
      id?: string
      path: string
      render: (args: AuthenticatedRenderArgs & TProps) => ReactNode
      props?: TProps
    }
  | {
      requiredAuthenticated: false
      id?: string
      path: string
      render: (args: RenderArgs & TProps) => ReactNode
      props?: TProps
    }

export interface GensekiAppOptions {
  title: string
  components: {
    Layout: (props: PropsWithChildren) => ReactNode
    NotFound: () => ReactNode
    CollectionLayout: (props: PropsWithChildren) => ReactNode
  }
  storageAdapter?: StorageAdapter
}

export interface GensekiCore<TApiRouter extends AnyApiRouter = AnyApiRouter> {
  api: TApiRouter
  uis: GensekiUiRouter[]
  app?: {
    storageAdapter?: StorageAdapterClient
  }
}

export interface GensekiPlugin<TName extends string, TApiRouter extends AnyApiRouter> {
  name: TName
  plugin: (options: GensekiAppOptions) => GensekiCore<TApiRouter>
}

export function createPlugin<TName extends string, TApiRouter extends AnyApiRouter>(args: {
  name: TName
  plugin: (options: GensekiAppOptions) => GensekiCore<TApiRouter>
}): GensekiPlugin<TName, TApiRouter> {
  return args
}

type AnyGensekiPlugin = GensekiPlugin<string, AnyApiRouter>
type InferApiRouterFromGensekiPlugin<TPlugin extends AnyGensekiPlugin> = ReturnType<
  TPlugin['plugin']
>['api']

export class GensekiApp<TApiPrefix extends string, TMainApiRouter extends AnyApiRouter = {}> {
  // private readonly apiPathPrefix: string
  private readonly plugins: AnyGensekiPlugin[] = []

  constructor(private readonly options: GensekiAppOptions) {
    // this.apiPathPrefix = options.apiPrefix ?? '/api'
  }

  apply<const TPlugin extends AnyGensekiPlugin>(
    plugin: TPlugin
  ): GensekiApp<TApiPrefix, TMainApiRouter & InferApiRouterFromGensekiPlugin<TPlugin>> {
    this.plugins.push(plugin)
    // TODO: I don't know why this is needed, need to investigate
    return this as unknown as GensekiApp<
      TApiPrefix,
      TMainApiRouter & InferApiRouterFromGensekiPlugin<TPlugin>
    >
  }

  build(): GensekiCore<TMainApiRouter> {
    const uis = this.plugins.flatMap((plugin) => plugin.plugin(this.options).uis)
    const api = this.plugins.reduce(
      (acc, plugin) => ({ ...acc, ...plugin.plugin(this.options).api }),
      {}
    ) as TMainApiRouter

    return {
      app: {
        storageAdapter: getStorageAdapterClient({
          storageAdapter: this.options.storageAdapter,
          grabPutObjectSignedUrlApiRoute: {} as any, // TODO: Fix client endpoint types,
          grabGetObjectSignedUrlApiRoute: {} as any, // TODO: Fix client endpoint types
        }),
      },
      api: api,
      uis: uis,
    }
  }
}

export function getFieldClient(
  name: string,
  field: FieldBase
): FieldClient & { $client: { fieldName: string } } {
  if (isRelationField(field)) {
    if (field.$client.source === 'relation') {
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
        ['$server', 'options' as any]
      ) as FieldClient & { $client: { fieldName: string } }
    }

    return R.omit(
      {
        ...field,
        label: field.label ?? name,
        placeholder: field.placeholder ?? name,
      },
      ['$server', 'options' as any]
    ) as FieldClient & { $client: { fieldName: string } }
  }

  if (isRichTextField(field)) {
    const sanitizedBaseField = R.omit(
      {
        ...field,
        label: field.label ?? name,
      },
      ['$server', 'options' as any]
    ) as FieldClient & { $client: { fieldName: string } }

    const sanitizedRichTextField = {
      ...sanitizedBaseField,
      editor: getEditorProviderClientProps(field.editor),
    }

    return sanitizedRichTextField
  }

  if (isMediaField(field)) {
    return R.omit(
      {
        ...field,
        label: field.label ?? name,
      },
      ['$server', 'options' as any]
    ) as FieldClient & { $client: { fieldName: string } }
  }

  return R.omit(
    {
      ...field,
      label: field.label ?? name,
      placeholder: field.placeholder ?? name,
    },
    ['$server', 'options' as any]
  ) as FieldClient & { $client: { fieldName: string } }
}

export function getFieldsClient(fields: Fields): FieldsClient {
  return R.mapValues(fields, (value, key) => getFieldClient(key, value))
}

// export function getClientConfig<
//   TCollections extends Record<string, AnyCollection>,
//   TApiRouter extends ApiRouter<any>,
// >(
//   serverConfig: ServerConfig<any, any, TCollections, TApiRouter>
// ): ClientConfig<ToClientCollectionList<TCollections>, ToClientApiRouteSchema<TApiRouter>> & {
//   $types: ToRecordApiRouteSchema<TApiRouter>
// } {
//   const clientEndpoints = R.mapValues(serverConfig.endpoints, (value) =>
//     getClientEndpoint(value as ApiRoute<any, any>)
//   ) as ToClientApiRouteSchema<TApiRouter>

//   return {
//     auth: getAuthClient(serverConfig.auth),
//     collections: serverConfig.collections,
//     endpoints: clientEndpoints,
//     $types: undefined as any,
//     ...(serverConfig.storageAdapter && {
//       storageAdapter: getStorageAdapterClient({
//         storageAdapter: serverConfig.storageAdapter,
//         grabPutObjectSignedUrlApiRoute: clientEndpoints['file.generatePutObjSignedUrl'],
//         grabGetObjectSignedUrlApiRoute: clientEndpoints['file.generateGetObjSignedUrl'],
//       }),
//     }),
//   }
// }
