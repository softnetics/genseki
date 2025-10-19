import React from 'react'

import {
  AlignCenterHorizontalSimpleIcon,
  AlignLeftSimpleIcon,
  AlignRightSimpleIcon,
  BookmarkIcon,
  HeartIcon,
  ListBulletsIcon,
  ListNumbersIcon,
  StarIcon,
  TextBolderIcon,
  TextItalicIcon,
  TextUnderlineIcon,
} from '@phosphor-icons/react'

import { Typography } from '@genseki/react'
import { Toggle } from '@genseki/react/v2'

import { PlaygroundCard } from '~/src/components/card'

// Basic Toggle
function BasicToggle() {
  const [isPressed, setIsPressed] = React.useState(false)

  return (
    <div className="flex flex-wrap gap-4">
      <Toggle pressed={isPressed} onPressedChange={setIsPressed}>
        Toggle me
      </Toggle>
      <Toggle pressed={false} disabled>
        Disabled
      </Toggle>
    </div>
  )
}

// Toggle Variants
function ToggleVariants() {
  const [defaultPressed, setDefaultPressed] = React.useState(false)
  const [outlinePressed, setOutlinePressed] = React.useState(false)

  return (
    <div className="flex flex-wrap gap-4">
      <Toggle pressed={defaultPressed} onPressedChange={setDefaultPressed} variant="default">
        Default
      </Toggle>
      <Toggle pressed={outlinePressed} onPressedChange={setOutlinePressed} variant="outline">
        Outline
      </Toggle>
    </div>
  )
}

// Toggle Sizes
function ToggleSizes() {
  const [smPressed, setSmPressed] = React.useState(false)
  const [defaultPressed, setDefaultPressed] = React.useState(false)
  const [lgPressed, setLgPressed] = React.useState(false)

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Toggle pressed={smPressed} onPressedChange={setSmPressed} size="sm">
        Small
      </Toggle>
      <Toggle pressed={defaultPressed} onPressedChange={setDefaultPressed} size="default">
        Default
      </Toggle>
      <Toggle pressed={lgPressed} onPressedChange={setLgPressed} size="lg">
        Large
      </Toggle>
    </div>
  )
}

// Toggle with Icons
function ToggleWithIcons() {
  const [boldPressed, setBoldPressed] = React.useState(false)
  const [italicPressed, setItalicPressed] = React.useState(false)
  const [underlinePressed, setUnderlinePressed] = React.useState(false)

  return (
    <div className="flex flex-wrap gap-4">
      <Toggle pressed={boldPressed} onPressedChange={setBoldPressed} size="default">
        <TextBolderIcon />
      </Toggle>
      <Toggle pressed={italicPressed} onPressedChange={setItalicPressed} size="default">
        <TextItalicIcon />
      </Toggle>
      <Toggle pressed={underlinePressed} onPressedChange={setUnderlinePressed} size="default">
        <TextUnderlineIcon />
      </Toggle>
    </div>
  )
}

// Toggle with Icons and Text
function ToggleWithIconsAndText() {
  const [listPressed, setListPressed] = React.useState(false)
  const [numbersPressed, setNumbersPressed] = React.useState(false)

  return (
    <div className="flex flex-wrap gap-4">
      <Toggle pressed={listPressed} onPressedChange={setListPressed}>
        <ListBulletsIcon />
        Bullet List
      </Toggle>
      <Toggle pressed={numbersPressed} onPressedChange={setNumbersPressed}>
        <ListNumbersIcon />
        Numbered List
      </Toggle>
    </div>
  )
}

// Text Formatting Example
function TextFormattingExample() {
  const [boldPressed, setBoldPressed] = React.useState(false)
  const [italicPressed, setItalicPressed] = React.useState(false)
  const [underlinePressed, setUnderlinePressed] = React.useState(false)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Toggle
          pressed={boldPressed}
          onPressedChange={setBoldPressed}
          size="default"
          variant="outline"
        >
          <TextBolderIcon />
        </Toggle>
        <Toggle
          pressed={italicPressed}
          onPressedChange={setItalicPressed}
          size="default"
          variant="outline"
        >
          <TextItalicIcon />
        </Toggle>
        <Toggle
          pressed={underlinePressed}
          onPressedChange={setUnderlinePressed}
          size="default"
          variant="outline"
        >
          <TextUnderlineIcon />
        </Toggle>
      </div>
      <div className="rounded-md border p-4">
        <p
          className={`text-sm ${boldPressed ? 'font-bold' : ''} ${italicPressed ? 'italic' : ''} ${underlinePressed ? 'underline' : ''}`}
        >
          This text will change based on the selected formatting options.
        </p>
      </div>
    </div>
  )
}

// Alignment Controls
function AlignmentControls() {
  const [alignment, setAlignment] = React.useState<'left' | 'center' | 'right'>('left')

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Toggle
          pressed={alignment === 'left'}
          onPressedChange={(pressed) => pressed && setAlignment('left')}
          size="default"
          variant="outline"
        >
          <AlignLeftSimpleIcon />
        </Toggle>
        <Toggle
          pressed={alignment === 'center'}
          onPressedChange={(pressed) => pressed && setAlignment('center')}
          size="default"
          variant="outline"
        >
          <AlignCenterHorizontalSimpleIcon />
        </Toggle>
        <Toggle
          pressed={alignment === 'right'}
          onPressedChange={(pressed) => pressed && setAlignment('right')}
          size="default"
          variant="outline"
        >
          <AlignRightSimpleIcon />
        </Toggle>
      </div>
      <div className="rounded-md border p-4">
        <p className={`text-sm text-${alignment}`}>This text is aligned {alignment}.</p>
      </div>
    </div>
  )
}

// Favorite Actions
function FavoriteActions() {
  const [favorites, setFavorites] = React.useState<Record<string, boolean>>({
    heart: false,
    star: false,
    bookmark: false,
  })

  const toggleFavorite = (key: string) => {
    setFavorites((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <Toggle
          pressed={favorites.heart}
          onPressedChange={() => toggleFavorite('heart')}
          size="default"
        >
          <HeartIcon />
        </Toggle>
        <Toggle
          pressed={favorites.star}
          onPressedChange={() => toggleFavorite('star')}
          size="default"
        >
          <StarIcon />
        </Toggle>
        <Toggle
          pressed={favorites.bookmark}
          onPressedChange={() => toggleFavorite('bookmark')}
          size="default"
        >
          <BookmarkIcon />
        </Toggle>
      </div>
      <div className="rounded-md border p-4">
        <p className="text-sm">
          Favorites:{' '}
          {Object.entries(favorites)
            .filter(([_, value]) => value)
            .map(([key]) => key)
            .join(', ') || 'None'}
        </p>
      </div>
    </div>
  )
}

export function ToggleSection() {
  return (
    <div className="grid gap-8">
      <PlaygroundCard title="Basic Toggle" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          A simple toggle button that can be pressed or unpressed.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <BasicToggle />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Toggle Variants" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          Toggle buttons come in different visual variants.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <ToggleVariants />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Toggle Sizes" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          Toggle buttons are available in three sizes: small, default, and large.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <ToggleSizes />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Toggle with Icons" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          Icon-only toggle buttons for compact interfaces.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <ToggleWithIcons />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Toggle with Icons and Text" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          Toggle buttons with both icons and text labels.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <ToggleWithIconsAndText />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Text Formatting Example" categoryTitle="Use Case">
        <Typography type="body" className="text-muted-foreground mb-4">
          A practical example of using toggles for text formatting controls.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <TextFormattingExample />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Alignment Controls" categoryTitle="Use Case">
        <Typography type="body" className="text-muted-foreground mb-4">
          Toggle buttons for text alignment controls with visual feedback.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <AlignmentControls />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Favorite Actions" categoryTitle="Use Case">
        <Typography type="body" className="text-muted-foreground mb-4">
          Independent toggle buttons for favorite/bookmark functionality.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <FavoriteActions />
        </div>
      </PlaygroundCard>
    </div>
  )
}
