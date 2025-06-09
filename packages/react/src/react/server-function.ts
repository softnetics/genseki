import { type ServerConfig } from '@genseki/react'

export type ServerFunction<
  TServerConfig extends ServerConfig<any, any, any, any> = ServerConfig<any, any, any, any>,
> = <TApiArgs extends GetServerFunctionApiArgs<TServerConfig['endpoints']>>(
  args: TApiArgs
) => Promise<GetServerFunctionResponse<TServerConfig, TApiArgs['method']>>
