import { deepmerge } from 'deepmerge-ts'

import type { GensekiAppOptions, GensekiCore, GensekiMiddleware, GensekiUiRouter } from './config'
import type { AnyApiRouter } from './endpoint'

export class GensekiAppBuilder<TMainApiRouter extends AnyApiRouter = {}> {
  private api: TMainApiRouter = {} as TMainApiRouter
  private uis: GensekiUiRouter[] = []
  private readonly middlewares: GensekiMiddleware[] = []

  constructor(private readonly options: GensekiAppOptions) {}

  getApi(): TMainApiRouter {
    return this.api
  }

  getUis(): GensekiUiRouter[] {
    return this.uis
  }

  getMiddlewares(): GensekiMiddleware[] {
    return this.middlewares
  }

  addMiddleware(middleware: GensekiMiddleware) {
    this.middlewares.push(middleware)
    return this
  }

  addMiddlewares(middlewares: GensekiMiddleware[]) {
    this.middlewares.push(...middlewares)
    return this
  }

  addPage<TProps = any>(page: GensekiUiRouter<TProps>) {
    this.uis.push(page)
    return this
  }

  addPages<TProps = any>(pages: GensekiUiRouter<TProps>[]) {
    this.uis.push(...pages)
    return this
  }

  overridePage(cb: (pages: GensekiUiRouter[]) => GensekiUiRouter[]) {
    const newPages = cb(this.uis)
    this.uis = newPages
    return this
  }

  addPageFn<TProps = any>(
    page: (options: GensekiAppOptions) => GensekiUiRouter<TProps> | GensekiUiRouter<TProps>
  ): GensekiAppBuilder<TMainApiRouter> {
    if (typeof page === 'function') {
      this.uis.push(page(this.options))
    } else {
      this.uis.push(page)
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
    this.uis.push(args.ui)
    this.api = deepmerge(this.api ?? {}, args.api ?? {}) as TMainApiRouter
    return this as unknown as GensekiAppBuilder<TMainApiRouter & TApiRouter>
  }

  addApiRouter<TApiRouter extends AnyApiRouter>(
    router: TApiRouter
  ): GensekiAppBuilder<TMainApiRouter & TApiRouter> {
    this.api = deepmerge(this.api ?? {}, router ?? {}) as TMainApiRouter
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
