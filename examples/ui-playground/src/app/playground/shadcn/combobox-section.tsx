import React from 'react'

import {
  Button,
  ComboboxCommandEmpty,
  ComboboxCommandGroup,
  ComboboxCommandInput,
  ComboboxCommandItem,
  ComboboxCommandList,
  ComboboxContent,
  ComboboxProvider,
  ComboboxTrigger,
} from '@genseki/react'
import { Typography } from '@genseki/react'

import { PlaygroundCard } from '~/src/components/card'

const frameworks = [
  {
    value: 'next.js',
    label: 'Next.js',
  },
  {
    value: 'sveltekit',
    label: 'SvelteKit',
  },
  {
    value: 'nuxt.js',
    label: 'Nuxt.js',
  },
  {
    value: 'remix',
    label: 'Remix',
  },
  {
    value: 'astro',
    label: 'Astro',
  },
]

const languages = [
  { value: 'typescript', label: 'TypeScript' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'rust', label: 'Rust' },
  { value: 'go', label: 'Go' },
  { value: 'java', label: 'Java' },
  { value: 'csharp', label: 'C#' },
  { value: 'ruby', label: 'Ruby' },
]

// Basic Combobox Example
function BasicCombobox() {
  return (
    <ComboboxProvider items={frameworks}>
      <ComboboxTrigger className="w-[200px]" />
      <ComboboxContent>
        <ComboboxCommandInput />
        <ComboboxCommandEmpty>No framework found.</ComboboxCommandEmpty>
        <ComboboxCommandList>
          <ComboboxCommandGroup>
            {({ items }) => {
              return items.map((framework) => (
                <ComboboxCommandItem
                  key={framework.value}
                  value={framework.value}
                  label={framework.label}
                />
              ))
            }}
          </ComboboxCommandGroup>
        </ComboboxCommandList>
      </ComboboxContent>
    </ComboboxProvider>
  )
}

// Controlled Combobox Example
function ControlledCombobox() {
  const [value, setValue] = React.useState<string | null>(null)
  const [open, setOpen] = React.useState(false)

  return (
    <div className="space-y-4">
      <ComboboxProvider
        items={languages}
        open={open}
        onOpenChange={setOpen}
        value={value ?? undefined}
        onValueChange={setValue}
      >
        <ComboboxTrigger className="w-[250px]" />
        <ComboboxContent>
          <ComboboxCommandInput />
          <ComboboxCommandEmpty>No language found.</ComboboxCommandEmpty>
          <ComboboxCommandList>
            <ComboboxCommandGroup>
              {({ items }) => {
                return items.map((language) => (
                  <ComboboxCommandItem
                    key={language.value}
                    value={language.value}
                    label={language.label}
                  />
                ))
              }}
            </ComboboxCommandGroup>
          </ComboboxCommandList>
        </ComboboxContent>
      </ComboboxProvider>

      <div className="flex gap-2 items-center">
        <Typography type="caption" className="text-muted-foreground">
          Selected: {value || 'None'}
        </Typography>
        <div className="inline-flex gap-x-4">
          <Button size="sm" variant="outline" onClick={() => setValue('')}>
            Clear
          </Button>
          <Button size="sm" variant="outline" onClick={() => setValue('typescript')}>
            TypeScript
          </Button>
        </div>
      </div>
    </div>
  )
}

// Custom Trigger Combobox Example
function CustomTriggerCombobox() {
  return (
    <ComboboxProvider items={frameworks}>
      <ComboboxTrigger>
        {(selectedItem) => (
          <Button variant="secondary" className="w-[250px] justify-between">
            {selectedItem ? (
              <span>🚀 {selectedItem.label}</span>
            ) : (
              <span className="text-muted-foreground">Pick a framework</span>
            )}
            <span className="ml-2">▼</span>
          </Button>
        )}
      </ComboboxTrigger>
      <ComboboxContent>
        <ComboboxCommandInput />
        <ComboboxCommandEmpty>No framework found.</ComboboxCommandEmpty>
        <ComboboxCommandList>
          <ComboboxCommandGroup>
            {({ items }) => {
              return items.map((framework) => (
                <ComboboxCommandItem
                  key={framework.value}
                  value={framework.value}
                  label={framework.label}
                />
              ))
            }}
          </ComboboxCommandGroup>
        </ComboboxCommandList>
      </ComboboxContent>
    </ComboboxProvider>
  )
}

export function ComboboxSection() {
  return (
    <div className="grid gap-8">
      <PlaygroundCard title="Basic Combobox" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          A simple combobox with default styling and behavior.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <BasicCombobox />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Controlled Combobox" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          A controlled combobox where you can manage the selected value externally.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <ControlledCombobox />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Custom Trigger" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          A combobox with a custom trigger using a render prop.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <CustomTriggerCombobox />
        </div>
      </PlaygroundCard>
    </div>
  )
}
