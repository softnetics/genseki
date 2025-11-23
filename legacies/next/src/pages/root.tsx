import { isValidElement } from 'react'

import { redirect, RedirectType } from 'next/navigation'

import type { RequestContextable } from '@genseki/react'
import { NotfoundPage, type ServerFunction } from '@genseki/react'

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

  // Handle root path
  if (!Array.isArray(params.segments) || params.segments.length === 0) {
    return redirect('/admin/collections')
  }

  const pathname = `/${params.segments.join('/')}`
  const result = props.app.radixRouter.lookup(pathname)

  if (!result) {
    return <NotfoundPage redirectURL="/admin/collections" />
  }

  const request = new Request(`http://localhost${pathname}`, {
    headers: headers,
  })
  const requestContext = result.context.toRequestContext(request) as RequestContextable

  for (const middleware of props.app.middlewares ?? []) {
    const middlewareResult = await middleware({
      context: requestContext,
      pathname: pathname,
      params: result.params ?? {},
      searchParams: searchParams,
      ui: result,
    })

    if (!middlewareResult) {
      continue
    }

    if (typeof middlewareResult === 'object' && 'redirect' in middlewareResult) {
      return redirect(middlewareResult.redirect)
    }

    if (isValidElement(middlewareResult)) {
      return middlewareResult
    }

    throw middlewareResult
  }

  const page = await result.render({
    headers: headers,
    pathname: pathname,
    params: result.params ?? {},
    searchParams: searchParams,
    props: result.props ?? {},
  })

  if (!page) {
    return null
  }

  if (typeof page === 'object' && 'redirect' in page) {
    if (page.type === 'replace') {
      return redirect(page.redirect, RedirectType.replace)
    }
    return redirect(page.redirect)
  }

  return page
}
