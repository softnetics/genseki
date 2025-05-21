import { Suspense } from 'react'

import type { ServerConfig } from '@kivotos/core'

import NotfoundPage from './404'
import HomePage from './home'
import LoadingPage from './loading'

import Typography from '../components/primitives/typography'
import { formatSlug } from '../utils/format-slug'
import { CreateView } from '../views/collections/create'
import { ListView } from '../views/collections/list'
import { OneView } from '../views/collections/one'
import { UpdateView } from '../views/collections/update'

interface RootProps {
  serverConfig: ServerConfig
  segments: string[]
  searchParams: Record<string, string | string[]>
  headers?: Headers
}

/**
 * Path Pattern
 * /                Home Page
 * /:slug           List Page
 * /:slug/create    Create Page
 * /:slug/:id       Read Item
 * /:slug/:id/edit  Update Item
 *
 * Fallback
 * 404                          Not Found
 * 400-599                      Server Error
 */
export async function RootCollectionPage(props: RootProps) {
  const { serverConfig, segments, searchParams } = props

  // No segment -> Home page
  if (segments.length === 0) {
    return <HomePage serverConfig={serverConfig} />
  }

  const slug = segments[0]

  const collection = serverConfig.collections.find((collection) => collection.slug === slug)

  // 404 Collection not found
  if (!collection)
    return (
      <NotfoundPage
        redirectSentence="Back to collections"
        description="The collection you are looking for does not exist. Please check the URL and try again."
        title={
          <div>
            <Typography
              weight="semibold"
              type="h4"
              className="text-text-nontrivial mt-12 min-w-[240px]"
            >
              Collection{' '}
              <span className="bg-muted text-muted-fg rounded-sm px-2">{formatSlug(slug)}</span> is
              not found
            </Typography>
          </div>
        }
        redirectURL="/admin/collections"
      />
    )

  // List Page    ——  /:slug
  if (segments.length === 1) {
    return (
      <Suspense fallback={<LoadingPage />}>
        <ListView slug={slug} serverConfig={serverConfig} searchParams={searchParams} />
      </Suspense>
    )
  }

  // Create Page   ——  /:slug/create
  if (segments[1] === 'create') {
    return <CreateView slug={slug} serverConfig={serverConfig} />
  }

  // Read Item     ——  /:slug/:id
  if (segments.length === 2) {
    const id = segments[1]
    return <OneView id={id} slug={slug} serverConfig={serverConfig} />
  }

  // Update Item   ——  /:slug/:id/edit
  if (segments[2] === 'edit') {
    const id = segments[1]
    return <UpdateView id={id} slug={slug} serverConfig={serverConfig} />
  }

  return <NotfoundPage redirectURL="/admin/collections" />
}
