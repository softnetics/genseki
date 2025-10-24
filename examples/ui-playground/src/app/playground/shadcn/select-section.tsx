'use client'

import * as React from 'react'

import {
  CircleIcon,
  HexagonIcon,
  SquareIcon,
  TriangleIcon,
  UserIcon,
  XIcon,
} from '@phosphor-icons/react'

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupControl,
  InputGroupText,
  SelectItemIndicator,
  SelectItemText,
  Typography,
} from '@genseki/react/v2'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@genseki/react/v2'

import { PlaygroundCard } from '~/src/components/card'

// Basic Select
function BasicSelect() {
  const [value, setValue] = React.useState<string>('')

  return (
    <div className="space-y-4">
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger className="min-w-[300px]">
          <div className="flex gap-x-2 items-center">
            <SelectValue placeholder="Select a fruit" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">
            <SelectItemText>Apple</SelectItemText>
          </SelectItem>
          <SelectItem value="banana">
            <SelectItemText>Banana</SelectItemText>
          </SelectItem>
          <SelectItem value="blueberry">
            <SelectItemText>Blueberry</SelectItemText>
          </SelectItem>
          <SelectItem value="grapes">
            <SelectItemText>Grapes</SelectItemText>
          </SelectItem>
          <SelectItem value="pineapple">
            <SelectItemText>Pineapple</SelectItemText>
          </SelectItem>
        </SelectContent>
      </Select>

      <Typography type="body" className="text-text-secondary">
        Selected value: {value || 'None'}
      </Typography>
    </div>
  )
}

// Input group select
function InputGroupSelect() {
  const [value, setValue] = React.useState<string>('')

  return (
    <div className="space-y-4">
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <InputGroupText>
            <UserIcon />
          </InputGroupText>
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <InputGroupButton variant="naked" size="icon-xs" className="rounded-full">
            <XIcon />
          </InputGroupButton>
        </InputGroupAddon>
        <Select value={value} onValueChange={setValue}>
          <InputGroupControl>
            <SelectTrigger className="min-w-[300px]">
              <div className="flex gap-x-2 items-center">
                <SelectValue placeholder="Select a fruit" />
              </div>
            </SelectTrigger>
          </InputGroupControl>
          <SelectContent className="">
            <SelectItem value="apple">
              <SelectItemText>Apple</SelectItemText>
            </SelectItem>
            <SelectItem value="banana">
              <SelectItemText>Banana</SelectItemText>
            </SelectItem>
            <SelectItem value="blueberry">
              <SelectItemText>Blueberry</SelectItemText>
            </SelectItem>
            <SelectItem value="grapes">
              <SelectItemText>Grapes</SelectItemText>
            </SelectItem>
            <SelectItem value="pineapple">
              <SelectItemText>Pineapple</SelectItemText>
            </SelectItem>
          </SelectContent>
        </Select>
      </InputGroup>

      <Typography type="body" className="text-text-secondary">
        Selected value: {value || 'None'}
      </Typography>
    </div>
  )
}

// Input group with icon value
function InputGroupValueWithIcon() {
  const [value, setValue] = React.useState<string>('apple')

  return (
    <div className="space-y-4">
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger className="min-w-[300px]">
          <SelectValue placeholder="Select a fruit" className="flex gap-x-2 items-center" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">
            <SelectItemIndicator />
            <SelectItemText>
              <CircleIcon className="text-icon-brand" />
              Apple
            </SelectItemText>
          </SelectItem>
          <SelectItem value="banana">
            <SelectItemIndicator />
            <SelectItemText>
              <SquareIcon className="text-icon-brand" />
              Banana
            </SelectItemText>
          </SelectItem>
          <SelectItem value="blueberry">
            <SelectItemIndicator />
            <SelectItemText>
              <TriangleIcon className="text-icon-brand" />
              Blueberry
            </SelectItemText>
          </SelectItem>
          <SelectItem value="grapes">
            <SelectItemIndicator />
            <SelectItemText>
              <HexagonIcon className="text-icon-brand" />
              Grapes
            </SelectItemText>
          </SelectItem>
        </SelectContent>
      </Select>

      <Typography type="body" className="text-text-secondary">
        Selected value: {value || 'None'}
      </Typography>
    </div>
  )
}

// Basic Select with leading icon
function BasicSelectLeadingIcon() {
  const [value, setValue] = React.useState<string>('grapes')

  return (
    <div className="space-y-4">
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger className="min-w-[300px]">
          <div className="flex gap-x-2 items-center">
            <UserIcon />
            <SelectValue placeholder="Select a fruit" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">
            <SelectItemText>Mr.Apple</SelectItemText>
          </SelectItem>
          <SelectItem value="banana">
            <SelectItemText>Mr.Banana</SelectItemText>
          </SelectItem>
          <SelectItem value="blueberry">
            <SelectItemText>Mr.Blueberry</SelectItemText>
          </SelectItem>
          <SelectItem value="grapes">
            <SelectItemText>Mr.Grapes</SelectItemText>
          </SelectItem>
          <SelectItem value="pineapple">
            <SelectItemText>Mr.Pineapple</SelectItemText>
          </SelectItem>
        </SelectContent>
      </Select>
      <Typography type="body" className="text-text-secondary">
        Selected value: {value || 'None'}
      </Typography>
    </div>
  )
}

// Select item with icon
function SelectItemIcon() {
  const [value, setValue] = React.useState<string>('mango')

  return (
    <div className="space-y-4">
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger className="min-w-[300px]">
          <div className="flex gap-x-2 items-center">
            <SelectValue placeholder="Select a fruit" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">
            <SquareIcon className="size-10" />
            <SelectItemText>Apple</SelectItemText>
            <SelectItemIndicator />
          </SelectItem>
          <SelectItem value="mango">
            <CircleIcon className="size-10" />
            <SelectItemIndicator />
            <SelectItemText>Mango</SelectItemText>
          </SelectItem>
          <SelectItem value="watermelon">
            <TriangleIcon className="size-10" />
            <SelectItemIndicator />
            <SelectItemText>Watermelon</SelectItemText>
          </SelectItem>
        </SelectContent>
      </Select>
      <Typography type="body" className="text-text-secondary">
        Selected value: {value || 'None'}
      </Typography>
    </div>
  )
}

// Select with Groups
function SelectWithGroups() {
  const [value, setValue] = React.useState<string>('')

  return (
    <div className="space-y-4">
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger className="min-w-[300px]">
          <SelectValue placeholder="Select a framework" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Frontend</SelectLabel>
            <SelectItem value="react">
              <SelectItemText>React</SelectItemText>
            </SelectItem>
            <SelectItem value="vue">
              <SelectItemText>Vue</SelectItemText>
            </SelectItem>
            <SelectItem value="angular">
              <SelectItemText>Angular</SelectItemText>
            </SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Backend</SelectLabel>
            <SelectItem value="node">
              <SelectItemText>Node.js</SelectItemText>
            </SelectItem>
            <SelectItem value="python">
              <SelectItemText>Python</SelectItemText>
            </SelectItem>
            <SelectItem value="java">
              <SelectItemText>Java</SelectItemText>
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Typography type="body" className="text-text-secondary">
        Selected value: {value || 'None'}
      </Typography>
    </div>
  )
}

// Select Sizes
function SelectSizes() {
  const [smallValue, setSmallValue] = React.useState<string>('')
  const [defaultValue, setDefaultValue] = React.useState<string>('')

  return (
    <div className="space-y-4">
      <div className="flex gap-x-4">
        <div className="space-y-2">
          <Typography type="caption" weight="medium">
            Small Size
          </Typography>
          <Select value={smallValue} onValueChange={setSmallValue}>
            <SelectTrigger size="sm" className="w-[150px]">
              <SelectValue placeholder="Small" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="option1">
                <SelectItemText>Option 1</SelectItemText>
              </SelectItem>
              <SelectItem value="option2">
                <SelectItemText>Option 2</SelectItemText>
              </SelectItem>
              <SelectItem value="option3">
                <SelectItemText>Option 3</SelectItemText>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Typography type="caption" weight="medium">
            Default Size
          </Typography>
          <Select value={defaultValue} onValueChange={setDefaultValue}>
            <SelectTrigger size="default" className="w-[150px]">
              <SelectValue placeholder="Default" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="option1">
                <SelectItemText>Option 1</SelectItemText>
              </SelectItem>
              <SelectItem value="option2">
                <SelectItemText>Option 2</SelectItemText>
              </SelectItem>
              <SelectItem value="option3">
                <SelectItemText>Option 3</SelectItemText>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Typography type="body" className="text-text-secondary">
        Small: {smallValue || 'None'} | Default: {defaultValue || 'None'}
      </Typography>
    </div>
  )
}

// Disabled Select
function DisabledSelect() {
  return (
    <div className="space-y-4">
      <Select disabled>
        <SelectTrigger className="min-w-[300px]">
          <SelectValue placeholder="Disabled select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">
            <SelectItemText>Option 1</SelectItemText>
          </SelectItem>
          <SelectItem value="option2">
            <SelectItemText>Option 2</SelectItemText>
          </SelectItem>
        </SelectContent>
      </Select>
      <Typography type="body" className="text-text-secondary">
        This select is disabled and cannot be interacted with.
      </Typography>
    </div>
  )
}

// Long List with Scroll
function LongListSelect() {
  const [value, setValue] = React.useState<string>('')

  return (
    <div className="space-y-4">
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger className="min-w-[300px]">
          <SelectValue placeholder="Select a country" />
        </SelectTrigger>
        <SelectContent>
          <SelectScrollUpButton />
          <SelectGroup>
            <SelectLabel>Countries</SelectLabel>
            <SelectItem value="afghanistan">
              <SelectItemText>Afghanistan</SelectItemText>
            </SelectItem>
            <SelectItem value="albania">
              <SelectItemText>Albania</SelectItemText>
            </SelectItem>
            <SelectItem value="algeria">
              <SelectItemText>Algeria</SelectItemText>
            </SelectItem>
            <SelectItem value="argentina">
              <SelectItemText>Argentina</SelectItemText>
            </SelectItem>
            <SelectItem value="australia">
              <SelectItemText>Australia</SelectItemText>
            </SelectItem>
            <SelectItem value="austria">
              <SelectItemText>Austria</SelectItemText>
            </SelectItem>
            <SelectLabel>Noncritical countries</SelectLabel>
            <SelectItem value="bangladesh">
              <SelectItemText>Bangladesh</SelectItemText>
            </SelectItem>
            <SelectItem value="belgium">
              <SelectItemText>Belgium</SelectItemText>
            </SelectItem>
            <SelectItem value="brazil">
              <SelectItemText>Brazil</SelectItemText>
            </SelectItem>
            <SelectItem value="canada">
              <SelectItemText>Canada</SelectItemText>
            </SelectItem>
            <SelectItem value="china">
              <SelectItemText>China</SelectItemText>
            </SelectItem>
            <SelectItem value="denmark">
              <SelectItemText>Denmark</SelectItemText>
            </SelectItem>
            <SelectItem value="egypt">
              <SelectItemText>Egypt</SelectItemText>
            </SelectItem>
            <SelectItem value="finland">
              <SelectItemText>Finland</SelectItemText>
            </SelectItem>
            <SelectItem value="france">
              <SelectItemText>France</SelectItemText>
            </SelectItem>
            <SelectItem value="germany">
              <SelectItemText>Germany</SelectItemText>
            </SelectItem>
            <SelectItem value="india">
              <SelectItemText>India</SelectItemText>
            </SelectItem>
            <SelectItem value="italy">
              <SelectItemText>Italy</SelectItemText>
            </SelectItem>
            <SelectItem value="japan">
              <SelectItemText>Japan</SelectItemText>
            </SelectItem>
            <SelectItem value="mexico">
              <SelectItemText>Mexico</SelectItemText>
            </SelectItem>
            <SelectItem value="netherlands">
              <SelectItemText>Netherlands</SelectItemText>
            </SelectItem>
            <SelectItem value="norway">
              <SelectItemText>Norway</SelectItemText>
            </SelectItem>
            <SelectItem value="poland">
              <SelectItemText>Poland</SelectItemText>
            </SelectItem>
            <SelectItem value="russia">
              <SelectItemText>Russia</SelectItemText>
            </SelectItem>
            <SelectItem value="spain">
              <SelectItemText>Spain</SelectItemText>
            </SelectItem>
            <SelectItem value="sweden">
              <SelectItemText>Sweden</SelectItemText>
            </SelectItem>
            <SelectItem value="switzerland">
              <SelectItemText>Switzerland</SelectItemText>
            </SelectItem>
            <SelectItem value="thailand">
              <SelectItemText>Thailand</SelectItemText>
            </SelectItem>
            <SelectItem value="uk">
              <SelectItemText>United Kingdom</SelectItemText>
            </SelectItem>
            <SelectItem value="usa">
              <SelectItemText>United States</SelectItemText>
            </SelectItem>
          </SelectGroup>
          <SelectScrollDownButton />
        </SelectContent>
      </Select>
      <Typography type="body" className="text-text-secondary">
        Selected country: {value || 'None'}
      </Typography>
    </div>
  )
}

// Invalid Select
function InvalidSelect() {
  const [value, setValue] = React.useState<string>('')

  return (
    <div className="space-y-4">
      <InputGroup>
        <Select value={value} onValueChange={setValue}>
          <InputGroupControl>
            <SelectTrigger className="min-w-[300px]" aria-invalid="true">
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
          </InputGroupControl>
          <SelectContent>
            <SelectItem value="apple">
              <SelectItemText>Apple</SelectItemText>
            </SelectItem>
            <SelectItem value="banana">
              <SelectItemText>Banana</SelectItemText>
            </SelectItem>
            <SelectItem value="blueberry">
              <SelectItemText>Blueberry</SelectItemText>
            </SelectItem>
            <SelectItem value="grapes">
              <SelectItemText>Grapes</SelectItemText>
            </SelectItem>
            <SelectItem value="pineapple">
              <SelectItemText>Pineapple</SelectItemText>
            </SelectItem>
          </SelectContent>
        </Select>
      </InputGroup>
      <Typography type="body" className="text-text-secondary">
        This select has an invalid state with error styling.
      </Typography>
    </div>
  )
}

export function SelectSection() {
  return (
    <div className="grid gap-8">
      <PlaygroundCard title="Basic Select" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          A simple select dropdown with placeholder text and value tracking.
        </Typography>
        <div className="p-4 bg-secondary w-full rounded-lg">
          <BasicSelect />
        </div>
      </PlaygroundCard>
      <PlaygroundCard title="Basic Select with input group" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          A simple select dropdown with input group.
        </Typography>
        <div className="p-4 bg-secondary w-full rounded-lg">
          <InputGroupSelect />
        </div>
      </PlaygroundCard>
      <PlaygroundCard title="Basic Select with icon value" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          A simple select dropdown with icon value.
        </Typography>
        <div className="p-4 bg-secondary w-full rounded-lg">
          <InputGroupValueWithIcon />
        </div>
      </PlaygroundCard>
      <PlaygroundCard title="Basic Select" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          A simple select dropdown with placeholder text and value tracking with leading icon.
        </Typography>
        <div className="p-4 bg-secondary w-full rounded-lg">
          <BasicSelectLeadingIcon />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Icon Select" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          A simple select dropdown with items icon
        </Typography>
        <div className="p-4 bg-secondary w-full rounded-lg">
          <SelectItemIcon />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Select with Groups" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          Select dropdown with grouped options and separators for better organization.
        </Typography>
        <div className="p-4 bg-secondary w-full rounded-lg">
          <SelectWithGroups />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Select Sizes" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          Select components in different sizes: small and default.
        </Typography>
        <div className="p-4 bg-secondary w-full rounded-lg">
          <SelectSizes />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Disabled Select" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          Disabled select component that cannot be interacted with.
        </Typography>
        <div className="p-4 bg-secondary w-full rounded-lg">
          <DisabledSelect />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Invalid Select" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          Select component in invalid state with error styling and accessibility attributes.
        </Typography>
        <div className="p-4 bg-secondary w-full rounded-lg">
          <InvalidSelect />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Long List with Scroll" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          Select with many options demonstrating scroll functionality and scroll buttons.
        </Typography>
        <div className="p-4 bg-secondary w-full rounded-lg">
          <LongListSelect />
        </div>
      </PlaygroundCard>
    </div>
  )
}
