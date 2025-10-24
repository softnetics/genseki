'use client'

import * as React from 'react'

import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cva, type VariantProps } from 'class-variance-authority'

import { createRequiredContext } from '../../../src/react/hooks/create-required-context'
import { cn } from '../../../src/react/utils/cn'

type Variants = 'default' | 'underline'

const tabListVariants = cva<{ variant: Record<Variants, any> }>(
  'h-18 w-fit items-center justify-center',
  {
    variants: {
      variant: {
        default: 'bg-muted text-muted-foreground inline-flex rounded-lg p-[3px]',
        underline: '',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

const tabVariants = cva<{ variant: Record<Variants, any> }>(
  "inline-flex flex-1 items-center justify-center text-sm font-medium whitespace-nowrap transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-8",
  {
    variants: {
      variant: {
        default:
          'h-[calc(100%-1px)] gap-3 data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:ring-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground rounded-md border border-transparent px-4 py-2 focus-visible:ring-[2px] data-[state=active]:shadow-sm ',
        underline:
          'data-[state=active]:text-primary data-[state=active]:border-primary px-3 pb-5 border-b-[2px] focus-visible:ring-[2px] focus-visible:ring-ring focus-visible:ring-offset-2',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

const [TabsContextProvider, useTabsContext] =
  createRequiredContext<VariantProps<typeof tabVariants>>('Tabs context')

function Tabs({
  className,
  variant,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root> & VariantProps<typeof tabVariants>) {
  return (
    <TabsContextProvider variant={variant}>
      <TabsPrimitive.Root
        data-slot="tabs"
        className={cn('flex flex-col gap-4', className)}
        {...props}
      />
    </TabsContextProvider>
  )
}

function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  const ctx = useTabsContext()

  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(tabListVariants({ variant: ctx.variant }), className)}
      {...props}
    />
  )
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const ctx = useTabsContext()

  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(tabVariants({ variant: ctx.variant }), className)}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn('flex-1 outline-none', className)}
      {...props}
    />
  )
}

export { Tabs, TabsContent, TabsList, TabsTrigger }
