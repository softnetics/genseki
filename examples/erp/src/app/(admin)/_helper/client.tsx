import { getClientConfig } from '@genseki/react'

import { serverConfig } from '~/genseki/config'

export const clientConfig = getClientConfig(serverConfig)
