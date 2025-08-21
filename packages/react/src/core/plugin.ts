import { deepmerge } from 'deepmerge-ts'

import type { GensekiAppOptions, GensekiCore, GensekiMiddleware, GensekiUiRouter } from './config'
import type { AnyApiRouter } from './endpoint'

export class GensekiAppBuilder<TMainApiRouter extends AnyApiRouter = {}> {
  public readonly core: GensekiCore<TMainApiRouter> = {} as GensekiCore<TMainApiRouter>
  public readonly middlewares: GensekiMiddleware[] = []

  constructor(public readonly options: GensekiAppOptions) {}

  addMiddleware(middleware: GensekiMiddleware) {
    this.middlewares.push(middleware)
    return this
  }

  addPage<TProps = any>(page: GensekiUiRouter<TProps>) {
    this.core.uis.push(page)
    return this
  }

  addPages<TProps = any>(pages: GensekiUiRouter<TProps>[]) {
    this.core.uis.push(...pages)
    return this
  }

  addPageFn<TProps = any>(
    page: (options: GensekiAppOptions) => GensekiUiRouter<TProps> | GensekiUiRouter<TProps>
  ): GensekiAppBuilder<TMainApiRouter> {
    if (typeof page === 'function') {
      this.core.uis.push(page(this.options))
    } else {
      this.core.uis.push(page)
    }
    return this
  }

  addPageAndApiRouter<TProps = {}, TApiRouter extends AnyApiRouter = {}>(
    args:
      | ((options: GensekiAppOptions) => {
          ui: GensekiUiRouter<TProps>
          api: TApiRouter
        })
      | {
          ui: GensekiUiRouter<TProps>
          api: TApiRouter
        }
  ): GensekiAppBuilder<TMainApiRouter & TApiRouter> {
    if (typeof args === 'function') return this.addPageAndApiRouter(args(this.options))
    this.core.uis.push(args.ui)
    this.core.api = deepmerge(this.core.api ?? {}, args.api ?? {}) as TMainApiRouter
    return this as unknown as GensekiAppBuilder<TMainApiRouter & TApiRouter>
  }

  addApiRouter<TApiRouter extends AnyApiRouter>(
    router: TApiRouter
  ): GensekiAppBuilder<TMainApiRouter & TApiRouter> {
    this.core.api = deepmerge(this.core.api ?? {}, router ?? {}) as TMainApiRouter
    return this as unknown as GensekiAppBuilder<TMainApiRouter & TApiRouter>
  }
}

export interface GensekiPluginOptions extends GensekiAppOptions, GensekiCore<AnyApiRouter> {}

export interface GensekiPlugin<TName extends string, TApiRouter extends AnyApiRouter = {}> {
  name: TName
  plugin: (options: GensekiAppBuilder) => GensekiAppBuilder<TApiRouter>
}

export function createPlugin<TName extends string, TApiRouter extends AnyApiRouter = {}>(
  name: TName,
  plugin: (options: GensekiAppBuilder) => GensekiAppBuilder<TApiRouter>
): GensekiPlugin<TName, TApiRouter> {
  return {
    name: name,
    plugin: plugin,
  }
}

export type AnyGensekiPlugin = GensekiPlugin<string, AnyApiRouter>

export type InferApiRouterFromGensekiPlugin<TPlugin extends AnyGensekiPlugin> =
  TPlugin extends GensekiPlugin<string, infer TApiRouter> ? TApiRouter : never
