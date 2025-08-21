import { ButtonLink, type ButtonLinkProps } from '../../../../components'

export interface MinimalCollectionListCreateProps {
  isLoading?: boolean
  slug: string
}

export interface CollectionListCreateProps
  extends MinimalCollectionListCreateProps,
    Partial<ButtonLinkProps> {}

export function CollectionListCreate(props: CollectionListCreateProps) {
  return (
    <ButtonLink
      aria-label="Create"
      variant="primary"
      size="md"
      href={`./${props.slug}/create`}
      isPending={props.isLoading}
      {...props}
    >
      Create
    </ButtonLink>
  )
}
