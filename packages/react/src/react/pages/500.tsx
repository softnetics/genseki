import { WarningDiamondIcon } from '@phosphor-icons/react/dist/ssr'

import { BaseIcon } from '../components/primitives/base-icon'
import { Typography } from '../components/primitives/typography'

export const ServerErrorPage = () => {
  return (
    <div className="from-bg to-primary/10 grid h-[calc(100svh-76px-10px)] content-center justify-center bg-gradient-to-br from-50% px-20">
      <div className="flex items-center gap-x-2">
        <Typography type="h1" weight="bold" className="text-text-brand">
          500
        </Typography>
      </div>
      <div className="mt-12 flex items-center justify-start gap-x-2">
        <Typography weight="semibold" type="h4" className="text-text-primary">
          Server Error
        </Typography>
        <BaseIcon
          icon={WarningDiamondIcon}
          className="text-text-primary"
          size="md"
          weight="duotone"
        />
      </div>
      <Typography weight="normal" type="body" className="text-text-primary">
        An error occurred while loading the page. Please try again later.
      </Typography>
    </div>
  )
}
