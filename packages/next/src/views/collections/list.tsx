import {
  CaretLeftIcon,
  CubeIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
} from '@phosphor-icons/react/dist/ssr'
import Image from 'next/image'

import { ServerConfig } from '@kivotos/core'
import { getClientCollection } from '@kivotos/core'

import badge from '~/../public/badge.svg'
import BaseIcon from '~/components/primitives/base-icon'
import Typography from '~/components/primitives/typography'
import { Button, ButtonLink } from '~/intentui/ui/button'
import { TextField } from '~/intentui/ui/text-field'

import { ListTable } from './list.client'

import { formatSlug } from '../../utils/format-slug'

interface ListViewProps {
  slug: string
  serverConfig: ServerConfig
  searchParams: Record<string, string | string[]>
}

const Toolbar = ({ slug }: { slug: string }) => {
  return (
    <div className="flex items-center justify-between gap-x-3">
      <ButtonLink
        href="."
        variant="ghost"
        size="md"
        leadingIcon={<BaseIcon icon={CaretLeftIcon} size="md" />}
      >
        Back
      </ButtonLink>
      <div className="flex items-center gap-x-4">
        <TextField
          placeholder="Search"
          prefix={<BaseIcon icon={MagnifyingGlassIcon} size="md" />}
          className="w-full"
        />
        <Button variant="outline" size="md" leadingIcon={<BaseIcon icon={FunnelIcon} size="md" />}>
          Filter
        </Button>
        <ButtonLink variant="primary" size="md" href={`/admin/collections/${slug}/create`}>
          Create
        </ButtonLink>
      </div>
    </div>
  )
}

export async function ListView(props: ListViewProps) {
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
    <div>
      <div className="w-full px-12 py-24 [background-image:radial-gradient(100%_100%_at_10%_-30%,--alpha(var(--color-primary)/15%),var(--color-secondary))]">
        <div className="mx-auto grid w-full max-w-[1200px] grid-cols-[auto_1fr] gap-x-12">
          <div className="relative z-10 inline-block">
            <Image
              priority
              src={badge}
              alt="badge"
              width={75}
              height={75}
              sizes="20px"
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
          <Toolbar slug={props.slug} />
          <ListTable collection={clientCollection} data={result.data} />
        </div>
      </div>
    </div>
  )
}
