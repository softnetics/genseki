import { CollectionFormLayout } from './layouts/collection-form-layout'
import { UpdateClientView } from './update.client'

import { Context, createAuth, type ServerConfig } from '../../../core'
import { createOptionsRecord } from '../../components/compound/auto-field'
import { Typography } from '../../components/primitives/typography'
import { getHeadersObject } from '../../utils/headers'

interface UpdateViewProps<TServerConfig extends ServerConfig> {
  slug: string
  headers: Headers
  identifier: string
  serverConfig: TServerConfig
}

export async function UpdateView<TServerConfig extends ServerConfig>(
  props: UpdateViewProps<TServerConfig>
) {
  const collection = props.serverConfig.collections[props.slug]
  if (!collection) throw new Error(`Collection ${props.slug} not found`)

  const headersValue = getHeadersObject(props.headers)
  const { context: authContext } = createAuth(props.serverConfig.auth, props.serverConfig.context)
  const context = Context.toRequestContext(authContext, headersValue)

  const result = await collection.admin.endpoints.findOne.handler({
    context,
    pathParams: {
      id: props.identifier,
    },
  })

  const optionsRecord = await createOptionsRecord(context, collection.fields)

  return (
    <CollectionFormLayout>
      <Typography type="h2" weight="semibold">
        Update {props.slug}
      </Typography>
      <UpdateClientView
        identifer={props.identifier}
        slug={props.slug}
        defaultValues={result.body}
        optionsRecord={optionsRecord}
      />
    </CollectionFormLayout>
  )
}
