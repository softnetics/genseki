import { ArrowRightIcon, LockKeyIcon } from '@phosphor-icons/react/dist/ssr'

import { AriaLink } from '../components'
import { BaseIcon } from '../components/primitives/base-icon'
import { Typography } from '../components/primitives/typography'

export const UnauthorizedPage = () => {
  return (
    <div className="from-bg to-primary/10 grid h-[calc(100svh-76px-10px)] content-center justify-center bg-gradient-to-br from-50% px-20">
      <div className="flex items-center gap-x-2">
        <Typography type="h1" weight="bold" className="text-text-brand">
          403
        </Typography>
      </div>
      <div className="mt-12 flex items-center justify-start gap-x-2">
        <Typography weight="semibold" type="h4" className="text-text-primary">
          Unauthorized
        </Typography>
        <BaseIcon icon={LockKeyIcon} className="text-text-primary" size="md" weight="duotone" />
      </div>
      <Typography weight="normal" type="body" className="text-text-primary">
        You are not authorized to access this page. Please check your permission and try again.
      </Typography>
      <div className="bg-border mt-6 h-px w-full" />
      <AriaLink intent="primary" href="/" className="mt-12 flex items-end gap-x-2">
        Back to home
        <BaseIcon size="sm" icon={ArrowRightIcon} className="text-text-brand" weight="bold" />
      </AriaLink>
    </div>
  )
}
