import { createApiResourceRouter } from '@genseki/next'

import { nextjsApp } from '~/genseki/config'

const { GET, POST, PUT, PATCH, DELETE } = createApiResourceRouter(nextjsApp)
export { DELETE, GET, PATCH, POST, PUT }
