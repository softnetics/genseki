import { ServerConfig } from '@repo/drizzlify'
import { getClientCollection } from '@repo/drizzlify'

import { ListTable } from './list.client'

import { ButtonLink } from '../../intentui/ui/button'
import { formatSlug } from '../../utils/format-slug'

interface ListViewProps<TServerConfig extends ServerConfig> {
  slug: string
  serverConfig: TServerConfig
  searchParams: Record<string, string | string[]>
}

export async function ListView<TServerConfig extends ServerConfig>(
  props: ListViewProps<TServerConfig>
) {
  const collection = props.serverConfig.collections.find(
    (collection) => collection.slug === props.slug
  )
  if (!collection) throw new Error(`Collection ${props.slug} not found`)

  const limit = parseInt((props.searchParams['limit'] as string) ?? '10')
  const offset = parseInt((props.searchParams['offset'] as string) ?? '0')
  const orderBy = (props.searchParams['orderBy'] as string) ?? undefined
  const orderType = (props.searchParams['orderType'] as 'asc' | 'desc') ?? undefined

  const result = await collection.admin.api.findMany({
    context: props.serverConfig.context,
    slug: props.slug,
    fields: collection.fields,
    limit,
    offset,
    orderBy,
    orderType,
  })

  const clientCollection = getClientCollection(collection)

  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex justify-between gap-x-3">
        <h1 className="font-semibold text-2xl">{formatSlug(collection.slug)}</h1>
        <ButtonLink
          size="medium"
          intent="secondary"
          href={`/admin/collections/${collection.slug}/create`}
        >
          Create
        </ButtonLink>
      </div>
      <ListTable collection={clientCollection} data={result.data} />
    </div>
  )
}
