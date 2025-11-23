/**
 * @description Home page tends to be a collection of links to other `collections page`
 */

import { type GensekiUiCommonProps } from '../../../core/ui'
import { CollectionCard } from '../../components/compound/collection-card'
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

type Props = GensekiUiCommonProps['COLLECTIONS_HOME']
interface HomeViewProps extends Props {}

export function HomeView(props: HomeViewProps) {
  return (
    <div>
      <div className="relative min-h-[240px] w-full px-12 pt-24 [background-image:radial-gradient(100%_100%_at_10%_-30%,--alpha(var(--color-primary)/15%),var(--color-secondary))]">
        <div className="mx-auto flex w-full max-w-[800px] flex-col">
          <Typography type="h2" weight="bold" className="text-text-primary">
            {greeting()}
          </Typography>
          <Typography type="h4" weight="normal" className="text-text-primary">
            Welcome to your collections
          </Typography>
          <Typography type="body" weight="normal" className="text-text-secondary mt-4">
            Select a collection below to view and manage your data.
          </Typography>
        </div>
      </div>
      <div className="px-12">
        <div className="mx-auto grid max-w-[800px] translate-y-[calc(var(--spacing)*-24)] gap-12 sm:grid-cols-2">
          {props.cards.map((collection) => (
            <CollectionCard
              key={collection.path}
              collectionName={collection.name}
              amounts={42}
              description="Manage your product catalog including inventory, pricing, and categories."
              url={collection.path}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
