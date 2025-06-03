import { createKivotosQueryClient } from '@kivotos/react-query'
import { createRestClient } from '@kivotos/rest'

import type { serverConfig } from './config'

export const restClient = createRestClient<typeof serverConfig>({
  baseUrl: '',
})
export const queryClient = createKivotosQueryClient(restClient)
