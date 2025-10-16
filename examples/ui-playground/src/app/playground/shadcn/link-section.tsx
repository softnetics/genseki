import React from 'react'

import Link from 'next/link'

import { Typography } from '@genseki/react'
import { linkVariants } from '@genseki/react/v2'

import { PlaygroundCard } from '../../../components/card'

export const LinkSection = () => {
  return (
    <div className="grid gap-8">
      <PlaygroundCard title="Basic Link" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          A simple Link component examples
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg flex gap-x-2">
          <Link className={linkVariants({ variant: 'underline', size: 'sm' })} href=".">
            Link
          </Link>
          <Link className={linkVariants({ variant: 'plain', size: 'sm' })} href=".">
            Link
          </Link>
        </div>
      </PlaygroundCard>
    </div>
  )
}
