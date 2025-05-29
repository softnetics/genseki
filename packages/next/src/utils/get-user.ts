import { cache } from 'react'

import { headers } from 'next/headers'

import { getHeadersObject } from './headers'

import type { ServerFunction } from '../server-function'

// TODO: Add type for user
async function _getUser(serverFunction: ServerFunction): Promise<any | null> {
  const h = await headers()
  const reqHeaders = getHeadersObject(h)
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
