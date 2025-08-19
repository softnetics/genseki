import { CubeIcon } from '@phosphor-icons/react/dist/ssr'

import { BaseIcon } from '../../../components/primitives/base-icon'
import { Typography } from '../../../components/primitives/typography'
import { Badge } from '../../../icons/badge'
import { formatSlug } from '../../../utils/format-slug'

interface BannerProps {
  slug: string
}

export const Banner = (props: BannerProps) => {
  return (
    <div className="w-full px-12 py-24 [background-image:radial-gradient(100%_100%_at_10%_-30%,--alpha(var(--color-primary)/15%),var(--color-secondary))]">
      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-[auto_1fr] gap-x-12">
        <div className="relative z-10 inline-block">
          <Badge
            width={75}
            height={75}
            className="relative z-10 dark:brightness-[40%] dark:contrast-150"
          />
          <BaseIcon
            icon={CubeIcon}
            size="xl"
            weight="duotone"
            className="absolute inset-0 z-20 m-auto"
          />
          <div className="absolute -inset-8 z-0 aspect-square [background-image:radial-gradient(circle,--alpha(var(--color-fg)/25%)_2px,--alpha(var(--color-fg)/25%)_2px,transparent_2px)] [background-repeat:repeat] [background-size:8px_8px] [mask-image:radial-gradient(circle,black,transparent_80%)]" />
        </div>
        <div className="flex flex-col">
          <Typography type="h2" weight="bold" className="text-text-nontrivial">
            {formatSlug(props.slug)}
          </Typography>
          <Typography type="h4" weight="normal" className="text-text-body">
            A collection
          </Typography>
        </div>
      </div>
    </div>
  )
}
