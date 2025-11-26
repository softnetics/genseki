'use client'

import * as React from 'react'

import { Label, RadioGroup, RadioGroupItem, Typography } from '@genseki/ui'

import { PlaygroundCard } from '~/src/components/card'

// Basic Radio Group
function BasicRadioGroup() {
  const [value, setValue] = React.useState('option-one')

  return (
    <RadioGroup value={value} onValueChange={setValue}>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-one" id="option-one" />
        <Label htmlFor="option-one">Option One</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-two" id="option-two" />
        <Label htmlFor="option-two">Option Two</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-three" id="option-three" />
        <Label htmlFor="option-three">Option Three</Label>
      </div>
    </RadioGroup>
  )
}

// Radio Group with Default Value
function RadioGroupWithDefault() {
  return (
    <RadioGroup defaultValue="option-two">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-one" id="default-option-one" />
        <Label htmlFor="default-option-one">Option One</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-two" id="default-option-two" />
        <Label htmlFor="default-option-two">Option Two</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-three" id="default-option-three" />
        <Label htmlFor="default-option-three">Option Three</Label>
      </div>
    </RadioGroup>
  )
}

// Disabled Radio Group
function DisabledRadioGroup() {
  return (
    <RadioGroup defaultValue="option-one">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-one" id="disabled-option-one" disabled />
        <Label htmlFor="disabled-option-one" className="opacity-50">
          Option One (Disabled)
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-two" id="disabled-option-two" />
        <Label htmlFor="disabled-option-two">Option Two</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-three" id="disabled-option-three" disabled />
        <Label htmlFor="disabled-option-three" className="opacity-50">
          Option Three (Disabled)
        </Label>
      </div>
    </RadioGroup>
  )
}

// Radio Group with Description
function RadioGroupWithDescription() {
  const [value, setValue] = React.useState('')

  return (
    <RadioGroup value={value} onValueChange={setValue}>
      <div className="flex items-start space-x-2">
        <RadioGroupItem value="free" id="free-plan" className="mt-1" />
        <div className="flex flex-col">
          <Label htmlFor="free-plan">Free Plan</Label>
          <Typography type="caption" className="text-muted-foreground">
            Perfect for getting started
          </Typography>
        </div>
      </div>
      <div className="flex items-start space-x-2">
        <RadioGroupItem value="pro" id="pro-plan" className="mt-1" />
        <div className="flex flex-col">
          <Label htmlFor="pro-plan">Pro Plan</Label>
          <Typography type="caption" className="text-muted-foreground">
            Best for professional use
          </Typography>
        </div>
      </div>
      <div className="flex items-start space-x-2">
        <RadioGroupItem value="enterprise" id="enterprise-plan" className="mt-1" />
        <div className="flex flex-col">
          <Label htmlFor="enterprise-plan">Enterprise Plan</Label>
          <Typography type="caption" className="text-muted-foreground">
            For large organizations
          </Typography>
        </div>
      </div>
    </RadioGroup>
  )
}

// Radio Group - Horizontal Layout
function RadioGroupHorizontal() {
  const [value, setValue] = React.useState('small')

  return (
    <RadioGroup value={value} onValueChange={setValue} className="flex flex-row gap-6">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="small" id="size-small" />
        <Label htmlFor="size-small">Small</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="medium" id="size-medium" />
        <Label htmlFor="size-medium">Medium</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="large" id="size-large" />
        <Label htmlFor="size-large">Large</Label>
      </div>
    </RadioGroup>
  )
}

// Radio Group - Error State
function RadioGroupError() {
  return (
    <RadioGroup defaultValue="option-one">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-one" id="error-option-one" aria-invalid />
        <Label htmlFor="error-option-one">Option One</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-two" id="error-option-two" aria-invalid />
        <Label htmlFor="error-option-two">Option Two</Label>
      </div>
      <Typography type="caption" className="text-destructive mt-2">
        Please select a valid option
      </Typography>
    </RadioGroup>
  )
}

export function RadioGroupSection() {
  return (
    <div className="grid gap-8">
      <PlaygroundCard title="Basic Radio Group" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          A basic radio group with multiple options. Only one option can be selected at a time.
        </Typography>
        <div className="p-4 bg-secondary w-full rounded-lg">
          <BasicRadioGroup />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Radio Group with Default Value" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          Radio group with a pre-selected default value.
        </Typography>
        <div className="p-4 bg-secondary w-full rounded-lg">
          <RadioGroupWithDefault />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Disabled Radio Group" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          Radio group items can be disabled individually or the entire group can be disabled.
        </Typography>
        <div className="p-4 bg-secondary w-full rounded-lg">
          <DisabledRadioGroup />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Radio Group with Description" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          Radio group items with additional descriptions for better context.
        </Typography>
        <div className="p-4 bg-secondary w-full rounded-lg">
          <RadioGroupWithDescription />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Radio Group - Horizontal Layout" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          Radio group displayed in a horizontal layout instead of vertical.
        </Typography>
        <div className="p-4 bg-secondary w-full rounded-lg">
          <RadioGroupHorizontal />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Radio Group - Error State" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          Radio group items can display an error state with visual feedback.
        </Typography>
        <div className="p-4 bg-secondary w-full rounded-lg">
          <RadioGroupError />
        </div>
      </PlaygroundCard>
    </div>
  )
}
