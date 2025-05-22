import 'server-only'

import { NotfoundPage } from './404'

import type { NextJsServerConfig } from '../config'

interface RootProps {
  serverConfig: NextJsServerConfig
  paramsPromise: Promise<{ segments: string[] }>
  searchParamsPromise: Promise<{ [key: string]: string | string[] }>
}

export async function RootPage(props: RootProps) {
  const { serverConfig, paramsPromise, searchParamsPromise } = props

  const [params, searchParams] = await Promise.all([paramsPromise, searchParamsPromise])
  const path = `/${params.segments.join('/')}`
  const result = serverConfig.radixRouter.lookup(path)

  if (!result) {
    return <NotfoundPage redirectURL="/admin/collections" />
  }

  const page = result.view({ ...result.params, serverConfig, searchParams })
  return page
}
