import { CollectionFormLayout } from './layouts/collection-form-layout'
import type { BaseViewProps } from './types'
import { UpdateClientView } from './update.client'

import { getFieldsClient } from '../../../core'
import type {
  ApiDefaultMethod,
  ConvertCollectionDefaultApiToApiRouteSchema,
} from '../../../core/collection'
import type { ApiRoute } from '../../../core/endpoint'
import { createOptionsRecord } from '../../components/compound/auto-field'
import { Typography } from '../../components/primitives/typography'
import { getHeadersObject } from '../../utils/headers'

interface UpdateViewProps extends BaseViewProps {
  slug: string
  headers: Headers
  identifier: string
  findOne: ApiRoute<
    ConvertCollectionDefaultApiToApiRouteSchema<string, (typeof ApiDefaultMethod)['FIND_ONE'], any>
  >
}

export async function UpdateView(props: UpdateViewProps) {
  const headersValue = getHeadersObject(props.headers)

  // TODO: Make the right request
  const request = new Request('http://localhost', {
    method: 'GET',
    headers: headersValue,
  })

  const context = props.context.toRequestContext(request)

  const result = await props.findOne.handler(
    {
      pathParams: { id: props.identifier },
    },
    request
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
