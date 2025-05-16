import { getClientConfig } from '@kivotos/core'

import { serverConfig } from '~/drizzlify/config'

export const clientConfig = getClientConfig(serverConfig)
