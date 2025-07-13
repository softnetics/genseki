import { CreateClientView } from './create.client'
import { CollectionFormLayout } from './layouts/collection-form-layout'
import type { BaseViewProps } from './types'

import { getFieldsClient } from '../../../core'
import { createOptionsRecord } from '../../components/compound/auto-field'
import { Typography } from '../../components/primitives/typography'
import { getHeadersObject } from '../../utils/headers'

interface CreateViewProps extends BaseViewProps {
  slug: string
  headers: Headers
}

export async function CreateView(props: CreateViewProps) {
  const headersValue = getHeadersObject(props.headers)
  // TODO: Fix this dummy request
  const request = new Request('', {
    method: 'GET',
    headers: headersValue,
  })
  const context = props.context.toRequestContext(request)
  const fieldsClient = getFieldsClient(props.collectionOptions.fields)
  const optionsRecord = await createOptionsRecord(context, props.collectionOptions.fields)

  return (
    <CollectionFormLayout size="md">
      <Typography type="h2" weight="semibold">
        Create new {props.slug}
      </Typography>
      <CreateClientView slug={props.slug} fields={fieldsClient} optionsRecord={optionsRecord} />
    </CollectionFormLayout>
  )
}
