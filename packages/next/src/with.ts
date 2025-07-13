import { createRouter } from 'radix3'

import type { GensekiAppCompiled, GensekiUiRouter } from '@genseki/react'

export interface NextJsGensekiApp extends GensekiAppCompiled {
  radixRouter: ReturnType<typeof createRouter<GensekiUiRouter>>
  toClient: () => NextJsGensekiAppClient
}

export interface NextJsGensekiAppClient extends Pick<GensekiAppCompiled, 'storageAdapter'> {}

export function withNextJs<TGensekiApp extends GensekiAppCompiled>(app: TGensekiApp) {
  const radixRouter = createRouter<GensekiUiRouter>()
  app.uis.forEach((ui) => radixRouter.insert(ui.path, ui))

  return {
    ...app,
    radixRouter: radixRouter,
    toClient(): NextJsGensekiAppClient {
      return {
        storageAdapter: app.storageAdapter,
      }
    },
  }
}
