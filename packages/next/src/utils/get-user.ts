import { cache } from 'react'

import type { ServerFunction } from '@genseki/react'

const getHeadersObject = (headers: Headers): Record<string, string> => {
  const headersRecord: Record<string, string> = {}
  headers.forEach((value, key) => {
    headersRecord[key] = value
  })
  return headersRecord
}

// TODO: Add type for user
async function _getUser(serverFunction: ServerFunction, headers: Headers): Promise<any | null> {
  const reqHeaders = getHeadersObject(headers)
  const response = await serverFunction({
    method: 'auth.me',
    headers: reqHeaders,
    body: {},
    pathParams: {},
    query: {},
  })

  if (response.status !== 200) {
    return null
  }

  const user = response.body
  return user
}

export const getUser = cache(_getUser)
