import type { ServerConfig } from '@kivotos/core'

import { CreateClientView } from './create.client'

import { createOptionsRecord } from '../../components/auto-field'
import { Typography } from '../../components/primitives/typography'

interface CreateViewProps<TServerConfig extends ServerConfig> {
  slug: string
  serverConfig: TServerConfig
}

export async function CreateView<TServerConfig extends ServerConfig>(
  props: CreateViewProps<TServerConfig>
) {
  const collection = props.serverConfig.collections[props.slug]

  if (!collection) throw new Error(`Collection ${props.slug} not found`)

  const optionsRecord = await createOptionsRecord(props.serverConfig, collection.fields)

  return (
    <div className="mx-auto flex max-w-md w-full flex-col gap-y-4 mt-24">
      <Typography type="h1" weight="semibold">
        Create new {props.slug}
      </Typography>
      <CreateClientView slug={props.slug} optionsRecord={optionsRecord} />
    </div>
  )
}
