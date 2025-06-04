import 'server-only'

/**
 * @description Home page tends to be a collection of links to other `collections page`
 */
import type { ServerConfig } from '@kivotos/core'

import { CollectionCard } from '../../components/collection-card'
import { Typography } from '../../components/primitives/typography'

const greeting = () => {
  const time = new Date().getHours()

  if (time < 12) {
    return 'Good morning 👋'
  }

  if (time < 18) {
    return 'Good afternoon 👋'
  }

  return 'Good evening 👋'
}

type HomepageProps = {
  serverConfig: ServerConfig
}

export const HomeView = ({ serverConfig }: HomepageProps) => {
  const collections = Object.values(serverConfig.collections).map((col) => col.slug)

  return (
    <div>
      <div className="relative min-h-[240px] w-full px-12 pt-24 [background-image:radial-gradient(100%_100%_at_10%_-30%,--alpha(var(--color-primary)/15%),var(--color-secondary))]">
        <div className="mx-auto flex w-full max-w-[800px] flex-col">
          <Typography type="h2" weight="bold" className="text-text-nontrivial">
            {greeting()}
          </Typography>
          <Typography type="h4" weight="normal" className="text-text-body">
            Welcome to your collections
          </Typography>
          <Typography type="body" weight="normal" className="text-text-trivial mt-4">
            Select a collection below to view and manage your data.
          </Typography>
        </div>
      </div>
      <div className="px-12">
        <div className="mx-auto grid max-w-[800px] translate-y-[calc(var(--spacing)*-24)] gap-12 sm:grid-cols-2">
          {collections.map((collection) => (
            <CollectionCard
              key={collection}
              collectionName={collection}
              amounts={42}
              description="Manage your product catalog including inventory, pricing, and categories."
              url={`/admin/collections/${collection}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
