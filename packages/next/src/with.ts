import { createRouter } from 'radix3'

import type {
  AnyApiRouter,
  GensekiApp,
  GensekiAppClient,
  GensekiAppCompiled,
  GensekiUiRouter,
} from '@genseki/react'

export interface NextJsGensekiApp<TApiRouter extends AnyApiRouter = AnyApiRouter>
  extends GensekiAppCompiled<TApiRouter> {
  radixRouter: ReturnType<typeof createRouter<GensekiUiRouter>>
  toClient: () => NextJsGensekiAppClient
}

export interface NextJsGensekiAppClient extends GensekiAppClient {}

export function withNextJs<TApiRouter extends AnyApiRouter>(
  app: GensekiApp<string, TApiRouter>
): NextJsGensekiApp<TApiRouter> {
  const radixRouter = createRouter<GensekiUiRouter>()
  const compliedApp = app.build()
  const appClient = compliedApp.toClient()

  compliedApp.uis.forEach((ui) => radixRouter.insert(ui.path, ui))

  return {
    ...compliedApp,
    radixRouter,
    toClient: () => appClient,
  }
}
