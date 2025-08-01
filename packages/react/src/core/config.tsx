import { type ReactNode } from 'react'

import { deepmerge } from 'deepmerge-ts'
import * as R from 'remeda'
import type { Promisable } from 'type-fest'

import type { AnyContextable, AnyRequestContextable, ApiRouter } from '.'
import { type AnyApiRouter, isApiRoute } from './endpoint'
import type { Fields, FieldsClient, FieldShape, FieldShapeClient } from './field'
import {
  getStorageAdapterClient,
  type StorageAdapter,
  type StorageAdapterClient,
} from './file-storage-adapters/generic-adapter'
import { getEditorProviderClientProps } from './richtext'
import { isMediaFieldShape, isRelationFieldShape, isRichTextFieldShape } from './utils'

import { type AppSideBarBuilderProps, NotAuthorizedPage } from '../react'

interface RenderArgs {
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
  uiPathPrefix?: string
  components?: {
    NotFound?: () => ReactNode
  }
  sidebar?: AppSideBarBuilderProps
  storageAdapter?: StorageAdapter
  middlewares?: GensekiMiddleware[]
}

export interface GensekiPluginOptions extends GensekiAppOptions, GensekiCore<AnyApiRouter> {}

export interface GensekiCore<TApiRouter extends AnyApiRouter = AnyApiRouter> {
  api: TApiRouter
  uis: GensekiUiRouter[]
}

export interface GensekiAppCompiled<TApiRouter extends AnyApiRouter = AnyApiRouter>
  extends GensekiCore<TApiRouter> {
  middlewares?: GensekiMiddleware[]
  storageAdapter?: StorageAdapterClient
}

export interface GensekiAppCompiledClient {
  storageAdapter?: StorageAdapterClient
}

export interface GensekiPlugin<TName extends string, TApiRouter extends AnyApiRouter> {
  name: TName
  plugin: (options: GensekiPluginOptions) => GensekiCore<TApiRouter>
}

export function createPlugin<TName extends string, TApiRouter extends AnyApiRouter>(args: {
  name: TName
  plugin: (options: GensekiPluginOptions) => GensekiCore<TApiRouter>
}): GensekiPlugin<TName, TApiRouter> {
  return args
}

export type AnyGensekiPlugin = GensekiPlugin<string, AnyApiRouter>
export type InferApiRouterFromGensekiPlugin<TPlugin extends AnyGensekiPlugin> = ReturnType<
  TPlugin['plugin']
>['api']

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
  // private readonly apiPathPrefix: string
  private readonly plugins: AnyGensekiPlugin[] = []
  private core: GensekiCore<TMainApiRouter> = {} as GensekiCore<TMainApiRouter>

  constructor(private readonly options: GensekiAppOptions) {
    this.options.middlewares = this.options.middlewares ?? []
    this.options.middlewares.push(unauthorizedMiddleware)
  }

  apply<const TPlugin extends AnyGensekiPlugin>(
    plugin: TPlugin
  ): GensekiApp<TApiPrefix, TMainApiRouter & InferApiRouterFromGensekiPlugin<TPlugin>>

  apply<const TApiRouter extends AnyApiRouter = AnyApiRouter>(
    core: Partial<GensekiCore<TApiRouter>>
  ): GensekiApp<TApiPrefix, TMainApiRouter & TApiRouter>

  apply(input: any) {
    if (isGensekiPlugin(input)) {
      this.plugins.push(input)
    } else {
      this.core = {
        api: { ...(this.core.api ?? {}), ...(input.api ?? {}) },
        uis: [...(this.core.uis ?? []), ...(input.uis ?? [])],
      }
    }
    return this
  }

  _logging(router: ApiRouter): string[] {
    const logs: string[] = []
    if (isApiRoute(router)) {
      logs.push(`API Route: ${router.schema.method} ${router.schema.path}`)
      return logs
    }
    Object.entries(router).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        logs.push(...this._logging(value as ApiRouter))
      }
    })
    return logs
  }

  build(): GensekiAppCompiled<TMainApiRouter> {
    const core = this.plugins.reduce(
      (acc, plugin) => {
        const pluginCore = plugin.plugin({
          ...this.options,
          ...acc,
        })
        return {
          api: deepmerge(acc.api, pluginCore.api) as TMainApiRouter,
          uis: [...acc.uis, ...(pluginCore.uis ?? [])],
        }
      },
      {
        uis: this.core.uis ?? [],
        api: this.core.api ?? {},
      } as unknown as GensekiCore<TMainApiRouter>
    )

    const logs = this._logging(core.api).sort((a, b) => a.localeCompare(b))
    logs.forEach((log) => console.log(`${log}`))

    return {
      middlewares: this.options.middlewares,
      storageAdapter: getStorageAdapterClient({
        storageAdapter: this.options.storageAdapter,
        grabPutObjectSignedUrlApiRoute: {} as any, // TODO: Fix client endpoint types,
        grabGetObjectSignedUrlApiRoute: {} as any, // TODO: Fix client endpoint types
      }),
      api: core.api,
      uis: core.uis,
    }
  }
}

export function getFieldShapeClient(
  name: string,
  fieldShape: FieldShape
): FieldShapeClient & { $client: { fieldName: string } } {
  if (isRelationFieldShape(fieldShape)) {
    if (fieldShape.$client.source === 'relation') {
      const sanitizedFields = Object.fromEntries(
        Object.entries(fieldShape.fields.shape).map(([key, value]) => {
          return [key, getFieldShapeClient(key, value)]
        })
      )

      return R.omit(
        {
          ...fieldShape,
          fields: sanitizedFields,
        },
        ['$server', 'options' as any]
      ) as FieldShapeClient & { $client: { fieldName: string } }
    }

    return R.omit(
      {
        ...fieldShape,
        label: fieldShape.label ?? name,
        placeholder: fieldShape.placeholder ?? name,
      },
      ['$server', 'options' as any]
    ) as FieldShapeClient & { $client: { fieldName: string } }
  }

  if (isRichTextFieldShape(fieldShape)) {
    const sanitizedBaseField = R.omit(
      {
        ...fieldShape,
        label: fieldShape.label ?? name,
      },
      ['$server', 'options' as any]
    ) as FieldShapeClient & { $client: { fieldName: string } }

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
    ) as FieldShapeClient & { $client: { fieldName: string } }
  }

  return R.omit(
    {
      ...fieldShape,
      label: fieldShape.label ?? name,
      placeholder: fieldShape.placeholder ?? name,
    },
    ['$server', 'options' as any]
  ) as FieldShapeClient & { $client: { fieldName: string } }
}

export function getFieldsClient(fields: Fields): FieldsClient {
  return {
    shape: R.mapValues(fields.shape, (value, key) => getFieldShapeClient(key, value)),
    config: fields.config,
  }
}

function isGensekiPlugin<TPlugin extends AnyGensekiPlugin>(plugin: any): plugin is TPlugin {
  return 'name' in plugin && 'plugin' in plugin
}
