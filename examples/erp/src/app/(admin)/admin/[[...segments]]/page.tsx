import { headers } from 'next/headers'

import { RootPage } from '@genseki/next'

import { nextjsApp } from '../../../../../genseki/config'
import { serverFunction } from '../../_helper/server'

interface AdminPageProps {
  params: Promise<{ segments: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] }>
}

export default async function AdminPage(props: AdminPageProps) {
  return (
    <RootPage
      app={nextjsApp}
      serverFunction={serverFunction}
      paramsPromise={props.params}
      headersPromise={headers()}
      searchParamsPromise={props.searchParams}
    />
  )
}
