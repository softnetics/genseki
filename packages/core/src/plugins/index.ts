import type { AnyServerConfig, ServerConfig } from '../config'

export type KivotosPlugin<out TOutput extends AnyServerConfig> = {
  name: string
  plugin: (input: AnyServerConfig) => TOutput
}

type _MergePlugins<TPlugins extends KivotosPlugin<any>[]> = TPlugins extends [
  KivotosPlugin<infer TOutput>,
  ...infer Rest extends KivotosPlugin<any>[],
]
  ? TOutput & _MergePlugins<Rest>
  : {}

export type MergePlugins<
  TOriginalServerConfig extends ServerConfig,
  TPlugins extends KivotosPlugin<any>[],
> = _MergePlugins<TPlugins> & TOriginalServerConfig

export function createPlugin<TOutput extends AnyServerConfig>(
  args: KivotosPlugin<TOutput>
): KivotosPlugin<TOutput> {
  return args
}
