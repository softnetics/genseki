import { RootPage } from '@genseki/next'
import { headers } from 'next/headers'

import { serverConfig } from '~/drizzlify/config'

import { serverFunction } from '../../_helper/server'

interface AdminPageProps {
  params: Promise<{ segments: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] }>
}

export default async function AdminPage(props: AdminPageProps) {
  return (
    <RootPage
      serverConfig={serverConfig}
      serverFunction={serverFunction}
      headersPromise={headers()}
      paramsPromise={props.params}
      searchParamsPromise={props.searchParams}
    />
  )
}
