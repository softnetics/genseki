import { type ReactNode } from 'react'

import * as R from 'remeda'
import type { Promisable, Simplify } from 'type-fest'

import type { AnyContextable, AnyRequestContextable } from './context'
import { type ApiRoutePath, type FlatApiRouter } from './endpoint'
import type { Fields, FieldsClient, FieldShape, FieldShapeClient } from './field'
import {
  getStorageAdapterClient,
  type StorageAdapter,
  type StorageAdapterClient,
} from './file-storage-adapters/generic-adapter'
import { createFileUploadHandlers } from './file-storage-adapters/handlers'
import {
  type AnyGensekiPlugin,
  GensekiPluginBuilder,
  type InferApiRouterFromGensekiPlugin,
} from './plugin'
import { getEditorProviderClientProps } from './richtext'
import { isMediaFieldShape, isRelationFieldShape, isRichTextFieldShape } from './utils'

import { type AppSideBarBuilderProps, NotAuthorizedPage } from '../react'

export interface RenderArgs {
  pathname: string
  params: Record<string, string>
  headers: Headers
  searchParams: { [key: string]: string | string[] }
}

// TODO: Fix this type
interface AuthenticatedRenderArgs extends RenderArgs {}

type RenderResult = Promisable<ReactNode | { redirect: string; type: 'push' | 'replace' }>

// TODO: Revise this one
export type GensekiUiRouter<TProps = any> =
  | {
      requiredAuthenticated: true
      context: AnyContextable
      id?: string
      path: string
      render: (args: AuthenticatedRenderArgs & { props: TProps }) => RenderResult
      props?: TProps
    }
  | {
      requiredAuthenticated: false
      context: AnyContextable
      id?: string
      path: string
      render: (args: RenderArgs & { props: TProps }) => RenderResult
      props?: TProps
    }

export function createGensekiUiRoute<TProps extends Record<string, unknown>>(
  args: GensekiUiRouter<TProps>
): GensekiUiRouter<TProps> {
  return args
}

interface GensekiMiddlewareArgs {
  context: AnyRequestContextable
  pathname: string
  params: Record<string, string>
  searchParams: { [key: string]: string | string[] }
  ui: GensekiUiRouter
}

export type GensekiMiddleware = (
  args: GensekiMiddlewareArgs
) => Promisable<void | ReactNode | { redirect: string } | Error>

export interface GensekiAppOptions {
  title: string
  version: string
  appBaseUrl: string
  appPathPrefix?: string // default to /admin
  apiBaseUrl?: string // default to "appBaseUrl"
  apiPathPrefix?: string // default to /admin/api
  sidebar?: AppSideBarBuilderProps
  storageAdapter?: StorageAdapter
  middlewares?: GensekiMiddleware[]
}

export interface GensekiAppOptionsWithDefaults extends GensekiAppOptions {
  appPathPrefix: string // default to /admin
  apiBaseUrl: string // default to "appBaseUrl"
  apiPathPrefix: string // default to /admin/api
}

export interface GensekiCore<TApiRouter extends FlatApiRouter = {}> {
  api: TApiRouter
  uis: GensekiUiRouter[]
}

export interface GensekiAppClient {
  title: string
  version: string
  appBaseUrl: string
  appPathPrefix?: string // default to /admin
  apiBaseUrl: string // default to "appBaseUrl"
  apiPathPrefix?: string // default to /admin/api
  sidebar?: AppSideBarBuilderProps
  storageAdapter?: StorageAdapterClient
}
export interface GensekiAppCompiled<TApiRouter extends FlatApiRouter = {}>
  extends GensekiAppClient {
  api: TApiRouter
  uis: GensekiUiRouter[]
  middlewares?: GensekiMiddleware[]
  toClient: () => GensekiAppClient
}

const unauthorizedMiddleware: GensekiMiddleware = async (args: GensekiMiddlewareArgs) => {
  if (args.ui.requiredAuthenticated) {
    try {
      await args.context.requiredAuthenticated()
    } catch (error) {
      return <NotAuthorizedPage redirectURL="/admin/auth/login" />
    }
  }
}

export class GensekiApp<TMainApiRouter extends FlatApiRouter = {}> {
  private readonly pluginBuilder: GensekiPluginBuilder

  private readonly options: GensekiAppOptionsWithDefaults

  private storageRoutesForClient?: {
    putObjSignedUrl: ApiRoutePath
    getObjSignedUrl: ApiRoutePath
    deleteObjSignedUrl: ApiRoutePath
  }

  constructor(options: GensekiAppOptions) {
    this.options = {
      ...options,
      appPathPrefix: options.appPathPrefix ?? '/admin',
      apiPathPrefix: options.apiPathPrefix ?? '/admin/api',
      apiBaseUrl: options.apiBaseUrl ?? options.appBaseUrl,
    }

    this.pluginBuilder = new GensekiPluginBuilder(this.options)

    this.pluginBuilder.addMiddleware(unauthorizedMiddleware)

    if (this.options.storageAdapter) {
      const { handlers } = createFileUploadHandlers(
        this.options.storageAdapter.context,
        this.options.storageAdapter
      )

      const putHandler = handlers['file.generatePutObjSignedUrl']
      const getHandler = handlers['file.generateGetObjSignedUrl']
      const deleteHandler = handlers['file.generateDeleteObjSignedUrl']

      this.storageRoutesForClient = {
        putObjSignedUrl: {
          method: putHandler.schema.method,
          path: `${this.options.apiPathPrefix}${putHandler.schema.path}`,
        },
        getObjSignedUrl: {
          method: getHandler.schema.method,
          path: `${this.options.apiPathPrefix}${getHandler.schema.path}`,
        },
        deleteObjSignedUrl: {
          method: deleteHandler.schema.method,
          path: `${this.options.apiPathPrefix}${deleteHandler.schema.path}`,
        },
      }
    }
  }

  apply<const TPlugin extends AnyGensekiPlugin>(
    plugin: TPlugin
  ): GensekiApp<Simplify<TMainApiRouter & InferApiRouterFromGensekiPlugin<TPlugin>>> {
    plugin.plugin(this.pluginBuilder)
    return this as unknown as GensekiApp<TMainApiRouter & InferApiRouterFromGensekiPlugin<TPlugin>>
  }

  private _logApiRouter(router: FlatApiRouter): string[] {
    const logs: string[] = []
    Object.values(router).forEach((route) => {
      logs.push(`API Route: ${route.schema.method} ${route.schema.path}`)
    })
    return logs
  }

  private _logUis(uis: GensekiUiRouter[]): string[] {
    const logs = uis.map((ui) => {
      return `UI Route: ${ui.path} (${ui.requiredAuthenticated ? 'Required Authenticated' : 'Not Required Authenticated'})`
    })
    return logs
  }

  build(): GensekiAppCompiled<TMainApiRouter> {
    if (this.options.storageAdapter) {
      const { handlers } = createFileUploadHandlers(
        this.options.storageAdapter.context,
        this.options.storageAdapter
      )
      this.pluginBuilder.addApiRouter({
        storage: {
          putObjSignedUrl: handlers['file.generatePutObjSignedUrl'],
          getObjSignedUrl: handlers['file.generateGetObjSignedUrl'],
          deleteObjSignedUrl: handlers['file.generateDeleteObjSignedUrl'],
        },
      })
    }

    const logs = this._logApiRouter(this.pluginBuilder.getApi()).sort((a, b) => a.localeCompare(b))
    const uiLogs = this._logUis(this.pluginBuilder.getUis()).sort((a, b) => a.localeCompare(b))
    logs.forEach((log) => console.log(`${log}`))
    uiLogs.forEach((log) => console.log(`${log}`))

    const appClient = {
      title: this.options.title,
      version: this.options.version,
      appBaseUrl: this.options.appBaseUrl,
      appPathPrefix: this.options.appPathPrefix,
      apiBaseUrl: this.options.apiBaseUrl ?? this.options.appBaseUrl,
      apiPathPrefix: this.options.apiPathPrefix,
      sidebar: this.options.sidebar,
      storageAdapter: this.storageRoutesForClient
        ? getStorageAdapterClient({
            storageAdapter: this.options.storageAdapter,
            grabGetObjectSignedUrlApiRoute: this.storageRoutesForClient.getObjSignedUrl,
            grabPutObjectSignedUrlApiRoute: this.storageRoutesForClient.putObjSignedUrl,
            grabDeleteObjectSignedUrlApiRoute: this.storageRoutesForClient.deleteObjSignedUrl,
          })
        : undefined,
    } satisfies GensekiAppClient

    return {
      ...appClient,
      uis: this.pluginBuilder.getUis(),
      api: this.pluginBuilder.getApi() as TMainApiRouter,
      middlewares: this.pluginBuilder.getMiddlewares(),
      toClient: () => appClient,
    }
  }
}

export function getFieldShapeClient(name: string, fieldShape: FieldShape): FieldShapeClient {
  if (isRelationFieldShape(fieldShape)) {
    if (fieldShape.$client.source === 'relation') {
      const sanitizedFields = Object.fromEntries(
        Object.entries(fieldShape.fields.shape).map(([key, value]) => {
          return [key, getFieldShapeClient(key, value)]
        })
      )

      return R.omit({ ...fieldShape, fields: sanitizedFields }, [
        '$server',
      ]) as unknown as FieldShapeClient
    }

    return R.omit(
      {
        ...fieldShape,
        label: fieldShape.label ?? name,
        placeholder: fieldShape.placeholder ?? name,
      },
      ['$server']
    ) as FieldShapeClient
  }

  if (isRichTextFieldShape(fieldShape)) {
    const sanitizedBaseField = R.omit(
      {
        ...fieldShape,
        label: fieldShape.label ?? name,
      },
      ['$server']
    ) as FieldShapeClient

    const sanitizedRichTextField = {
      ...sanitizedBaseField,
      editor: getEditorProviderClientProps(fieldShape.editor),
    }

    return sanitizedRichTextField
  }

  if (isMediaFieldShape(fieldShape)) {
    return R.omit(
      {
        ...fieldShape,
        label: fieldShape.label ?? name,
      },
      ['$server', 'options' as any]
    ) as FieldShapeClient
  }

  return R.omit(
    {
      ...fieldShape,
      label: fieldShape.label ?? name,
      placeholder: fieldShape.placeholder ?? name,
    },
    ['$server']
  ) as FieldShapeClient
}

export function getFieldsClient(fields: Fields): FieldsClient {
  return {
    shape: R.mapValues(fields.shape, (value, key) => getFieldShapeClient(key, value)),
    config: fields.config,
  }
}
