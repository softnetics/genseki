import 'server-only'

import { headers as nextHeaders } from 'next/headers'

import type { ServerConfig } from '@kivotos/core'

import { NotfoundPage } from './404'
import { RootAuthPage } from './root-auth'
import { RootCollectionPage } from './root-collection'

import { RootCollectionLayout } from '../layouts/root-collection'

interface RootProps {
  serverConfig: ServerConfig<any, any, any, any>
  paramsPromise: Promise<{ segments: string[] }>
  searchParamsPromise: Promise<{ [key: string]: string | string[] }>
}

export async function RootPage(props: RootProps) {
  const { serverConfig, paramsPromise, searchParamsPromise } = props

  const [params, searchParams, headers] = await Promise.all([
    paramsPromise,
    searchParamsPromise,
    nextHeaders(),
  ])

  /**
   * @description First segment is the feature segment, we use this thing for capturing the main route
   *
   * i.e. /collections/... -> `collections`
   *      /users/... -> `users`
   *      /plugins/... -> `plugins`
   */

  if (!Array.isArray(params.segments))
    throw new Error(`Make sure there's a "[...segment]" folder one level up from this file.`)

  const feature = params.segments[0]

  if (feature === 'auth') {
    return (
      <RootAuthPage
        serverConfig={serverConfig}
        segments={params.segments.slice(1)}
        searchParams={searchParams}
        headers={headers}
      />
    )
  }
  if (feature === 'collections') {
    return (
      <RootCollectionLayout serverConfig={serverConfig}>
        <RootCollectionPage
          serverConfig={serverConfig}
          segments={params.segments.slice(1)}
          searchParams={searchParams}
          headers={headers}
        />
      </RootCollectionLayout>
    )
  }

  return <NotfoundPage redirectURL="/admin/collections" />
}
