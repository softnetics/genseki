import { RootPage } from '@kivotos/next'

import { serverConfig } from '~/drizzlify/config'

interface AdminPageProps {
  params: Promise<{ segments: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] }>
}

export default async function AdminPage(props: AdminPageProps) {
  return (
    <RootPage
      serverConfig={serverConfig}
      paramsPromise={props.params}
      searchParamsPromise={props.searchParams}
    />
  )
}
