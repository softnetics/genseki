import { ServerConfig } from '~/core/config'

export function DeleteButton<TServerConfig extends ServerConfig>(props: {
  serverConfig: TServerConfig
}) {
  return <button>Delete</button>
}
