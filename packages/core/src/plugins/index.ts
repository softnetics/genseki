import type { admin } from './admin'

import type { ServerConfig } from '../config'

export type KivotosPlugin<TOutput extends ServerConfig> = (input: ServerConfig) => TOutput

type _MergePlugins<TPlugins extends KivotosPlugin<any>[]> = TPlugins extends [
  KivotosPlugin<infer TOutput>,
  ...infer Rest extends KivotosPlugin<any>[],
]
  ? TOutput & _MergePlugins<Rest>
  : {}

type X = _MergePlugins<[ReturnType<typeof admin>]>['endpoints']['example']

export type MergePlugins<
  TOriginalServerConfig extends ServerConfig,
  TPlugins extends KivotosPlugin<any>[],
> = _MergePlugins<TPlugins> & TOriginalServerConfig

export function createPlugin<TOutput extends ServerConfig>(
  plugin: KivotosPlugin<TOutput>
): KivotosPlugin<TOutput> {
  return plugin
}
