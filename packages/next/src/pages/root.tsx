import 'server-only'

import { NotfoundPage } from './404'

import type { NextJsServerConfig } from '../config'
import type { ServerFunction } from '../server-function'

interface RootProps {
  serverConfig: NextJsServerConfig<any, any, any, any>
  serverFunction: ServerFunction
  paramsPromise: Promise<{ segments: string[] }>
  searchParamsPromise: Promise<{ [key: string]: string | string[] }>
}

export async function RootPage(props: RootProps) {
  const [params, searchParams] = await Promise.all([props.paramsPromise, props.searchParamsPromise])
  const path = `/${params.segments.join('/')}`
  const result = props.serverConfig.radixRouter.lookup(path)

  if (!result) {
    return <NotfoundPage redirectURL="/admin/collections" />
  }

  const user: any = {}
  // if (result.requiredAuthentication) {
  //   user = await getUser(props.serverFunction)
  //   if (!user) {
  //     return <NotAuthorizedPage redirectURL="/admin/login" />
  //   }
  // }

  const page = result.view({
    user: user,
    params: result.params ?? {},
    serverConfig: props.serverConfig,
    searchParams: searchParams,
    serverFunction: props.serverFunction,
  })
  return page
}
