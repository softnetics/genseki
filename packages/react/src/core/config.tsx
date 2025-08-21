import { type ReactNode } from 'react'

import * as R from 'remeda'
import type { Promisable } from 'type-fest'

import {
  type AnyContextable,
  type AnyRequestContextable,
  type ApiRouter,
  createFileUploadHandlers,
} from '.'
import { type AnyApiRouter, type ApiRoutePath, isApiRoute } from './endpoint'
import type { Fields, FieldsClient, FieldShape, FieldShapeClient } from './field'
import {
  getStorageAdapterClient,
  type StorageAdapter,
  type StorageAdapterClient,
} from './file-storage-adapters/generic-adapter'
import {
  type AnyGensekiPlugin,
  GensekiAppBuilder,
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
  apiPrefix?: string
  pagePathPrefix?: string
  components?: {
    NotFound?: () => ReactNode
  }
  sidebar?: AppSideBarBuilderProps
  storageAdapter?: StorageAdapter
  middlewares?: GensekiMiddleware[]
}

export interface GensekiCore<TApiRouter extends AnyApiRouter = AnyApiRouter> {
  api: TApiRouter
  uis: GensekiUiRouter[]
}

export interface GensekiAppClient {
  title: string
  version: string
  apiPrefix?: string
  pagePathPrefix?: string
  storageAdapter?: StorageAdapterClient
}
export interface GensekiAppCompiled<TApiRouter extends AnyApiRouter = AnyApiRouter> {
  title: string
  version: string
  apiPrefix?: string
  pagePathPrefix?: string
  api: TApiRouter
  uis: GensekiUiRouter[]
  middlewares?: GensekiMiddleware[]
  storageAdapter?: StorageAdapterClient
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

export class GensekiApp<TApiPrefix extends string, TMainApiRouter extends AnyApiRouter = {}> {
  private readonly pluginBuilder = new GensekiAppBuilder(this.options)

  private storageRoutesForClient?: {
    putObjSignedUrl: ApiRoutePath
    getObjSignedUrl: ApiRoutePath
    deleteObjSignedUrl: ApiRoutePath
  }

  constructor(private readonly options: GensekiAppOptions) {
    this.pluginBuilder.addMiddleware(unauthorizedMiddleware)

    if (this.options.storageAdapter) {
      const { handlers } = createFileUploadHandlers(
        this.options.storageAdapter.context,
        this.options.storageAdapter
      )
      const apiPrefix = this.options.apiPrefix ?? '/api'

      const putHandler = handlers['file.generatePutObjSignedUrl']
      const getHandler = handlers['file.generateGetObjSignedUrl']
      const deleteHandler = handlers['file.generateDeleteObjSignedUrl']

      this.storageRoutesForClient = {
        putObjSignedUrl: {
          method: putHandler.schema.method,
          path: `${apiPrefix}${putHandler.schema.path}`,
        },
        getObjSignedUrl: {
          method: getHandler.schema.method,
          path: `${apiPrefix}${getHandler.schema.path}`,
        },
        deleteObjSignedUrl: {
          method: deleteHandler.schema.method,
          path: `${apiPrefix}${deleteHandler.schema.path}`,
        },
      }
    }
  }

  apply<const TPlugin extends AnyGensekiPlugin>(
    plugin: TPlugin
  ): GensekiApp<TApiPrefix, TMainApiRouter & InferApiRouterFromGensekiPlugin<TPlugin>> {
    plugin.plugin(this.pluginBuilder)
    return this as unknown as GensekiApp<
      TApiPrefix,
      TMainApiRouter & InferApiRouterFromGensekiPlugin<TPlugin>
    >
  }

  private _logApiRouter(router: ApiRouter): string[] {
    const logs: string[] = []
    if (isApiRoute(router)) {
      logs.push(`API Route: ${router.schema.method} ${router.schema.path}`)
      return logs
    }
    Object.entries(router).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        logs.push(...this._logApiRouter(value as ApiRouter))
      }
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

    const logs = this._logApiRouter(this.pluginBuilder.core.api).sort((a, b) => a.localeCompare(b))
    const uiLogs = this._logUis(this.pluginBuilder.core.uis).sort((a, b) => a.localeCompare(b))
    logs.forEach((log) => console.log(`${log}`))
    uiLogs.forEach((log) => console.log(`${log}`))

    const appClient = {
      title: this.options.title,
      version: this.options.version,
      apiPrefix: this.options.apiPrefix,
      pagePathPrefix: this.options.pagePathPrefix,
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
      uis: this.pluginBuilder.core.uis,
      api: this.pluginBuilder.core.api as TMainApiRouter,
      middlewares: this.pluginBuilder.middlewares,
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
