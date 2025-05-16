import { ServerConfig } from '@repo/drizzlify'

let _config: ServerConfig | null = null

export function setServerConfig(config: ServerConfig) {
  _config = config
}

export function getServerConfig(): ServerConfig {
  if (!_config) throw new Error('ServerConfig not set.')
  return _config
}
