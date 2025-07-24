import type { RequestContextable } from '@genseki/react'
import { NotAuthorizedPage, NotfoundPage, type ServerFunction } from '@genseki/react'

import type { NextJsGensekiApp } from '../with'

interface RootProps {
  app: NextJsGensekiApp
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

  const pathname = `/${params.segments.join('/')}`
  const result = props.app.radixRouter.lookup(pathname)

  if (!result) {
    return <NotfoundPage redirectURL="/admin/collections" />
  }

  const request = new Request(`http://localhost${pathname}`, {
    headers: headers,
  })
  const requestContext = result.context.toRequestContext(request) as RequestContextable

  let user: any = {}
  if (result.requiredAuthenticated) {
    user = await requestContext.requiredAuthenticated()
    if (!user) {
      return <NotAuthorizedPage redirectURL="/admin/auth/login" />
    }
  }

  const page = result.render({
    headers: headers,
    pathname: pathname,
    params: result.params ?? {},
    searchParams: searchParams,
    props: result.props ?? {},
  })

  return page
}
