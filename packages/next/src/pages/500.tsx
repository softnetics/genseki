import { WarningDiamond } from '@phosphor-icons/react/dist/ssr'

import BaseIcon from '~/components/primitives/base-icon'
import Typography from '~/components/primitives/typography'

const ServerErrorPage = () => {
  return (
    <div className="from-bg to-primary/10 grid h-[calc(100svh-76px-10px)] content-center justify-center bg-gradient-to-br from-50%">
      <div className="flex items-center gap-x-2">
        <Typography type="h1" weight="bold" className="text-text-accent">
          500
        </Typography>
      </div>
      <div className="mt-12 flex items-center justify-start gap-x-2">
        <Typography weight="semibold" type="h4" className="text-text-nontrivial">
          Server Error
        </Typography>
        <BaseIcon icon={WarningDiamond} className="text-text-body" size="md" weight="duotone" />
      </div>
      <Typography weight="normal" type="body" className="text-text-body">
        An error occurred while loading the page. Please try again later.
      </Typography>
    </div>
  )
}

export default ServerErrorPage
