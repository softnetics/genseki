import { getClientConfig } from '@repo/drizzlify'

import { serverConfig } from '~/drizzlify/config'

export const clientConfig = getClientConfig(serverConfig)
