import type { BaseViewProps } from './types'

import type { CollectionDefaultAdminApiRouter } from '../../../core/builder.utils'
import type { Fields } from '../../../core/field'
import { getHeadersObject } from '../../utils/headers'

interface OneViewProps extends BaseViewProps {
  slug: string
  headers: Headers
  identifier: string
  findOne: CollectionDefaultAdminApiRouter<string, Fields>['findOne']
}

export async function OneView(props: OneViewProps) {
  const headersValue = getHeadersObject(props.headers)

  // TODO: Fix this dummy request
  const request = new Request('http://localhost', {
    method: 'GET',
    headers: headersValue,
  })
  const response = new Response(null, {
    headers: { 'Content-Type': 'application/json' },
  })

  const result = await props.findOne.handler(
    {
      pathParams: { id: props.identifier },
    },
    { request, response }
  )

  return <div>{JSON.stringify(result)}</div>
}
