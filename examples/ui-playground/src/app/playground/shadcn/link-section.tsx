import React from 'react'

import Link from 'next/link'

import { Typography } from '@genseki/react'

import { PlaygroundCard } from '../../../components/card'

export const LinkSection = () => {
  return (
    <div className="grid gap-8">
      <PlaygroundCard title="Basic Link" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          A simple Link component examples
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <Link
            className="text-sm font-medium text-primary underline-offset-4 hover:underline hover:border-0"
            href="."
          >
            Link
          </Link>
        </div>
      </PlaygroundCard>
    </div>
  )
}
