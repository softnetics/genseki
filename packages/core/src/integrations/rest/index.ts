import { ClientApiHandlers } from '~/core/client'
import { createClientApiHandlers } from '~/core/client'
import { Collection } from '~/core/collection'

type RestClientOptions<TCollections extends Collection[]> = {
  baseUrl: string
  collections: TCollections
}

type RestClient<TCollections extends Collection[]> = {
  [K in TCollections[number]['slug']]: ClientApiHandlers<Extract<TCollections[number], { slug: K }>>
}

export function createRestClient<const TCollections extends Collection[]>(
  options: RestClientOptions<TCollections>
): RestClient<TCollections> {
  const { baseUrl, collections } = options
  const client = Object.fromEntries(
    collections.map((collection) => {
      const value = createClientApiHandlers(baseUrl, collection)
      return [collection.slug, value]
    })
  )
  return client as unknown as RestClient<TCollections>
}
