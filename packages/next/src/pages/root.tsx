import 'server-only'

import { NotAuthorizedPage, NotfoundPage, type ServerFunction } from '@genseki/react'

import type { NextJsServerConfig } from '../config'
import { getUser } from '../utils/get-user'

interface RootProps {
  serverConfig: NextJsServerConfig<any, any, any, any>
  serverFunction: ServerFunction
  headersPromise: Promise<Headers>
  paramsPromise: Promise<{ segments: string[] }>
  searchParamsPromise: Promise<{ [key: string]: string | string[] }>
}

export async function RootPage(props: RootProps) {
  const [params, searchParams, headers] = await Promise.all([
    props.paramsPromise,
    props.searchParamsPromise,
    props.headersPromise,
  ])
  const path = `/${params.segments.join('/')}`
  const result = props.serverConfig.radixRouter.lookup(path)

  if (!result) {
    return <NotfoundPage redirectURL="/admin/collections" />
  }

  let user: any = {}
  if (result.requiredAuthentication) {
    user = await getUser(props.serverFunction, headers)
    if (!user) {
      return <NotAuthorizedPage redirectURL="/admin/auth/login" />
    }
  }

  const page = result.view({
    user: user,
    headers: headers,
    params: result.params ?? {},
    serverConfig: props.serverConfig,
    searchParams: searchParams,
    serverFunction: props.serverFunction,
  })

  return page
}
