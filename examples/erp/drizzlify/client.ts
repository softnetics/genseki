import { createKivotosQueryClient } from '@genseki/react-query'
import { createRestClient } from '@genseki/rest'

import type { serverConfig } from './config'

export const restClient = createRestClient<typeof serverConfig>({
  baseUrl: '',
})

export const queryClient = createKivotosQueryClient(restClient)
