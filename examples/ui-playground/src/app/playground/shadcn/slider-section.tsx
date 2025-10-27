import React from 'react'

import { Label, Slider, Typography } from '@genseki/react/v2'

import { PlaygroundCard } from '~/src/components/card'

// Basic Slider
function BasicSlider() {
  const [value, setValue] = React.useState([50])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Label>Value</Label>
        <Typography type="body" weight="medium">
          {value[0]}%
        </Typography>
      </div>
      <Slider value={value} onValueChange={setValue} />
    </div>
  )
}

// Slider with Range
function SliderWithRange() {
  const [value, setValue] = React.useState([20, 80])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Label>Range</Label>
        <Typography type="body" weight="medium">
          {value[0]}% - {value[1]}%
        </Typography>
      </div>
      <Slider value={value} onValueChange={setValue} />
    </div>
  )
}

// Slider with Steps
function SliderWithSteps() {
  const [value, setValue] = React.useState([50])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Label>Volume</Label>
        <Typography type="body" weight="medium">
          {value[0]}%
        </Typography>
      </div>
      <Slider value={value} onValueChange={setValue} step={10} />
    </div>
  )
}

// Slider with Min/Max
function SliderWithMinMax() {
  const [value, setValue] = React.useState([25])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Label>Temperature (°C)</Label>
        <Typography type="body" weight="medium">
          {value[0]}°C
        </Typography>
      </div>
      <Slider value={value} onValueChange={setValue} min={-20} max={50} />
    </div>
  )
}

// Disabled Slider
function DisabledSlider() {
  const [value] = React.useState([50])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Label>Disabled</Label>
        <Typography type="body" weight="medium">
          {value[0]}%
        </Typography>
      </div>
      <Slider value={value} disabled />
    </div>
  )
}

// Vertical Slider
function VerticalSlider() {
  const [value, setValue] = React.useState([50])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Label>Vertical Slider</Label>
        <Typography type="body" weight="medium">
          {value[0]}%
        </Typography>
      </div>
      <div className="flex h-64 items-center justify-center gap-4">
        <Slider value={value} onValueChange={setValue} orientation="vertical" className="h-64" />
      </div>
    </div>
  )
}

// Slider with Marks
function SliderWithMarks() {
  const [value, setValue] = React.useState([50])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Label>Rating</Label>
        <Typography type="body" weight="medium">
          {value[0]}
        </Typography>
      </div>
      <Slider value={value} onValueChange={setValue} min={0} max={5} step={1} />
      <div className="flex justify-between text-muted-foreground">
        <Typography type="caption">0</Typography>
        <Typography type="caption">1</Typography>
        <Typography type="caption">2</Typography>
        <Typography type="caption">3</Typography>
        <Typography type="caption">4</Typography>
        <Typography type="caption">5</Typography>
      </div>
    </div>
  )
}

// Slider with Custom Styling
function SliderWithCustomStyling() {
  const [value, setValue] = React.useState([75])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Label>Custom Styled Slider</Label>
        <Typography type="body" weight="medium">
          {value[0]}%
        </Typography>
      </div>
      <Slider
        value={value}
        onValueChange={setValue}
        className="[&_[data-slot=slider-thumb]]:bg-blue-500 [&_[data-slot=slider-range]]:bg-blue-500"
      />
    </div>
  )
}

// Multiple Sliders
function MultipleSliders() {
  const [volume, setVolume] = React.useState([50])
  const [brightness, setBrightness] = React.useState([75])
  const [contrast, setContrast] = React.useState([60])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Label>Volume</Label>
          <Typography type="body" weight="medium">
            {volume[0]}%
          </Typography>
        </div>
        <Slider value={volume} onValueChange={setVolume} />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Label>Brightness</Label>
          <Typography type="body" weight="medium">
            {brightness[0]}%
          </Typography>
        </div>
        <Slider value={brightness} onValueChange={setBrightness} />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Label>Contrast</Label>
          <Typography type="body" weight="medium">
            {contrast[0]}%
          </Typography>
        </div>
        <Slider value={contrast} onValueChange={setContrast} />
      </div>
    </div>
  )
}

export function SliderSection() {
  return (
    <>
      <div className="grid gap-8">
        <PlaygroundCard title="Basic Slider" categoryTitle="Component">
          <Typography type="body" className="text-muted-foreground mb-4">
            A basic slider with a single value.
          </Typography>
          <div className="p-4 bg-background w-full rounded-lg">
            <BasicSlider />
          </div>
        </PlaygroundCard>

        <PlaygroundCard title="Slider with Range" categoryTitle="Component">
          <Typography type="body" className="text-muted-foreground mb-4">
            A slider with two thumbs for selecting a range of values.
          </Typography>
          <div className="p-4 bg-background w-full rounded-lg">
            <SliderWithRange />
          </div>
        </PlaygroundCard>

        <PlaygroundCard title="Slider with Steps" categoryTitle="Component">
          <Typography type="body" className="text-muted-foreground mb-4">
            A slider with discrete step increments.
          </Typography>
          <div className="p-4 bg-background w-full rounded-lg">
            <SliderWithSteps />
          </div>
        </PlaygroundCard>

        <PlaygroundCard title="Slider with Min/Max" categoryTitle="Component">
          <Typography type="body" className="text-muted-foreground mb-4">
            A slider with custom minimum and maximum values.
          </Typography>
          <div className="p-4 bg-background w-full rounded-lg">
            <SliderWithMinMax />
          </div>
        </PlaygroundCard>

        <PlaygroundCard title="Disabled Slider" categoryTitle="Component">
          <Typography type="body" className="text-muted-foreground mb-4">
            A disabled slider that cannot be interacted with.
          </Typography>
          <div className="p-4 bg-background w-full rounded-lg">
            <DisabledSlider />
          </div>
        </PlaygroundCard>

        <PlaygroundCard title="Vertical Slider" categoryTitle="Component">
          <Typography type="body" className="text-muted-foreground mb-4">
            A vertical orientation slider.
          </Typography>
          <div className="p-4 bg-background w-full rounded-lg">
            <VerticalSlider />
          </div>
        </PlaygroundCard>

        <PlaygroundCard title="Slider with Marks" categoryTitle="Component">
          <Typography type="body" className="text-muted-foreground mb-4">
            A slider with step marks and labels below.
          </Typography>
          <div className="p-4 bg-background w-full rounded-lg">
            <SliderWithMarks />
          </div>
        </PlaygroundCard>

        <PlaygroundCard title="Slider with Custom Styling" categoryTitle="Component">
          <Typography type="body" className="text-muted-foreground mb-4">
            A slider with custom colors and styling.
          </Typography>
          <div className="p-4 bg-background w-full rounded-lg">
            <SliderWithCustomStyling />
          </div>
        </PlaygroundCard>

        <PlaygroundCard title="Multiple Sliders" categoryTitle="Component">
          <Typography type="body" className="text-muted-foreground mb-4">
            Multiple independent sliders for different settings.
          </Typography>
          <div className="p-4 bg-background w-full rounded-lg">
            <MultipleSliders />
          </div>
        </PlaygroundCard>
      </div>
    </>
  )
}
