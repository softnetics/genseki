import type { ComponentPropsWithoutRef } from 'react'

import { ButtonLink } from '../../../../components'

export interface MinimalCollectionListCreateProps {
  isLoading?: boolean
  slug: string
}

export interface CollectionListCreateProps
  extends MinimalCollectionListCreateProps,
    Partial<ComponentPropsWithoutRef<typeof ButtonLink>> {}

export function CollectionListCreate(props: CollectionListCreateProps) {
  return (
    <ButtonLink
      aria-label="Create"
      href={`./${props.slug}/create`}
      isPending={props.isLoading}
      {...props}
    >
      Create
    </ButtonLink>
  )
}
