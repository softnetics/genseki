import { RootAuthPage } from '@repo/drizzlify-next'

import { serverConfig } from '~/drizzlify/config'

interface AdminAuthPageProps {
  params: Promise<{ segments: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] }>
}

export default async function AdminAuthPage(props: AdminAuthPageProps) {
  return (
    <RootAuthPage
      serverConfig={serverConfig}
      searchParams={await props.searchParams}
      segments={(await props.params).segments}
    />
  )
}
