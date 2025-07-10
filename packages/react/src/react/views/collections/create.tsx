import { CreateClientView } from './create.client'
import { CollectionFormLayout } from './layouts/collection-form-layout'
import type { BaseViewProps } from './types'

import { createOptionsRecord } from '../../components/compound/auto-field'
import { Typography } from '../../components/primitives/typography'
import { getHeadersObject } from '../../utils/headers'

interface CreateViewProps extends BaseViewProps {
  slug: string
  headers: Headers
}

export async function CreateView(props: CreateViewProps) {
  const headersValue = getHeadersObject(props.headers)
  const context = props.context.toRequestContext({
    headers: headersValue,
  })

  const optionsRecord = await createOptionsRecord(context, props.collectionOptions.fields)

  return (
    <CollectionFormLayout size="md">
      <Typography type="h2" weight="semibold">
        Create new {props.slug}
      </Typography>
      <CreateClientView slug={props.slug} optionsRecord={optionsRecord} />
    </CollectionFormLayout>
  )
}
