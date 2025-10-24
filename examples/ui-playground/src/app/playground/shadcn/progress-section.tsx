'use client'
import { useState } from 'react'

import { Button, Progress, Typography } from '@genseki/react/v2'

import { PlaygroundCard } from '../../../components/card'

function DefaultProgress() {
  const [progress, setProgress] = useState(50)

  return (
    <div className="space-y-4">
      <Button
        onClick={() => {
          setProgress(Math.floor(Math.random() * 100))
        }}
      >
        Switch progress to {progress}
      </Button>
      <Progress value={progress} />
    </div>
  )
}

export function ProgressSection() {
  return (
    <div className="grid gap-8">
      <PlaygroundCard title="Default Progress" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          Basic progress bar
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <DefaultProgress />
        </div>
      </PlaygroundCard>
    </div>
  )
}
