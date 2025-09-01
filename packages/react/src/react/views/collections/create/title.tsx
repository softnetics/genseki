import { Typography } from '../../../components/primitives/typography'
import { useCollection } from '../context'

export interface CollectionCreateTitleProps {
  slug?: string
}
export function CreateTitle({ slug }: CollectionCreateTitleProps) {
  const context = useCollection()

  return (
    <Typography type="h2" weight="semibold">
      Create new {slug ?? context.slug}
    </Typography>
  )
}
