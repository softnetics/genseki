import { createRouter } from 'radix3'

import type {
  FlatApiRouter,
  GensekiApp,
  GensekiAppClient,
  GensekiAppCompiled,
  GensekiUiRouter,
} from '@genseki/react'

export interface NextJsGensekiApp<TApiRouter extends FlatApiRouter = {}>
  extends GensekiAppCompiled<TApiRouter> {
  radixRouter: ReturnType<typeof createRouter<GensekiUiRouter>>
  toClient: () => NextJsGensekiAppClient
}

export interface NextJsGensekiAppClient extends GensekiAppClient {}

export function withNextJs<TApiRouter extends FlatApiRouter>(
  app: GensekiApp<TApiRouter>
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
