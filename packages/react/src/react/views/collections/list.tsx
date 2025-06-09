import { CubeIcon } from '@phosphor-icons/react/dist/ssr'

import type { ServerConfig } from '@genseki/react'
import { Context, createAuth, getClientCollection } from '@genseki/react'

import { ListTable } from './list.client'

import { BaseIcon } from '../../components/primitives/base-icon'
import { Typography } from '../../components/primitives/typography'
import { Badge } from '../../icons/badge'
import { formatSlug } from '../../utils/format-slug'
import { getHeadersObject } from '../../utils/headers'

interface ListViewProps {
  slug: string
  serverConfig: ServerConfig
  searchParams: Record<string, string | string[]>
}

export async function ListView(props: ListViewProps) {
  const collection = props.serverConfig.collections[props.slug]

  if (!collection) throw new Error(`Collection ${props.slug} not found`)

  // TODO: Pass headers from props
  const headersValue = getHeadersObject(new Headers())

  const limit = parseInt((props.searchParams['limit'] as string) ?? '10')
  const offset = parseInt((props.searchParams['offset'] as string) ?? '0')
  const orderBy = (props.searchParams['orderBy'] as string) ?? undefined
  const orderType = (props.searchParams['orderType'] as 'asc' | 'desc') ?? undefined

  const { context: authContext } = createAuth(props.serverConfig.auth, props.serverConfig.context)
  const context = Context.toRequestContext(authContext, headersValue)

  const result = await collection.admin.api.findMany({
    context,
    slug: props.slug,
    fields: collection.fields,
    limit,
    offset,
    orderBy,
    orderType,
  })

  const clientCollection = getClientCollection(collection)

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
              {formatSlug(collection.slug)}
            </Typography>
            <Typography type="h4" weight="normal" className="text-text-body">
              A collection
            </Typography>
          </div>
        </div>
      </div>
      <div className="p-12">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-y-12">
          <ListTable collection={clientCollection} data={result.data} />
        </div>
      </div>
    </div>
  )
}
