import { CubeIcon } from '@phosphor-icons/react'

import {
  CollectionCard,
  CollectionCardButton,
  CollectionCardDescription,
  CollectionCardHeader,
  CollectionCardIcon,
  CollectionCardTitle,
  Typography,
} from '@genseki/react/v2'

export function CollectionCardSection() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <CollectionCard>
        <CollectionCardIcon icon={CubeIcon} />
        <CollectionCardHeader>
          <CollectionCardTitle>
            <Typography type="h4" weight="semibold">
              Collection 1
            </Typography>
          </CollectionCardTitle>
        </CollectionCardHeader>
        <CollectionCardDescription>
          <Typography type="body" weight="normal" className="line-clamp-3">
            Lorem ipsum dolor s
          </Typography>
        </CollectionCardDescription>
        <CollectionCardButton onClick={() => {}}>
          <Typography type="body" weight="normal">
            View collection
          </Typography>
        </CollectionCardButton>
      </CollectionCard>

      <CollectionCard>
        <CollectionCardIcon icon={CubeIcon} />
        <CollectionCardHeader>
          <CollectionCardTitle>
            <Typography type="h4" weight="semibold">
              Collection 1
            </Typography>
          </CollectionCardTitle>
        </CollectionCardHeader>
        <CollectionCardDescription>
          <Typography type="body" weight="normal" className="line-clamp-3">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum
            dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet
            consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing
            elit. Quisquam, quos.
          </Typography>
        </CollectionCardDescription>
        <CollectionCardButton onClick={() => {}}>
          <Typography type="body" weight="normal">
            View collection
          </Typography>
        </CollectionCardButton>
      </CollectionCard>
    </div>
  )
}
