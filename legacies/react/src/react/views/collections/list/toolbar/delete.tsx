'use client'
import type { ComponentPropsWithRef } from 'react'

import { TrashIcon } from '@phosphor-icons/react'
import type { Promisable } from 'type-fest'

import { Button } from '@genseki/react/v2'

export interface MinimalCollectionListDeleteProps {
  isLoading?: boolean
  onDelete?: () => Promisable<void>
}

export interface CollectionListDeleteProps
  extends MinimalCollectionListDeleteProps,
    Partial<ComponentPropsWithRef<typeof Button>> {}

export function CollectionListDelete(props: CollectionListDeleteProps) {
  return (
    <Button onClick={props.onDelete} disabled={props.isLoading} variant="destructive" {...props}>
      <TrashIcon />
      Delete
    </Button>
  )
}
