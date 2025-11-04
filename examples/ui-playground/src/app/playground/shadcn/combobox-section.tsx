import React, { useState } from 'react'

import { CheckIcon, UserIcon } from '@phosphor-icons/react'

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
  ComboboxTriggerMultiValue,
  InputGroup,
  InputGroupAddon,
  InputGroupControl,
  InputGroupText,
  Typography,
} from '@genseki/react/v2'

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
  {
    value: 'solidjs',
    label: 'SolidJS',
  },
  {
    value: 'vue',
    label: 'Vue',
  },
  {
    value: 'angular',
    label: 'Angular',
  },
  {
    value: 'ember',
    label: 'Ember',
  },
  {
    value: 'react',
    label: 'React',
  },
  {
    value: 'backbone',
    label: 'Backbone',
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

function BasicComboboxMultiple() {
  const [flag, setFlag] = useState(false)
  const [items, setItems] = useState(frameworks)

  return (
    <div>
      <div className="flex space-x-4">
        <button
          onClick={() => setFlag((prev) => !prev)}
          className="px-8 py-4 bg-yellow-500 text-white rounded-md mb-4 cursor-pointer"
        >
          Toggle re-rendering
        </button>
        <button
          className="px-8 py-4 bg-blue-500 text-white rounded-md mb-4 cursor-pointer"
          onClick={() => {
            setItems((prev) => {
              // Generate a random alphabet letter for value and label
              const alphabet = 'abcdefghijklmnopqrstuvwxyz'
              const randomChar = alphabet[Math.floor(Math.random() * alphabet.length)]
              return [
                ...prev,
                {
                  value: randomChar + Math.floor(Math.random() * 100),
                  label: randomChar.toUpperCase(),
                },
              ]
            })
          }}
        >
          append item
        </button>
        <button
          className="px-8 py-4 bg-red-500 text-white rounded-md mb-4 cursor-pointer"
          onClick={() => {
            setItems([
              {
                value: 'next.js',
                label: 'Next.js',
              },
              {
                value: 'sveltekit',
                label: 'SvelteKit',
              },
            ])
          }}
        >
          Reset items
        </button>
      </div>
      <ComboboxProvider items={items} multipleItems={true}>
        <ComboboxTriggerMultiValue className="w-[200px]" />
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
    </div>
  )
}

function BasicComboboxSingle() {
  return (
    <ComboboxProvider items={frameworks}>
      <ComboboxTrigger className="w-[200px]" disabled={false /* You can disable the trigger */} />
      <ComboboxContent>
        <ComboboxCommandInput disabled={false} />
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
function ControlledComboboxMultiple() {
  const [items, setItems] = useState(frameworks)
  const [value, setValue] = React.useState<string[]>([])
  const [open, setOpen] = React.useState(false)

  // console.log('value:', value)
  // console.log('items:', items)

  return (
    <div className="space-y-4">
      <button
        className="px-8 py-4 bg-blue-500 text-white rounded-md mb-4 cursor-pointer"
        onClick={() => {
          setItems((prev) => {
            // Generate a random alphabet letter for value and label
            const alphabet = 'abcdefghijklmnopqrstuvwxyz'
            const randomChar = alphabet[Math.floor(Math.random() * alphabet.length)]
            return [
              ...prev,
              {
                value: randomChar + Math.floor(Math.random() * 100),
                label: randomChar.toUpperCase(),
              },
            ]
          })
        }}
      >
        append item
      </button>
      <button
        className="px-8 py-4 bg-red-500 text-white rounded-md mb-4 cursor-pointer ml-4"
        onClick={() => {
          setItems([
            {
              value: 'next.js',
              label: 'Next.js',
            },
            {
              value: 'sveltekit',
              label: 'SvelteKit',
            },
          ])
        }}
      >
        Reset items
      </button>
      <ComboboxProvider
        items={items}
        open={open}
        onOpenChange={setOpen}
        value={value}
        onValueChange={setValue}
        multipleItems
      >
        <ComboboxTriggerMultiValue
          disabled={false /* You can disable the trigger */}
          className="w-[250px]"
        />
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
          Selected: {JSON.stringify(value)}
        </Typography>
        <div className="inline-flex gap-x-4">
          <Button size="sm" variant="outline" onClick={() => setValue([])}>
            Clear
          </Button>
          <Button size="sm" variant="outline" onClick={() => setValue(['sveltekit'])}>
            Svelete Kit
          </Button>
        </div>
      </div>
    </div>
  )
}

// Controlled Combobox Example
function ControlledComboboxSingle() {
  const [items, setItems] = useState(frameworks)
  const [value, setValue] = React.useState<string[]>([])
  const [open, setOpen] = React.useState(false)

  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <button
          className="px-8 py-4 bg-blue-500 text-white rounded-md mb-4 cursor-pointer"
          onClick={() => {
            setItems((prev) => {
              // Generate a random alphabet letter for value and label
              const alphabet = 'abcdefghijklmnopqrstuvwxyz'
              const randomChar = alphabet[Math.floor(Math.random() * alphabet.length)]
              return [
                ...prev,
                {
                  value: randomChar + Math.floor(Math.random() * 100),
                  label: randomChar.toUpperCase(),
                },
              ]
            })
          }}
        >
          append item
        </button>
        <button
          className="px-8 py-4 bg-red-500 text-white rounded-md mb-4 cursor-pointer"
          onClick={() => {
            setItems([
              {
                value: 'next.js',
                label: 'Next.js',
              },
              {
                value: 'sveltekit',
                label: 'SvelteKit',
              },
            ])
          }}
        >
          Reset items
        </button>
      </div>
      <ComboboxProvider
        items={items}
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
          {JSON.stringify(value)}
        </Typography>
        <div className="inline-flex gap-x-4">
          <Button size="sm" variant="outline" onClick={() => setValue([])}>
            Clear
          </Button>
          <Button size="sm" variant="outline" onClick={() => setValue(['typescript'])}>
            TypeScript
          </Button>
        </div>
      </div>
    </div>
  )
}

function ControlledInputGroupComboboxSingle() {
  const [value, setValue] = React.useState<string[]>([])
  const [open, setOpen] = React.useState(false)

  return (
    <div className="space-y-4">
      <div className="flex">
        <InputGroup>
          <ComboboxProvider
            items={languages}
            open={open}
            onOpenChange={setOpen}
            value={value ?? undefined}
            onValueChange={setValue}
          >
            <InputGroupAddon align="inline-start">
              <InputGroupText>
                <UserIcon />
              </InputGroupText>
            </InputGroupAddon>
            <InputGroupControl>
              <ComboboxTrigger>
                <div className="py-4 px-6">
                  <Typography>{value || 'Please select item'}</Typography>
                </div>
              </ComboboxTrigger>
            </InputGroupControl>
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
        </InputGroup>
      </div>
      <div className="flex gap-2 items-center">
        <Typography type="caption" className="text-muted-foreground">
          {JSON.stringify(value)}
        </Typography>
        <div className="inline-flex gap-x-4">
          <Button size="sm" variant="outline" onClick={() => setValue([])}>
            Clear
          </Button>
          <Button size="sm" variant="outline" onClick={() => setValue(['typescript'])}>
            TypeScript
          </Button>
        </div>
      </div>
    </div>
  )
}

// Custom Trigger Combobox Example
function CustomTriggerComboboxMultiple() {
  return (
    <ComboboxProvider items={frameworks} multipleItems>
      <ComboboxTriggerMultiValue>
        {(selectedItems) => (
          <Button
            disabled={false}
            variant="secondary"
            className="w-[250px] grid [grid-template-columns:1fr_1fr] gap-2 p-2 border-primary border disabled:border-muted"
          >
            {selectedItems?.map((selectedItem) => (
              <span
                key={selectedItem.value}
                className="bg-primary text-primary-fg min-h-[2rem] rounded-md inline-flex items-center justify-start gap-2"
              >
                <span className="w-20 flex justify-end">
                  <CheckIcon />
                </span>
                {selectedItem.label}
              </span>
            )) || 'Empty value'}
          </Button>
        )}
      </ComboboxTriggerMultiValue>
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

// Custom Trigger Combobox Example
function CustomTriggerComboboxSingle() {
  return (
    <ComboboxProvider items={frameworks}>
      <ComboboxTrigger>
        {(selectedItem) => (
          <Button variant="outline" className="w-[250px] justify-between">
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
      <PlaygroundCard title="Basic Combobox (Multiple selection)" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          A simple combobox with default styling and mbehavior.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <BasicComboboxMultiple />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Basic Combobox (Single selection)" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          A simple combobox with default styling and behavior.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <BasicComboboxSingle />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Controlled Combobox (Multiple selection)" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          A controlled combobox where you can manage the selected value externally.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <ControlledComboboxMultiple />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Controlled Combobox (Single selection)" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          A controlled combobox where you can manage the selected value externally.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <ControlledComboboxSingle />
        </div>
      </PlaygroundCard>

      <PlaygroundCard
        title="Input group controlled Combobox (Single selection)"
        categoryTitle="Component"
      >
        <Typography type="body" className="text-muted-foreground mb-4">
          A controlled combobox with input group.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <ControlledInputGroupComboboxSingle />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Custom Trigger (Multiple selection)" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          A combobox with a custom trigger using a render prop.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <CustomTriggerComboboxMultiple />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Custom Trigger (Single selection)" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          A combobox with a custom trigger using a render prop.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <CustomTriggerComboboxSingle />
        </div>
      </PlaygroundCard>
    </div>
  )
}
