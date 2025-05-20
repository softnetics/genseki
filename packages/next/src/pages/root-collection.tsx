import type { ServerConfig } from '@kivotos/core'

import { CreateView } from '../views/collections/create'
import { ListView } from '../views/collections/list'
import { OneView } from '../views/collections/one'
import { UpdateView } from '../views/collections/update'

interface RootProps {
  serverConfig: ServerConfig
  segments: string[]
  searchParams: Record<string, string | string[]>
  headers: Headers
}

/**
 * Path Pattern
 * /collections/:slug/:id       Read Page
 * /collections/:slug           List Page
 * /collections/:slug/create    Create Page
 * /collections/:slug/:id/edit  Edit Page
 *
 * Fallback
 * 404                          Not Found
 * 400-599                      Server Error
 */
export async function RootCollectionPage(props: RootProps) {
  const { serverConfig, segments, searchParams } = props

  const slug = segments[0]

  const collection = serverConfig.collections.find((collection) => collection.slug === slug)

  // TODO: 404
  if (!collection) throw new Error(`Collection ${slug} not found`)

  if (segments.length === 1) {
    return <ListView slug={slug} serverConfig={serverConfig} searchParams={searchParams} />
  }

  // Handle collection CRUD routes
  if (segments[1] === 'create' && segments.length === 2) {
    return <CreateView slug={slug} serverConfig={serverConfig} />
  }

  if (segments.length === 2) {
    const id = segments[1]
    return <OneView id={id} slug={slug} serverConfig={serverConfig} />
  }

  if (segments[2] === 'edit' && segments.length === 3) {
    const id = segments[1]
    return <UpdateView id={id} slug={slug} serverConfig={serverConfig} />
  }

  throw new Error(`Invalid path: ${segments.join('/')}`) // TODO: 404
}
