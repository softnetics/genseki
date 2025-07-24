import { CollectionFormLayout } from './layouts/collection-form-layout'
import type { BaseViewProps } from './types'
import { UpdateClientView } from './update.client'

import { type Fields, getFieldsClient } from '../../../core'
import type { CollectionDefaultAdminApiRouter } from '../../../core/builder.utils'
import { createOptionsRecord } from '../../components/compound/auto-field'
import { Typography } from '../../components/primitives/typography'
import { getHeadersObject } from '../../utils/headers'

interface UpdateViewProps extends BaseViewProps {
  slug: string
  headers: Headers
  identifier: string
  findOne: CollectionDefaultAdminApiRouter<string, Fields>['findOne']
}

export async function UpdateView(props: UpdateViewProps) {
  const headersValue = getHeadersObject(props.headers)

  const request = new Request('http://localhost', {
    method: 'GET',
    headers: headersValue,
  })
  const response = new Response(null, {
    headers: { 'Content-Type': 'application/json' },
  })

  const context = props.context.toRequestContext(request)

  const result = await props.findOne.handler(
    { pathParams: { id: props.identifier } },
    { request, response }
  )

  const optionsRecord = await createOptionsRecord(context, props.collectionOptions.fields)
  const fieldsClient = getFieldsClient(props.collectionOptions.fields)

  return (
    <CollectionFormLayout>
      <Typography type="h2" weight="semibold">
        Update {props.slug}
      </Typography>
      <UpdateClientView
        fields={fieldsClient}
        identifer={props.identifier}
        slug={props.slug}
        defaultValues={result.body}
        optionsRecord={optionsRecord}
      />
    </CollectionFormLayout>
  )
}
