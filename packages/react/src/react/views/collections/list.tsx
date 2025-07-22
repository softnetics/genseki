import { CubeIcon } from '@phosphor-icons/react/dist/ssr'

import { ListTable } from './list.client'
import type { BaseViewProps } from './types'

import type { CollectionDefaultAdminApiRouter } from '../../../core/builder.utils'
import { getCollectionOptionsClient } from '../../../core/collection'
import type { Fields } from '../../../core/field'
import { BaseIcon } from '../../components/primitives/base-icon'
import { Typography } from '../../components/primitives/typography'
import { Badge } from '../../icons/badge'
import { formatSlug } from '../../utils/format-slug'
import { getHeadersObject } from '../../utils/headers'

interface ListViewProps extends BaseViewProps {
  headers: Headers
  searchParams: Record<string, string | string[]>
  findMany: CollectionDefaultAdminApiRouter<string, Fields>['findMany']
}

export async function ListView(props: ListViewProps) {
  const headersValue = getHeadersObject(props.headers)

  const limit = parseInt((props.searchParams['limit'] as string) ?? '10')
  const offset = parseInt((props.searchParams['offset'] as string) ?? '0')
  const orderBy = (props.searchParams['orderBy'] as string) ?? undefined
  const orderType = (props.searchParams['orderType'] as 'asc' | 'desc') ?? undefined

  // TODO: Fix this dummy request and response
  const request = new Request('http://localhost', {
    method: 'GET',
    headers: headersValue,
  })
  const response = new Response(null, {
    headers: { 'Content-Type': 'application/json' },
  })

  // TODO: Consider moving to client component
  const result = await props.findMany.handler(
    {
      query: { limit, offset, orderBy, orderType },
      headers: headersValue,
    },
    { request, response }
  )

  if (result.status !== 200) {
    throw new Error(
      `Failed to fetch data: ${result.status} ${JSON.stringify(result.body, null, 2)}`
    )
  }

  const collectionOptionsClient = getCollectionOptionsClient(props.slug, props.collectionOptions)

  return (
    <div>
      <div className="w-full px-12 py-24 [background-image:radial-gradient(100%_100%_at_10%_-30%,--alpha(var(--color-primary)/15%),var(--color-secondary))]">
        <div className="mx-auto grid w-full max-w-[1200px] grid-cols-[auto_1fr] gap-x-12">
          <div className="relative z-10 inline-block">
            <Badge
              width={75}
              height={75}
              className="relative z-10 dark:brightness-[40%] dark:contrast-150"
            />
            <BaseIcon
              icon={CubeIcon}
              size="xl"
              weight="duotone"
              className="absolute inset-0 z-20 m-auto"
            />
            <div className="absolute -inset-8 z-0 aspect-square [background-image:radial-gradient(circle,--alpha(var(--color-fg)/25%)_2px,--alpha(var(--color-fg)/25%)_2px,transparent_2px)] [background-repeat:repeat] [background-size:8px_8px] [mask-image:radial-gradient(circle,black,transparent_80%)]" />
          </div>
          <div className="flex flex-col">
            <Typography type="h2" weight="bold" className="text-text-nontrivial">
              {formatSlug(props.slug)}
            </Typography>
            <Typography type="h4" weight="normal" className="text-text-body">
              A collection
            </Typography>
          </div>
        </div>
      </div>
      <div className="p-12">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-y-12">
          <ListTable
            slug={props.slug}
            collectionOptions={collectionOptionsClient}
            data={result.body.data}
          />
        </div>
      </div>
    </div>
  )
}
