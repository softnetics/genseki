import React, { startTransition, useState } from 'react'

import { type ColorLike } from 'color'

import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Typography,
  useColorPicker,
} from '@genseki/react/v2'
import {
  ColorPicker,
  ColorPickerAlpha,
  ColorPickerEyeDropper,
  ColorPickerFormat,
  ColorPickerHue,
  ColorPickerOutput,
  ColorPickerSelection,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@genseki/react/v2'

import { InformationCard, PlaygroundCard } from '~/src/components/card'

// Basic Color Picker
function BasicColorPicker() {
  const [color, setColor] = useState<ColorLike>([0, 0, 0, 1]) // RGBA - [r, g, b, alpha]

  return (
    <div className="flex flex-col gap-4">
      <ColorPicker
        value={color}
        onChange={(v) => {
          startTransition(() => setColor(v)) // This is a trick to optimize
        }}
        className="max-w-sm rounded-md border bg-background p-4 shadow-sm"
      >
        <ColorPickerSelection className="h-80" />
        <div className="flex items-center gap-4">
          <ColorPickerEyeDropper />
          <div className="grid w-full gap-1">
            <ColorPickerHue />
            <ColorPickerAlpha />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ColorPickerOutput />
          <ColorPickerFormat />
        </div>
      </ColorPicker>
      <Typography type="caption" className="text-muted-foreground">
        Selected color: rgba({color.toString()})
      </Typography>
    </div>
  )
}

function CustomSelector() {
  const { mode, setMode } = useColorPicker() // You can use `useColorPicker` under `ColorPicker`
  const formats = ['hex', 'rgb', 'css', 'hsl']

  return (
    <Select onValueChange={setMode} value={mode}>
      <SelectTrigger size="default" className="w-40 shrink-0">
        <SelectValue placeholder="Mode" asChild>
          <Typography className="text-xs">{mode.toUpperCase()}</Typography>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {formats.map((format) => (
          <SelectItem className="text-xs" key={format} value={format}>
            {format.toUpperCase()}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

// Compact Color Picker
function CompactColorPicker() {
  const [color, setColor] = React.useState<ColorLike>([255, 0, 0, 1])

  return (
    <div className="flex flex-col gap-4">
      <ColorPicker
        className="max-w-xs rounded-md border bg-background p-3 shadow-sm"
        value={color}
        onChange={(v) => {
          startTransition(() => setColor(v))
        }}
      >
        <ColorPickerSelection className="h-32" />
        <div className="flex items-center gap-3">
          <ColorPickerEyeDropper />
          <div className="grid w-full gap-1">
            <ColorPickerHue />
            <ColorPickerAlpha />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CustomSelector />
          <ColorPickerFormat />
        </div>
      </ColorPicker>
    </div>
  )
}

// Large Color Picker
function LargeColorPicker() {
  const [color, setColor] = React.useState<ColorLike>([255, 255, 0, 1])

  return (
    <div className="flex flex-col gap-4">
      <ColorPicker
        className="max-w-lg rounded-md border bg-background p-6 shadow-sm"
        value={color}
        onChange={(v) => {
          startTransition(() => setColor(v))
        }}
      >
        <ColorPickerSelection className="h-64" />
        <div className="flex items-center gap-4">
          <ColorPickerEyeDropper />
          <div className="grid w-full gap-1">
            <ColorPickerHue />
            <ColorPickerAlpha />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ColorPickerOutput />
          <ColorPickerFormat />
        </div>
      </ColorPicker>
    </div>
  )
}

// Color Picker with Preset Colors
function ColorPickerWithPresets() {
  const [color, setColor] = React.useState<ColorLike>([255, 0, 0, 1])

  const presets = [
    [255, 0, 0, 1], // Red
    [255, 255, 0, 1], // Yellow
    [0, 255, 0, 1], // Green
    [0, 255, 255, 1], // Cyan
    [0, 0, 255, 1], // Blue
    [255, 0, 255, 1], // Magenta
    [128, 128, 128, 1], // Gray
    [0, 0, 0, 1], // Black
  ]

  return (
    <div className="flex flex-col gap-4">
      <ColorPicker
        className="max-w-sm rounded-md border bg-background p-4 shadow-sm"
        value={color}
        onChange={(v) => {
          startTransition(() => setColor(v))
        }}
      >
        <ColorPickerSelection />
        <div className="flex items-center gap-4">
          <ColorPickerEyeDropper />
          <div className="grid w-full gap-1">
            <ColorPickerHue />
            <ColorPickerAlpha />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ColorPickerOutput />
          <ColorPickerFormat />
        </div>
      </ColorPicker>
      <div className="flex flex-col gap-2">
        <Typography type="caption" weight="medium">
          Preset Colors:
        </Typography>
        <div className="grid grid-cols-4 gap-2">
          {presets.map((preset, index) => (
            <button
              key={index}
              type="button"
              className="aspect-square rounded-md border shadow-sm transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-ring"
              style={{
                backgroundColor: `rgba(${preset.join(', ')})`,
              }}
              onClick={() => setColor(preset as ColorLike)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// Color Picker Without EyeDropper
function ColorPickerWithoutEyeDropper() {
  const [color, setColor] = React.useState<ColorLike>([255, 140, 0, 1])

  return (
    <div className="flex flex-col gap-4">
      <ColorPicker
        className="max-w-sm rounded-md border bg-background p-4 shadow-sm"
        value={color}
        onChange={(v) => {
          startTransition(() => setColor(v))
        }}
      >
        <ColorPickerSelection />
        <div className="flex items-center gap-4">
          <div className="grid w-full gap-1">
            <ColorPickerHue />
            <ColorPickerAlpha />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ColorPickerOutput />
          <ColorPickerFormat />
        </div>
      </ColorPicker>
    </div>
  )
}

// Color Picker with Popover
function ColorPickerWithPopover() {
  const [color, setColor] = React.useState<ColorLike>([255, 0, 150, 1])
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className="flex flex-col gap-4">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-fit">
            <div
              className="mr-2 size-8 rounded border"
              style={{
                backgroundColor: `rgba(${color.toString()})`,
              }}
            />
            Pick a Color
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto fill-mode-forwards p-3" align="start">
          <ColorPicker
            value={color as ColorLike}
            onChange={(v) => {
              startTransition(() => setColor(v))
            }}
            className="gap-6"
          >
            <ColorPickerSelection className="h-64" />
            <div className="flex items-center gap-3">
              <ColorPickerEyeDropper />
              <div className="grid w-full gap-1">
                <ColorPickerHue />
                <ColorPickerAlpha />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ColorPickerOutput />
              <ColorPickerFormat />
            </div>
          </ColorPicker>
        </PopoverContent>
      </Popover>
      <div className="flex flex-col gap-2">
        <div
          className="h-16 w-full rounded-md border shadow-sm"
          style={{
            backgroundColor: `rgba(${color})`,
          }}
        />
        <Typography type="caption" className="text-muted-foreground">
          Current: rgba({color.toString()})
        </Typography>
      </div>
    </div>
  )
}

export function ColorPickerSection() {
  return (
    <>
      <div className="grid gap-8">
        <InformationCard>
          You can use the
          <span className="text-secondary-fg border rounded-sm bg-secondary p-1 ml-2">
            useColorPicker
          </span>
          under the{' '}
          <span className="text-secondary-fg border rounded-sm bg-secondary p-1 ml-2">
            {'<ColorPicker/>'}
          </span>
          component
        </InformationCard>

        <PlaygroundCard title="Basic Color Picker" categoryTitle="Component">
          <Typography type="body" className="text-muted-foreground mb-4">
            A complete color picker with selection area, hue/alpha sliders, and output formats.
          </Typography>
          <div className="p-4 bg-background w-full rounded-lg">
            <BasicColorPicker />
          </div>
        </PlaygroundCard>

        <PlaygroundCard title="Compact Color Picker" categoryTitle="Component">
          <Typography type="body" className="text-muted-foreground mb-4">
            A more compact version of the color picker for space-constrained layouts.
          </Typography>
          <div className="p-4 bg-background w-full rounded-lg">
            <CompactColorPicker />
          </div>
        </PlaygroundCard>

        <PlaygroundCard title="Large Color Picker" categoryTitle="Component">
          <Typography type="body" className="text-muted-foreground mb-4">
            A larger color picker with increased selection area for better precision.
          </Typography>
          <div className="p-4 bg-background w-full rounded-lg">
            <LargeColorPicker />
          </div>
        </PlaygroundCard>

        <PlaygroundCard title="Color Picker with Preset Colors" categoryTitle="Component">
          <Typography type="body" className="text-muted-foreground mb-4">
            Color picker with preset color swatches for quick selection.
          </Typography>
          <div className="p-4 bg-background w-full rounded-lg">
            <ColorPickerWithPresets />
          </div>
        </PlaygroundCard>

        <PlaygroundCard title="Color Picker without EyeDropper" categoryTitle="Component">
          <Typography type="body" className="text-muted-foreground mb-4">
            Color picker without the eye dropper tool for simpler interfaces.
          </Typography>
          <div className="p-4 bg-background w-full rounded-lg">
            <ColorPickerWithoutEyeDropper />
          </div>
        </PlaygroundCard>

        <PlaygroundCard title="Color Picker with Popover" categoryTitle="Component">
          <Typography type="body" className="text-muted-foreground mb-4">
            Color picker inside a popover triggered by a button with live preview.
          </Typography>
          <div className="p-4 bg-background w-full rounded-lg">
            <ColorPickerWithPopover />
          </div>
        </PlaygroundCard>
      </div>
    </>
  )
}
