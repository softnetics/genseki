import type { PropsWithChildren, ReactNode } from 'react'

import * as R from 'remeda'

import { type ApiRouter } from './endpoint'
import type { AnyField, AnyFields, FieldClient, FieldsClient } from './field'
import { type StorageAdapter } from './file-storage-adapters/generic-adapter'
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

export interface GensekiCore<TApiRouter extends ApiRouter> {
  api: TApiRouter
  uis: GensekiUiRouter[]
}

export interface GensekiPlugin<TName extends string, TApiRouter extends ApiRouter> {
  name: TName
  plugin: (options: GensekiAppOptions) => GensekiCore<TApiRouter>
}

type AnyGensekiPlugin = GensekiPlugin<string, any>
type InferApiRouterFromGensekiPlugin<TPlugin extends AnyGensekiPlugin> = ReturnType<
  TPlugin['plugin']
>['api']

export class GensekiApp<TMainApiRouter extends ApiRouter = {}> {
  private readonly plugins: GensekiPlugin<string, ApiRouter>[] = []

  constructor(private readonly options: GensekiAppOptions) {}

  apply<const TPlugin extends AnyGensekiPlugin>(
    plugin: TPlugin
  ): GensekiApp<TMainApiRouter & InferApiRouterFromGensekiPlugin<TPlugin>> {
    this.plugins.push(plugin)
    // TODO: I don't know why this is needed, need to investigate
    return this as unknown as GensekiApp<TMainApiRouter & InferApiRouterFromGensekiPlugin<TPlugin>>
  }

  build(): GensekiCore<TMainApiRouter> {
    const uis = this.plugins.flatMap((plugin) => plugin.plugin(this.options).uis)
    const api = this.plugins.reduce(
      (acc, plugin) => ({
        ...acc,
        ...plugin.plugin(this.options).api,
      }),
      {}
    ) as TMainApiRouter

    return { api: api, uis: uis }
  }
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
