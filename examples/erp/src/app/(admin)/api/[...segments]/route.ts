import { serverConfig } from '~/genseki/config'

const { GET, POST, PUT, PATCH, DELETE } = serverConfig.resourceRouter
export { DELETE, GET, PATCH, POST, PUT }
