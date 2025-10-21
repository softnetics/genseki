import React from 'react'

import {
  AlignCenterHorizontalSimpleIcon,
  AlignLeftSimpleIcon,
  AlignRightSimpleIcon,
  BookmarkIcon,
  ColumnsIcon,
  GridFourIcon,
  HeartIcon,
  ListBulletsIcon,
  ListIcon,
  ListNumbersIcon,
  StarIcon,
  TextBolderIcon,
  TextItalicIcon,
  TextUnderlineIcon,
} from '@phosphor-icons/react'

import { ToggleGroup, ToggleGroupItem, Typography } from '@genseki/react/v2'

import { PlaygroundCard } from '~/src/components/card'

// Basic Toggle Group - Single Selection
function BasicToggleGroup() {
  const [value, setValue] = React.useState('left')

  return (
    <div className="flex flex-wrap gap-4">
      <ToggleGroup type="single" value={value} onValueChange={setValue}>
        <ToggleGroupItem value="left">Left</ToggleGroupItem>
        <ToggleGroupItem value="center">Center</ToggleGroupItem>
        <ToggleGroupItem value="right">Right</ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}

// Toggle Group - Multiple Selection
function MultipleToggleGroup() {
  const [value, setValue] = React.useState<string[]>([])

  return (
    <div className="flex flex-wrap gap-4">
      <ToggleGroup type="multiple" value={value} onValueChange={setValue}>
        <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
        <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
        <ToggleGroupItem value="underline">Underline</ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}

// Toggle Group Variants
function ToggleGroupVariants() {
  const [defaultValue, setDefaultValue] = React.useState('option1')
  const [outlineValue, setOutlineValue] = React.useState('option1')

  return (
    <div className="flex flex-wrap gap-4">
      <ToggleGroup
        type="single"
        value={defaultValue}
        onValueChange={setDefaultValue}
        variant="default"
      >
        <ToggleGroupItem value="option1">Option 1</ToggleGroupItem>
        <ToggleGroupItem value="option2">Option 2</ToggleGroupItem>
        <ToggleGroupItem value="option3">Option 3</ToggleGroupItem>
      </ToggleGroup>

      <ToggleGroup
        type="single"
        value={outlineValue}
        onValueChange={setOutlineValue}
        variant="outline"
      >
        <ToggleGroupItem value="option1">Option 1</ToggleGroupItem>
        <ToggleGroupItem value="option2">Option 2</ToggleGroupItem>
        <ToggleGroupItem value="option3">Option 3</ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}

// Toggle Group Sizes
function ToggleGroupSizes() {
  const [smValue, setSmValue] = React.useState('small')
  const [defaultValue, setDefaultValue] = React.useState('default')
  const [lgValue, setLgValue] = React.useState('large')

  return (
    <div className="flex flex-wrap items-center gap-4">
      <ToggleGroup type="single" value={smValue} onValueChange={setSmValue} size="sm">
        <ToggleGroupItem value="small">Small</ToggleGroupItem>
        <ToggleGroupItem value="medium">Medium</ToggleGroupItem>
      </ToggleGroup>

      <ToggleGroup type="single" value={defaultValue} onValueChange={setDefaultValue} size="md">
        <ToggleGroupItem value="default">Default</ToggleGroupItem>
        <ToggleGroupItem value="large">Large</ToggleGroupItem>
      </ToggleGroup>

      <ToggleGroup type="single" value={lgValue} onValueChange={setLgValue} size="lg">
        <ToggleGroupItem value="large">Large</ToggleGroupItem>
        <ToggleGroupItem value="extra">Extra</ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}

// Toggle Group with Icons
function ToggleGroupWithIcons() {
  const [value, setValue] = React.useState<string[]>([])

  return (
    <div className="flex flex-wrap gap-4">
      <ToggleGroup type="multiple" value={value} onValueChange={setValue}>
        <ToggleGroupItem value="bold" size="md">
          <TextBolderIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" size="md">
          <TextItalicIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" size="md">
          <TextUnderlineIcon />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}

// Text Formatting Toolbar
function TextFormattingToolbar() {
  const [formats, setFormats] = React.useState<string[]>([])

  return (
    <div className="space-y-4">
      <ToggleGroup type="multiple" value={formats} onValueChange={setFormats} variant="outline">
        <ToggleGroupItem value="bold">
          <TextBolderIcon />
          Bold
        </ToggleGroupItem>
        <ToggleGroupItem value="italic">
          <TextItalicIcon />
          Italic
        </ToggleGroupItem>
        <ToggleGroupItem value="underline">
          <TextUnderlineIcon />
          Underline
        </ToggleGroupItem>
      </ToggleGroup>
      <div className="rounded-md border p-4">
        <p
          className={`text-sm ${formats.includes('bold') ? 'font-bold' : ''} ${formats.includes('italic') ? 'italic' : ''} ${formats.includes('underline') ? 'underline' : ''}`}
        >
          This text will change based on the selected formatting options.
        </p>
      </div>
    </div>
  )
}

// List Type Selector
function ListTypeSelector() {
  const [listType, setListType] = React.useState('bullet')

  return (
    <div className="space-y-4">
      <ToggleGroup type="single" value={listType} onValueChange={setListType}>
        <ToggleGroupItem value="bullet">
          <ListBulletsIcon />
          Bullet List
        </ToggleGroupItem>
        <ToggleGroupItem value="numbered">
          <ListNumbersIcon />
          Numbered List
        </ToggleGroupItem>
      </ToggleGroup>
      <div className="rounded-md border p-4">
        <p className="text-sm">
          Selected list type: {listType === 'bullet' ? 'Bullet List' : 'Numbered List'}
        </p>
      </div>
    </div>
  )
}

// Text Alignment
function TextAlignment() {
  const [alignment, setAlignment] = React.useState('left')

  return (
    <div className="space-y-4">
      <ToggleGroup type="single" value={alignment} onValueChange={setAlignment}>
        <ToggleGroupItem value="left">
          <AlignLeftSimpleIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="center">
          <AlignCenterHorizontalSimpleIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="right">
          <AlignRightSimpleIcon />
        </ToggleGroupItem>
      </ToggleGroup>
      <div className="rounded-md border p-4">
        <p className={`text-sm text-${alignment}`}>This text is aligned {alignment}.</p>
      </div>
    </div>
  )
}

// View Mode Selector
function ViewModeSelector() {
  const [viewMode, setViewMode] = React.useState('grid')

  return (
    <div className="space-y-4">
      <ToggleGroup type="single" value={viewMode} onValueChange={setViewMode} variant="outline">
        <ToggleGroupItem value="grid">
          <GridFourIcon />
          Grid
        </ToggleGroupItem>
        <ToggleGroupItem value="list">
          <ListIcon />
          List
        </ToggleGroupItem>
        <ToggleGroupItem value="columns">
          <ColumnsIcon />
          Columns
        </ToggleGroupItem>
      </ToggleGroup>
      <div className="rounded-md border p-4">
        <p className="text-sm">Current view mode: {viewMode}</p>
      </div>
    </div>
  )
}

// Filter Tags
function FilterTags() {
  const [selectedFilters, setSelectedFilters] = React.useState<string[]>(['featured'])

  return (
    <div className="space-y-4">
      <ToggleGroup type="multiple" value={selectedFilters} onValueChange={setSelectedFilters}>
        <ToggleGroupItem value="featured">
          <StarIcon />
          Featured
        </ToggleGroupItem>
        <ToggleGroupItem value="favorite">
          <HeartIcon />
          Favorite
        </ToggleGroupItem>
        <ToggleGroupItem value="bookmarked">
          <BookmarkIcon />
          Bookmarked
        </ToggleGroupItem>
      </ToggleGroup>
      <div className="rounded-md border p-4">
        <p className="text-sm">
          Active filters: {selectedFilters.length > 0 ? selectedFilters.join(', ') : 'None'}
        </p>
      </div>
    </div>
  )
}

// Disabled States
function DisabledStates() {
  const [value, setValue] = React.useState('option2')

  return (
    <div className="flex flex-wrap gap-4">
      <ToggleGroup type="single" value={value} onValueChange={setValue}>
        <ToggleGroupItem value="option1">Option 1</ToggleGroupItem>
        <ToggleGroupItem value="option2">Option 2</ToggleGroupItem>
        <ToggleGroupItem value="option3" disabled>
          Disabled
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}

export function ToggleGroupSection() {
  return (
    <div className="grid gap-8">
      <PlaygroundCard title="Basic Toggle Group - Single Selection" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          A toggle group that allows only one item to be selected at a time.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <BasicToggleGroup />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Toggle Group - Multiple Selection" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          A toggle group that allows multiple items to be selected simultaneously.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <MultipleToggleGroup />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Toggle Group Variants" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          Toggle groups come in different visual variants.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <ToggleGroupVariants />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Toggle Group Sizes" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          Toggle groups are available in three sizes: small, default, and large.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <ToggleGroupSizes />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Toggle Group with Icons" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          Icon-only toggle groups for compact interfaces.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <ToggleGroupWithIcons />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Text Formatting Toolbar" categoryTitle="Use Case">
        <Typography type="body" className="text-muted-foreground mb-4">
          A practical example of using toggle groups for text formatting controls.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <TextFormattingToolbar />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="List Type Selector" categoryTitle="Use Case">
        <Typography type="body" className="text-muted-foreground mb-4">
          A toggle group for selecting between different list types.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <ListTypeSelector />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Text Alignment" categoryTitle="Use Case">
        <Typography type="body" className="text-muted-foreground mb-4">
          A toggle group for text alignment controls with visual feedback.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <TextAlignment />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="View Mode Selector" categoryTitle="Use Case">
        <Typography type="body" className="text-muted-foreground mb-4">
          A toggle group for switching between different view modes.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <ViewModeSelector />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Filter Tags" categoryTitle="Use Case">
        <Typography type="body" className="text-muted-foreground mb-4">
          A toggle group for applying multiple filters with tags.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <FilterTags />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Disabled States" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          Toggle groups support disabled states for individual items.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <DisabledStates />
        </div>
      </PlaygroundCard>
    </div>
  )
}
