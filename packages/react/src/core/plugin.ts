import { deepmerge } from 'deepmerge-ts'
import type { Simplify } from 'type-fest'

import type {
  GensekiAppOptions,
  GensekiAppOptionsWithDefaults,
  GensekiMiddleware,
  GensekiUiRouter,
} from './config'
import {
  type AnyApiRouter,
  type ApiRoute,
  type FlatApiRouter,
  recordifyApiRouter,
  type RecordifyApiRoutes,
} from './endpoint'
import type { IsValidTable } from './table'

export interface GensekiPluginBuilderOptions extends GensekiAppOptionsWithDefaults {}

export class GensekiPluginBuilder<TMainApiRouter extends FlatApiRouter = {}> {
  private api: TMainApiRouter = {} as TMainApiRouter
  private uis: GensekiUiRouter[] = []
  private readonly middlewares: GensekiMiddleware[] = []

  constructor(private readonly options: GensekiPluginBuilderOptions) {}

  getApi(): TMainApiRouter {
    return this.api
  }

  getUis(): GensekiUiRouter[] {
    return this.uis
  }

  getOptions(): GensekiPluginBuilderOptions {
    return this.options
  }

  getMiddlewares(): GensekiMiddleware[] {
    return this.middlewares
  }

  addMiddleware(middleware: GensekiMiddleware) {
    this.middlewares.push(middleware)
    return this
  }

  addMiddlewares(middlewares: GensekiMiddleware[]) {
    for (const m of middlewares) this.addMiddleware(m)
    return this
  }

  addPage<TProps = any>(page: GensekiUiRouter<TProps>) {
    this.uis.push(page)
    return this
  }

  addPages<TProps = any>(pages: GensekiUiRouter<TProps>[]) {
    for (const page of pages) this.addPage(page)
    return this
  }

  overridePages(
    cb: (pages: GensekiUiRouter[], options: GensekiPluginBuilderOptions) => GensekiUiRouter[]
  ) {
    const newPages = cb(this.uis, this.options)
    this.uis = newPages
    return this
  }

  addPageFn<TProps = any>(
    page: (options: GensekiAppOptions) => GensekiUiRouter<TProps> | GensekiUiRouter<TProps>
  ): GensekiPluginBuilder<TMainApiRouter> {
    if (typeof page === 'function') this.addPage(page(this.options))
    else this.addPage(page)
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
  ): GensekiPluginBuilder<Simplify<TMainApiRouter & RecordifyApiRoutes<TApiRouter>>> {
    if (typeof args === 'function') return this.addPageAndApiRouter(args(this.options))
    this.addPage(args.ui)
    this.addApiRouter(args.api)
    return this as unknown as GensekiPluginBuilder<TMainApiRouter & RecordifyApiRoutes<TApiRouter>>
  }

  addApiRouter<TApiRouter extends AnyApiRouter>(
    router: TApiRouter
  ): GensekiPluginBuilder<Simplify<TMainApiRouter & RecordifyApiRoutes<TApiRouter>>> {
    const flatApiRouter = recordifyApiRouter(router)
    this.api = deepmerge(this.api ?? {}, flatApiRouter ?? {}) as TMainApiRouter &
      RecordifyApiRoutes<TApiRouter>
    return this as unknown as GensekiPluginBuilder<TMainApiRouter & RecordifyApiRoutes<TApiRouter>>
  }
}

export interface GensekiPlugin<
  TName extends string,
  TMainApiRouter extends Record<string, ApiRoute> = {},
> {
  name: TName
  plugin: (options: GensekiPluginBuilder) => GensekiPluginBuilder<TMainApiRouter>
}

export function createPlugin<
  TName extends string,
  TMainApiRouter extends Record<string, ApiRoute> = {},
>(
  name: TName,
  plugin: (options: GensekiPluginBuilder) => GensekiPluginBuilder<TMainApiRouter>
): GensekiPlugin<TName, TMainApiRouter> {
  return { name: name, plugin: plugin }
}

export type AnyGensekiPlugin = GensekiPlugin<string, Record<string, ApiRoute>>

export type InferApiRouterFromGensekiPlugin<TPlugin extends AnyGensekiPlugin> =
  TPlugin extends GensekiPlugin<string, infer TApiRouter> ? TApiRouter : never

export type ValidatePluginSchema<
  TPluginSchema extends Record<string, any>,
  TSchema extends Record<keyof TPluginSchema, any>,
> = {
  [K in keyof TPluginSchema]: IsValidTable<TPluginSchema[K], TSchema[K]>
}

export type ObjectWithOnlyValue<TObj extends Record<string, any>, TValue> = {
  [K in keyof TObj]: TValue
}

export type ValidateSchema<
  TPluginSchema extends Record<string, any>,
  TSchema extends Record<keyof TPluginSchema, any>,
  TOutput,
> =
  ValidatePluginSchema<TPluginSchema, TSchema> extends ObjectWithOnlyValue<TSchema, true>
    ? TOutput
    : ValidatePluginSchema<TPluginSchema, TSchema>
