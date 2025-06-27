import { headers } from 'next/headers'

import { RootLayout } from '@genseki/next'
import { CollectionAppLayout, Context, createAuth, getClientCollection } from '@genseki/react'

import { renderFoodsCells } from './cells'

import { serverConfig } from '../../../../../../drizzlify/config'
import { ListTable } from '../../../../../components/list.client'
import { serverFunction } from '../../../_helper/server'

const getHeadersObject = (headers: Headers): Record<string, string> => {
  const headersRecord: Record<string, string> = {}
  headers.forEach((value, key) => {
    headersRecord[key] = value
  })
  return headersRecord
}

const collection = serverConfig.collections['foods']

// eslint-disable-next-line react/display-name
export default async () => {
  const { context: authContext } = createAuth(serverConfig.auth, serverConfig.context)
  const result = await collection.admin.endpoints.findMany.handler({
    context: Context.toRequestContext(authContext, getHeadersObject(await headers())),
    query: {
      limit: 10,
      offset: 0,
      orderBy: undefined,
      orderType: undefined,
      where: undefined,
    },
  })

  return (
    <RootLayout serverConfig={serverConfig} serverFunction={serverFunction}>
      <CollectionAppLayout serverConfig={serverConfig}>
        <div className="p-16">
          <ListTable
            collection={getClientCollection(collection)}
            data={result.body.data}
            renderCellFns={renderFoodsCells}
          />
        </div>
      </CollectionAppLayout>
    </RootLayout>
  )
}
