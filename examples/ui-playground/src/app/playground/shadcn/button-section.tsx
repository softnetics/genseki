import React from 'react'

import {
  ArrowsInLineVerticalIcon,
  CaretDownIcon,
  CaretLeftIcon,
  CaretRightIcon,
  CaretUpIcon,
  DownloadIcon,
  GridFourIcon,
  ListIcon,
  MagnifyingGlassIcon,
  PaperPlaneRightIcon,
  SortAscendingIcon,
  SortDescendingIcon,
} from '@phosphor-icons/react'

import {
  Button,
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  Typography,
} from '@genseki/react'

import { PlaygroundCard } from '~/src/components/card'

// Basic Button Variants
function ButtonVariants() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="tertiary">Tertiary</Button>
        <Button variant="naked">Naked</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="link">Link</Button>
      </div>
      <div className="flex flex-wrap gap-4">
        <Button disabled variant="primary">
          Primary
        </Button>
        <Button disabled variant="secondary">
          Secondary
        </Button>
        <Button disabled variant="tertiary">
          Tertiary
        </Button>
        <Button disabled variant="naked">
          Naked
        </Button>
        <Button disabled variant="outline">
          Outline
        </Button>
        <Button disabled variant="ghost">
          Ghost
        </Button>
        <Button disabled variant="destructive">
          Destructive
        </Button>
        <Button disabled variant="link">
          Link
        </Button>
      </div>
    </div>
  )
}

// Button Sizes
function ButtonSizes() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="sm">
        <MagnifyingGlassIcon />
        Small
      </Button>
      <Button size="default">
        <MagnifyingGlassIcon />
        Default
      </Button>
      <Button size="lg">
        <MagnifyingGlassIcon />
        Large
      </Button>
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
      <Button disabled={isPending} onClick={handleClick}>
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
    <Button disabled={isLoading} onClick={handleSubmit}>
      {isLoading ? 'Submitting...' : 'Submit Form'}
    </Button>
  )
}

// Button Group - Basic
function ButtonGroupBasic() {
  return (
    <ButtonGroup>
      <Button variant="outline">One</Button>
      <ButtonGroupSeparator />
      <Button variant="outline">Two</Button>
      <ButtonGroupSeparator />
      <Button variant="outline">Three</Button>
    </ButtonGroup>
  )
}

// Button Group - With Separators
function ButtonGroupWithSeparators() {
  return (
    <div className="space-y-4">
      <ButtonGroup>
        <Button variant="outline">
          <CaretLeftIcon />
          Previous
        </Button>
        <ButtonGroupSeparator />
        <Button variant="outline">
          Next
          <CaretRightIcon />
        </Button>
      </ButtonGroup>

      <ButtonGroup>
        <Button variant="outline">Sort</Button>
        <ButtonGroupSeparator />
        <Button variant="outline" size="icon">
          <SortAscendingIcon />
        </Button>
        <Button variant="outline" size="icon">
          <SortDescendingIcon />
        </Button>
      </ButtonGroup>
    </div>
  )
}

// Button Group - With Text
function ButtonGroupWithText() {
  return (
    <div className="space-y-4">
      <ButtonGroup>
        <ButtonGroupText>
          <MagnifyingGlassIcon />
          Search
        </ButtonGroupText>
        <ButtonGroupSeparator />
        <Button variant="outline">Filter</Button>
      </ButtonGroup>

      <ButtonGroup>
        <Button variant="outline">View</Button>
        <ButtonGroupSeparator />
        <ButtonGroupText>
          <GridFourIcon />
          Grid
        </ButtonGroupText>
        <ButtonGroupText>
          <ListIcon />
          List
        </ButtonGroupText>
      </ButtonGroup>
    </div>
  )
}

// Button Group - Vertical
function ButtonGroupVertical() {
  return (
    <ButtonGroup orientation="vertical">
      <Button variant="outline" className="flex justify-between ">
        <CaretUpIcon />
        Up
      </Button>
      <ButtonGroupSeparator orientation="horizontal" />
      <Button variant="outline" className="flex justify-end ">
        <ArrowsInLineVerticalIcon />
        Center
      </Button>
      <ButtonGroupSeparator orientation="horizontal" />
      <Button variant="outline" className="flex justify-between ">
        <CaretDownIcon />
        Down
      </Button>
    </ButtonGroup>
  )
}

// Button Group - Different Variants
function ButtonGroupVariants() {
  return (
    <div className="space-y-4">
      <ButtonGroup>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="naked">Naked</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
      </ButtonGroup>
    </div>
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

      <PlaygroundCard title="Button Group - Basic" categoryTitle="Composition">
        <Typography type="body" className="text-muted-foreground mb-4">
          A simple button group with connected buttons.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <ButtonGroupBasic />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Button Group - With Separators" categoryTitle="Composition">
        <Typography type="body" className="text-muted-foreground mb-4">
          Button groups with separators between buttons for visual distinction.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <ButtonGroupWithSeparators />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Button Group - With Text" categoryTitle="Composition">
        <Typography type="body" className="text-muted-foreground mb-4">
          Button groups with text labels and icons for better context.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <ButtonGroupWithText />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Button Group - Vertical" categoryTitle="Composition">
        <Typography type="body" className="text-muted-foreground mb-4">
          Vertical button groups for stacked layouts.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <ButtonGroupVertical />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Button Group - Variants" categoryTitle="Composition">
        <Typography type="body" className="text-muted-foreground mb-4">
          Button groups with different button variants mixed together.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <ButtonGroupVariants />
        </div>
      </PlaygroundCard>
    </div>
  )
}
