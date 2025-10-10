import React from 'react'

import { DownloadIcon, MagnifyingGlassIcon, PaperPlaneRightIcon } from '@phosphor-icons/react'

import { Button, Typography } from '@genseki/react'

import { PlaygroundCard } from '~/src/components/card'

// Basic Button Variants
function ButtonVariants() {
  return (
    <div className="flex flex-wrap gap-4">
      <Button variant="default">Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  )
}

// Button Sizes
function ButtonSizes() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
    </div>
  )
}

// Icon Buttons
function IconButtons() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="icon-sm" variant="outline">
        <MagnifyingGlassIcon />
      </Button>
      <Button size="icon" variant="outline">
        <MagnifyingGlassIcon />
      </Button>
      <Button size="icon-lg" variant="outline">
        <MagnifyingGlassIcon />
      </Button>
    </div>
  )
}

// Buttons with Icons
function ButtonsWithIcons() {
  return (
    <div className="flex flex-wrap gap-4">
      <Button>
        <PaperPlaneRightIcon />
        Send Email
      </Button>
      <Button variant="outline">
        <DownloadIcon />
        Download
      </Button>
    </div>
  )
}

// Button States
function ButtonStates() {
  const [isPending, setIsPending] = React.useState(false)

  const handleClick = () => {
    setIsPending(true)
    setTimeout(() => {
      setIsPending(false)
    }, 2000)
  }

  return (
    <div className="flex flex-wrap gap-4">
      <Button disabled>Disabled</Button>
      <Button isPending={isPending} onClick={handleClick}>
        {isPending ? 'Loading...' : 'Click Me'}
      </Button>
    </div>
  )
}

// Loading Button Example
function LoadingButton() {
  const [isLoading, setIsLoading] = React.useState(false)

  const handleSubmit = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }

  return (
    <Button isPending={isLoading} onClick={handleSubmit}>
      {isLoading ? 'Submitting...' : 'Submit Form'}
    </Button>
  )
}

export function ButtonSection() {
  return (
    <div className="grid gap-8">
      <PlaygroundCard title="Button Variants" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          Different button variants with various styles and purposes.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <ButtonVariants />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Button Sizes" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          Buttons come in three sizes: small, default, and large.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <ButtonSizes />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Icon Buttons" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          Icon-only buttons in different sizes.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <IconButtons />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Buttons with Icons" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          Buttons with icons alongside text labels.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <ButtonsWithIcons />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Button States" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          Buttons can be disabled or show a pending/loading state.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <ButtonStates />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Loading Button" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          A button that shows loading state during async operations.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <LoadingButton />
        </div>
      </PlaygroundCard>
    </div>
  )
}
