import React from 'react'

import {
  InfoIcon,
  MagnifyingGlassIcon,
  PaperPlaneRightIcon,
  QuestionMarkIcon,
  WarningIcon,
} from '@phosphor-icons/react'

import { Button, Typography } from '@genseki/ui'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@genseki/ui'

import { PlaygroundCard } from '~/src/components/card'

// Basic Tooltip
function BasicTooltip() {
  return (
    <div className="flex flex-wrap gap-4">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover me</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>This is a basic tooltip</p>
        </TooltipContent>
      </Tooltip>
    </div>
  )
}

// Tooltip with Icon
function TooltipWithIcon() {
  return (
    <div className="flex flex-wrap gap-4">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon">
            <InfoIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Information tooltip</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon">
            <WarningIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Warning tooltip</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon">
            <QuestionMarkIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Help tooltip</p>
        </TooltipContent>
      </Tooltip>
    </div>
  )
}

// Tooltip Positions
function TooltipPositions() {
  return (
    <div className="grid grid-cols-2 gap-8">
      <div className="flex justify-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">Top</Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>Tooltip on top</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="flex justify-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">Bottom</Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Tooltip on bottom</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="flex justify-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">Left</Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Tooltip on left</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="flex justify-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">Right</Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Tooltip on right</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}

// Tooltip with Long Content
function TooltipLongContent() {
  return (
    <div className="flex flex-wrap gap-4">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">
            <PaperPlaneRightIcon />
            Send Email
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          Send this email to the recipient. This action cannot be undone.
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">
            <MagnifyingGlassIcon />
            Search
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Search through all your documents and files for specific content.</p>
        </TooltipContent>
      </Tooltip>
    </div>
  )
}

// Tooltip Alignment
function TooltipAlignment() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="flex justify-start">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">Start</Button>
          </TooltipTrigger>
          <TooltipContent side="top" align="start">
            <p>Aligned to start</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="flex justify-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">Center</Button>
          </TooltipTrigger>
          <TooltipContent side="top" align="center">
            <p>Aligned to center</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="flex justify-end">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">End</Button>
          </TooltipTrigger>
          <TooltipContent side="top" align="end">
            <p>Aligned to end</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}

// Disabled Tooltip
function DisabledTooltip() {
  return (
    <div className="flex flex-wrap gap-4">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" disabled>
            Disabled Button
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>This button is disabled</p>
        </TooltipContent>
      </Tooltip>

      <Button variant="outline" disabled>
        No Tooltip
      </Button>
    </div>
  )
}

export function TooltipSection() {
  return (
    <TooltipProvider>
      <div className="grid gap-8">
        <PlaygroundCard title="Basic Tooltip" categoryTitle="Component">
          <Typography type="body" className="text-muted-foreground mb-4">
            A simple tooltip that appears on hover.
          </Typography>
          <div className="p-4 bg-background w-full rounded-lg">
            <BasicTooltip />
          </div>
        </PlaygroundCard>

        <PlaygroundCard title="Tooltip with Icon" categoryTitle="Component">
          <Typography type="body" className="text-muted-foreground mb-4">
            Tooltips can be used with icon buttons to provide additional context.
          </Typography>
          <div className="p-4 bg-background w-full rounded-lg">
            <TooltipWithIcon />
          </div>
        </PlaygroundCard>

        <PlaygroundCard title="Tooltip Positions" categoryTitle="Component">
          <Typography type="body" className="text-muted-foreground mb-4">
            Tooltips can be positioned on any side of the trigger element.
          </Typography>
          <div className="p-4 bg-background w-full rounded-lg">
            <TooltipPositions />
          </div>
        </PlaygroundCard>

        <PlaygroundCard title="Tooltip with Long Content" categoryTitle="Component">
          <Typography type="body" className="text-muted-foreground mb-4">
            Tooltips can contain longer text content with proper wrapping.
          </Typography>
          <div className="p-4 bg-background w-full rounded-lg">
            <TooltipLongContent />
          </div>
        </PlaygroundCard>

        <PlaygroundCard title="Tooltip Alignment" categoryTitle="Component">
          <Typography type="body" className="text-muted-foreground mb-4">
            Control the alignment of tooltips relative to their trigger element.
          </Typography>
          <div className="p-4 bg-background w-full rounded-lg">
            <TooltipAlignment />
          </div>
        </PlaygroundCard>

        <PlaygroundCard title="Disabled Tooltip" categoryTitle="Component">
          <Typography type="body" className="text-muted-foreground mb-4">
            Tooltips work with disabled elements to provide helpful information.
          </Typography>
          <div className="p-4 bg-background w-full rounded-lg">
            <DisabledTooltip />
          </div>
        </PlaygroundCard>
      </div>
    </TooltipProvider>
  )
}
