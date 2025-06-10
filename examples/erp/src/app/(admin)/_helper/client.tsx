import { getClientConfig } from '@genseki/react'

import { serverConfig } from '~/drizzlify/config'

export const clientConfig = getClientConfig(serverConfig)
