import type { BaseViewProps } from './types'

import type {
  ApiDefaultMethod,
  ConvertCollectionDefaultApiToApiRouteSchema,
} from '../../../core/collection'
import type { ApiRoute } from '../../../core/endpoint'
import { getHeadersObject } from '../../utils/headers'

interface OneViewProps extends BaseViewProps {
  slug: string
  headers: Headers
  identifier: string
  findOne: ApiRoute<
    ConvertCollectionDefaultApiToApiRouteSchema<string, (typeof ApiDefaultMethod)['FIND_ONE'], any>
  >
}

export async function OneView(props: OneViewProps) {
  const headersValue = getHeadersObject(props.headers)

  // TODO: Fix this dummy request
  const request = new Request('http://localhost', {
    method: 'GET',
    headers: headersValue,
  })

  const result = await props.findOne.handler(
    {
      pathParams: { id: props.identifier },
    },
    request
  )

  return <div>{JSON.stringify(result)}</div>
}
