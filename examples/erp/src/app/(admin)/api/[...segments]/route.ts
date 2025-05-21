import { createApiResourceRouter } from '@kivotos/next'

import { serverConfig } from '~/drizzlify/config'

const { GET, POST, PUT, PATCH, DELETE } = createApiResourceRouter(serverConfig)
export { DELETE, GET, PATCH, POST, PUT }
