import type { AnyServerConfig, ServerConfig } from '@genseki/react'

export type GensekiPlugin<out TOutput extends AnyServerConfig> = {
  name: string
  plugin: (input: AnyServerConfig) => TOutput
}

type _MergePlugins<TPlugins extends GensekiPlugin<any>[]> = TPlugins extends [
  GensekiPlugin<infer TOutput>,
  ...infer Rest extends GensekiPlugin<any>[],
]
  ? TOutput & _MergePlugins<Rest>
  : {}

export type MergePlugins<
  TOriginalServerConfig extends ServerConfig,
  TPlugins extends GensekiPlugin<any>[],
> = _MergePlugins<TPlugins> & TOriginalServerConfig

export function createPlugin<TOutput extends AnyServerConfig>(
  args: GensekiPlugin<TOutput>
): GensekiPlugin<TOutput> {
  return args
}
