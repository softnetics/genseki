import React from 'react'

import {
  AtIcon,
  CurrencyDollarIcon,
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
  LinkIcon,
  MagnifyingGlassIcon,
  PaperPlaneRightIcon,
  XIcon,
} from '@phosphor-icons/react'

import {
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  Label,
  Typography,
} from '@genseki/react'

import { PlaygroundCard } from '~/src/components/card'

// Basic Input
function BasicInput() {
  return (
    <div className="space-y-4">
      <Input placeholder="Enter your name..." />
    </div>
  )
}

// Input Types
function InputTypes() {
  return (
    <div className="space-y-4">
      <Input type="text" placeholder="Text input" />
      <Input type="email" placeholder="Email input" />
      <Input type="password" placeholder="Password input" />
      <Input type="number" placeholder="Number input" />
      <Input type="tel" placeholder="Phone number" />
      <Input type="url" placeholder="https://example.com" />
      <Input type="search" placeholder="Search..." />
    </div>
  )
}

// Input States
function InputStates() {
  return (
    <div className="space-y-4">
      <Input placeholder="Default input" />
      <Input placeholder="Disabled input" disabled />
      <Input placeholder="Invalid input" aria-invalid="true" defaultValue="Invalid value" />
    </div>
  )
}

// Controlled Input
function ControlledInput() {
  const [value, setValue] = React.useState('')

  return (
    <div className="space-y-4">
      <Input
        placeholder="Type something..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <div className="flex gap-2 items-center">
        <Typography type="caption" className="text-muted-foreground">
          Current value: {value || '(empty)'}
        </Typography>
      </div>
    </div>
  )
}

// Input with Labels
function InputWithLabels() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium">
          Name
        </Label>
        <Input id="name" placeholder="Enter your name" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">
          Email <span className="text-destructive">*</span>
        </Label>
        <Input id="email" type="email" placeholder="you@example.com" required />
        <Typography type="caption" className="text-muted-foreground">
          We{"'"}ll never share your email with anyone else.
        </Typography>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium">
          Password
        </Label>
        <Input id="password" type="password" placeholder="Enter password" />
        <Typography type="caption" className="text-destructive">
          Password must be at least 8 characters.
        </Typography>
      </div>
    </div>
  )
}

// File Input
function FileInput() {
  return (
    <div className="space-y-4">
      <Input type="file" />
      <Input type="file" multiple />
    </div>
  )
}

// Input Group - Inline Start
function InputGroupInlineStart() {
  return (
    <div className="space-y-4">
      <InputGroup isPending>
        <InputGroupAddon align="inline-start">
          <InputGroupText>
            <MagnifyingGlassIcon />
          </InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="Searching..." />
      </InputGroup>

      <InputGroup>
        <InputGroupAddon align="inline-start">
          <InputGroupText>
            <EnvelopeIcon />
          </InputGroupText>
        </InputGroupAddon>
        <InputGroupInput type="email" placeholder="you@example.com" />
      </InputGroup>

      <InputGroup>
        <InputGroupAddon align="inline-start">
          <InputGroupText>
            <CurrencyDollarIcon />
          </InputGroupText>
        </InputGroupAddon>
        <InputGroupInput type="number" placeholder="0.00" />
      </InputGroup>
    </div>
  )
}

// Input Group - Inline End
function InputGroupInlineEnd() {
  return (
    <div className="space-y-4">
      <InputGroup>
        <InputGroupInput placeholder="Enter URL" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>
            <LinkIcon />
          </InputGroupText>
        </InputGroupAddon>
      </InputGroup>

      <InputGroup>
        <InputGroupInput placeholder="Username" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>@example.com</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}

// Input Group - With Buttons
function InputGroupWithButtons() {
  const [showPassword, setShowPassword] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState('')

  return (
    <div className="space-y-4">
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <InputGroupText>
            <MagnifyingGlassIcon />
          </InputGroupText>
        </InputGroupAddon>
        <InputGroupInput
          placeholder="Search..."
          value={searchValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value)}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="icon-xs" onClick={() => setSearchValue('')}>
            <XIcon />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>

      <InputGroup>
        <InputGroupInput type={showPassword ? 'text' : 'password'} placeholder="Enter password" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="icon-xs" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>

      <InputGroup>
        <InputGroupInput placeholder="Enter your message" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="xs" variant="default">
            <PaperPlaneRightIcon />
            Send
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}

// Input Group - Both Sides
function InputGroupBothSides() {
  return (
    <div className="space-y-4">
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="example.com" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>.com</InputGroupText>
        </InputGroupAddon>
      </InputGroup>

      <InputGroup>
        <InputGroupAddon align="inline-start">
          <InputGroupText>
            <AtIcon />
          </InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="username" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="xs">Verify</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>

      <InputGroup>
        <InputGroupAddon align="inline-start">
          <InputGroupText>
            <CurrencyDollarIcon />
          </InputGroupText>
        </InputGroupAddon>
        <InputGroupInput type="number" placeholder="0.00" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>USD</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}

// Input Group - Block Alignment
function InputGroupBlockAlignment() {
  return (
    <div className="space-y-4">
      <InputGroup>
        <InputGroupAddon align="block-start">
          <Label className="text-fg">Description</Label>
        </InputGroupAddon>
        <InputGroupInput placeholder="Enter description..." />
      </InputGroup>

      <InputGroup>
        <InputGroupInput placeholder="Enter comment..." />
        <InputGroupAddon align="block-end">
          <InputGroupText>Character count: 0/500</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}

// Input Group - States
function InputGroupStates() {
  return (
    <div className="space-y-4">
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <InputGroupText>
            <EnvelopeIcon />
          </InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="Default state" />
      </InputGroup>

      <InputGroup data-disabled="true">
        <InputGroupAddon align="inline-start">
          <InputGroupText>
            <EnvelopeIcon />
          </InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="Disabled state" disabled />
      </InputGroup>

      <InputGroup>
        <InputGroupAddon align="inline-start">
          <InputGroupText>
            <EnvelopeIcon />
          </InputGroupText>
        </InputGroupAddon>
        <InputGroupInput
          placeholder="Invalid state"
          aria-invalid="true"
          defaultValue="invalid@email"
        />
      </InputGroup>
    </div>
  )
}

export function InputSection() {
  return (
    <div className="grid gap-8">
      <PlaygroundCard title="Basic Input" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          A simple input field with placeholder text.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <BasicInput />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Input Types" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          Different HTML input types with appropriate validation and keyboard behaviors.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <InputTypes />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Input States" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          Inputs can be in different states: default, disabled, or invalid.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <InputStates />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Controlled Input" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          A controlled input where the value is managed by React state.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <ControlledInput />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Input with Labels" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          Inputs paired with labels and helper text for better accessibility.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <InputWithLabels />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="File Input" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          File input for uploading single or multiple files.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <FileInput />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Input Group - Inline Start" categoryTitle="Composition">
        <Typography type="body" className="text-muted-foreground mb-4">
          Input groups with icons or text at the start (left side) of the input field.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <InputGroupInlineStart />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Input Group - Inline End" categoryTitle="Composition">
        <Typography type="body" className="text-muted-foreground mb-4">
          Input groups with icons or text at the end (right side) of the input field.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <InputGroupInlineEnd />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Input Group - With Buttons" categoryTitle="Composition">
        <Typography type="body" className="text-muted-foreground mb-4">
          Input groups with interactive buttons for actions like clearing, toggling visibility, or
          submitting.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <InputGroupWithButtons />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Input Group - Both Sides" categoryTitle="Composition">
        <Typography type="body" className="text-muted-foreground mb-4">
          Input groups with addons on both sides for complex input scenarios.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <InputGroupBothSides />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Input Group - Block Alignment" categoryTitle="Composition">
        <Typography type="body" className="text-muted-foreground mb-4">
          Input groups with addons positioned above (block-start) or below (block-end) the input.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <InputGroupBlockAlignment />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Input Group - States" categoryTitle="Composition">
        <Typography type="body" className="text-muted-foreground mb-4">
          Input groups in different states: default, disabled, and invalid.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <InputGroupStates />
        </div>
      </PlaygroundCard>
    </div>
  )
}
