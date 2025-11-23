import React from 'react'

import { ArrowLeftIcon } from '@phosphor-icons/react/dist/ssr'

import { Link } from '../components'
import { BaseIcon } from '../components/primitives/base-icon'
import { Typography } from '../components/primitives/typography'

interface NotfoundPageProps {
  title?: string | React.ReactElement
  redirectSentence?: string
  redirectURL: string
  description?: string
}

export const NotfoundPage = ({
  redirectURL,
  redirectSentence = 'Back to home',
  title = 'Oops! 😵',
  description = 'The page is not found, please check the URL and try again.',
}: NotfoundPageProps) => {
  return (
    <div className="from-bg to-primary/10 grid h-dvh content-center justify-center bg-gradient-to-br from-50% px-20">
      <Typography
        style={{
          backgroundImage:
            'radial-gradient(circle, var(--color-brand) 2px,var(--color-brand) 2px,transparent 2px)',
          backgroundRepeat: 'repeat',
          backgroundSize: '4px 4px',
        }}
        type="h1"
        weight="bold"
        className="inline-block w-fit bg-clip-text text-transparent"
      >
        404
      </Typography>
      {typeof title === 'string' ? (
        <Typography weight="semibold" type="h4" className="text-text-primary mt-12 min-w-[120px]">
          {title}
        </Typography>
      ) : (
        title
      )}
      <Typography weight="normal" type="body" className="text-text-primary">
        {description}
      </Typography>
      <div className="bg-border mt-6 h-px w-full" />
      <Link intent="primary" href={redirectURL} className="mt-12 flex items-end gap-x-2">
        <BaseIcon size="sm" icon={ArrowLeftIcon} className="text-text-brand" weight="bold" />
        {redirectSentence}
      </Link>
    </div>
  )
}
