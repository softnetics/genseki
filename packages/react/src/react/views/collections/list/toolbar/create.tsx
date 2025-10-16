import React from 'react'

import { Button } from '@genseki/react/v2'

export interface MinimalCollectionListCreateProps {
  isLoading?: boolean
  slug: string
}

export interface CollectionListCreateProps
  extends MinimalCollectionListCreateProps,
    Partial<React.ComponentPropsWithRef<typeof Button>> {}

export function CollectionListCreate({ slug, ...props }: CollectionListCreateProps) {
  return (
    <Button asChild {...props}>
      <a href={`./${slug}/create`}>Create</a>
    </Button>
  )
}
