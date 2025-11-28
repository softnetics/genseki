import React from 'react'

import { Separator, Typography } from '@genseki/ui'

import { PlaygroundCard } from '~/src/components/card'

function BasicSeparatorExamples() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">Left content</span>
        <Separator className="flex-1" />
        <span className="text-sm text-muted-foreground">Right content</span>
      </div>
      <div className="flex h-24 items-center gap-4">
        <span className="text-sm text-muted-foreground">Top</span>
        <Separator orientation="vertical" className="h-full" />
        <span className="text-sm text-muted-foreground">Bottom</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">Left content</span>
        <Separator variant="dashed" className="flex-1" />
        <span className="text-sm text-muted-foreground">Right content</span>
      </div>
      <div className="flex h-24 items-center gap-4">
        <span className="text-sm text-muted-foreground">Top</span>
        <Separator variant="dashed" orientation="vertical" className="h-full" />
        <span className="text-sm text-muted-foreground">Bottom</span>
      </div>
    </div>
  )
}

export function SeparatorSection() {
  return (
    <div className="grid gap-8">
      <PlaygroundCard title="Separator" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          Visual dividers for grouping content horizontally or vertically.
        </Typography>
        <div className="p-4 bg-secondary w-full rounded-lg">
          <BasicSeparatorExamples />
        </div>
      </PlaygroundCard>
    </div>
  )
}
