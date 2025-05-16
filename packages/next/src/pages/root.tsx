import { ServerConfig } from '@kivotos/core'
import { headers as nextHeaders } from 'next/headers'

import RootAuthPage from './auth/root-auth'
import { RootCollectionPage } from './root-collection'

interface RootProps {
  serverConfig: ServerConfig
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
      <RootCollectionPage
        serverConfig={serverConfig}
        segments={params.segments.slice(1)}
        searchParams={searchParams}
        headers={headers}
      />
    )
  }

  throw new Error(`Feature ${feature} not found`)
}
