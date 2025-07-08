import { headers } from 'next/headers'

import { RootLayout } from '@genseki/next'
import { CollectionAppLayout, Context, createAuth, getClientCollection } from '@genseki/react'

import { Display } from './display'

import { serverConfig } from '../../../../../../drizzlify/config'
import { serverFunction } from '../../../_helper/server'

const collection = serverConfig.collections.foods

const getHeadersObject = (headers: Headers): Record<string, string> => {
  const headersRecord: Record<string, string> = {}
  headers.forEach((value, key) => {
    headersRecord[key] = value
  })
  return headersRecord
}

interface CustomFoodProps {
  searchParams: Promise<Record<string, string>>
}

const CustomFoodPage = async (props: CustomFoodProps) => {
  const { context: authContext } = createAuth(serverConfig.auth, serverConfig.context)

  const searchParams = await props.searchParams
  const nameQuery = searchParams['name']
  const isCookedQuery = JSON.parse(searchParams['isCooked'] ?? 'null') as boolean | null
  const cookingTypeQuery = searchParams['cookingType']

  const result = await collection.admin.endpoints.findMany.handler({
    context: Context.toRequestContext(authContext, getHeadersObject(await headers())),
    query: {
      limit: 10,
      offset: 0,
      orderBy: undefined,
      orderType: undefined,
      where: {
        name: nameQuery ? { $like: `%${nameQuery}%` } : '$isNotNull',
        isCooked: isCookedQuery !== null ? { $eq: isCookedQuery } : '$isNotNull',
        cookingTypes: cookingTypeQuery ? { $eq: cookingTypeQuery } : '$isNotNull',
      },
    },
  })

  return (
    <RootLayout serverConfig={serverConfig} serverFunction={serverFunction}>
      <CollectionAppLayout serverConfig={serverConfig}>
        <Display collection={getClientCollection(collection)} data={result.body.data} />
      </CollectionAppLayout>
    </RootLayout>
  )
}

export default CustomFoodPage
