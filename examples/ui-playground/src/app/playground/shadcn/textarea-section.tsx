import React from 'react'

import { Typography } from '@genseki/react'
import { Label, Textarea } from '@genseki/react/v2'

import { PlaygroundCard } from '~/src/components/card'

// Basic Textarea
function BasicTextarea() {
  return (
    <div className="flex flex-col gap-4">
      <Textarea placeholder="Type your message here..." />
    </div>
  )
}

// Textarea with Label
function TextareaWithLabel() {
  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-4">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" placeholder="Type your message here..." />
      </div>
    </div>
  )
}

// Textarea with Description
function TextareaWithDescription() {
  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-4">
        <Label htmlFor="feedback">Feedback</Label>
        <Textarea
          id="feedback"
          placeholder="Please provide your feedback..."
          className="min-h-24"
        />
        <Typography type="caption" className=" text-muted-foreground">
          Please provide detailed feedback about your experience.
        </Typography>
      </div>
    </div>
  )
}

// Disabled Textarea
function DisabledTextarea() {
  return (
    <div className="flex flex-col gap-4">
      <Textarea placeholder="This textarea is disabled" disabled />
    </div>
  )
}

// Textarea with Error State
function TextareaWithError() {
  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-4">
        <Label htmlFor="error-textarea">Message</Label>
        <Textarea
          id="error-textarea"
          placeholder="Type your message here..."
          aria-invalid="true"
          className="border-destructive focus-visible:ring-destructive"
        />
        <Typography type="caption" className=" text-destructive">
          This field is required and must be at least 10 characters.
        </Typography>
      </div>
    </div>
  )
}

// Textarea with Different Sizes
function TextareaSizes() {
  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-4">
        <Label>Small</Label>
        <Textarea placeholder="Small textarea" className="min-h-16 " />
      </div>
      <div className="space-y-4">
        <Label>Default</Label>
        <Textarea placeholder="Default textarea" />
      </div>
      <div className="space-y-4">
        <Label>Large</Label>
        <Textarea placeholder="Large textarea" className="min-h-48 text-lg" />
      </div>
    </div>
  )
}

// Textarea with Character Count
function TextareaWithCharacterCount() {
  const [value, setValue] = React.useState('')
  const maxLength = 200

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-4">
        <Label htmlFor="character-count">Message</Label>
        <Textarea
          id="character-count"
          placeholder="Type your message here..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          maxLength={maxLength}
        />
        <div className="flex justify-between  text-muted-foreground">
          <span>
            Character count: {value.length}/{maxLength}
          </span>
          <span className={value.length > maxLength * 0.9 ? 'text-destructive' : ''}>
            {maxLength - value.length} remaining
          </span>
        </div>
      </div>
    </div>
  )
}

// Textarea with Auto Resize
function TextareaWithAutoResize() {
  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-4">
        <Label htmlFor="auto-resize">Auto-resizing textarea</Label>
        <Textarea
          id="auto-resize"
          placeholder="This textarea will grow as you type..."
          className="field-sizing-content min-h-16"
        />
      </div>
    </div>
  )
}

// Textarea with Custom Styling
function TextareaWithCustomStyling() {
  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-4">
        <Label htmlFor="custom-styling">Custom styled textarea</Label>
        <Textarea
          id="custom-styling"
          placeholder="This textarea has custom styling..."
          className="border-2 border-blue-300 focus-visible:border-blue-500 focus-visible:ring-blue-200 bg-blue-50/50"
        />
      </div>
    </div>
  )
}

export function TextareaSection() {
  return (
    <>
      <div className="grid gap-8">
        <PlaygroundCard title="Basic Textarea" categoryTitle="Component">
          <Typography type="body" className="text-muted-foreground mb-4">
            A basic textarea input for multi-line text entry.
          </Typography>
          <div className="p-4 bg-background w-full rounded-lg">
            <BasicTextarea />
          </div>
        </PlaygroundCard>

        <PlaygroundCard title="Textarea with Label" categoryTitle="Component">
          <Typography type="body" className="text-muted-foreground mb-4">
            Textarea with an associated label for better accessibility.
          </Typography>
          <div className="p-4 bg-background w-full rounded-lg">
            <TextareaWithLabel />
          </div>
        </PlaygroundCard>

        <PlaygroundCard title="Textarea with Description" categoryTitle="Component">
          <Typography type="body" className="text-muted-foreground mb-4">
            Textarea with descriptive text to help users understand the expected input.
          </Typography>
          <div className="p-4 bg-background w-full rounded-lg">
            <TextareaWithDescription />
          </div>
        </PlaygroundCard>

        <PlaygroundCard title="Disabled Textarea" categoryTitle="Component">
          <Typography type="body" className="text-muted-foreground mb-4">
            A disabled textarea that cannot be interacted with.
          </Typography>
          <div className="p-4 bg-background w-full rounded-lg">
            <DisabledTextarea />
          </div>
        </PlaygroundCard>

        <PlaygroundCard title="Textarea with Error State" categoryTitle="Component">
          <Typography type="body" className="text-muted-foreground mb-4">
            Textarea in an error state with validation feedback.
          </Typography>
          <div className="p-4 bg-background w-full rounded-lg">
            <TextareaWithError />
          </div>
        </PlaygroundCard>

        <PlaygroundCard title="Textarea Sizes" categoryTitle="Component">
          <Typography type="body" className="text-muted-foreground mb-4">
            Different sizes of textarea components for various use cases.
          </Typography>
          <div className="p-4 bg-background w-full rounded-lg">
            <TextareaSizes />
          </div>
        </PlaygroundCard>

        <PlaygroundCard title="Textarea with Character Count" categoryTitle="Component">
          <Typography type="body" className="text-muted-foreground mb-4">
            Textarea with character counting functionality and validation.
          </Typography>
          <div className="p-4 bg-background w-full rounded-lg">
            <TextareaWithCharacterCount />
          </div>
        </PlaygroundCard>

        <PlaygroundCard title="Auto-resizing Textarea" categoryTitle="Component">
          <Typography type="body" className="text-muted-foreground mb-4">
            Textarea that automatically adjusts its height based on content.
          </Typography>
          <div className="p-4 bg-background w-full rounded-lg">
            <TextareaWithAutoResize />
          </div>
        </PlaygroundCard>

        <PlaygroundCard title="Textarea with Custom Styling" categoryTitle="Component">
          <Typography type="body" className="text-muted-foreground mb-4">
            Textarea with custom styling to match specific design requirements.
          </Typography>
          <div className="p-4 bg-background w-full rounded-lg">
            <TextareaWithCustomStyling />
          </div>
        </PlaygroundCard>
      </div>
    </>
  )
}
