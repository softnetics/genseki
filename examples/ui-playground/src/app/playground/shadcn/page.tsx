'use client'
import * as React from 'react'

import Link from 'next/link'

import { Typography } from '@genseki/react'
import { linkVariants } from '@genseki/react/v2'

import { ButtonSection } from './button-section'
import { CollapsibleSection } from './collapsible-section'
import { ComboboxSection } from './combobox-section'
import { DropdownMenuSection } from './dropdown-menu-section'
import { InputSection } from './input-section'
import { LinkSection } from './link-section'
import { TooltipSection } from './tooltip-section'

export default function ComboboxPage() {
  return (
    <div className="flex gap-y-8">
      <div className="flex-1 max-w-4xl flex flex-col gap-y-8 py-16 mx-auto">
        <Typography type="h1" weight="bold">
          Shadcn components
        </Typography>
        <hr />
        <Typography type="h2" weight="bold" id="button">
          Button
        </Typography>
        <ButtonSection />

        <Typography type="h2" weight="bold" id="combobox">
          Combobox
        </Typography>
        <ComboboxSection />

        <Typography type="h2" weight="bold" id="input">
          Input
        </Typography>
        <InputSection />

        <Typography type="h2" weight="bold" id="link">
          Link
        </Typography>
        <LinkSection />

        <Typography type="h2" weight="bold" id="tooltip">
          Tooltip
        </Typography>
        <TooltipSection />

        <Typography type="h2" weight="bold" id="dropdown-menu">
          Dropdown Menu
        </Typography>
        <DropdownMenuSection />

        <Typography type="h2" weight="bold" id="collapsible">
          Collapsible
        </Typography>
        <CollapsibleSection />
      </div>
      <div className="relative bg-card border-l border-border w-[200px]">
        <div className="sticky inset-0 max-h-screen [overscroll-behavior:none] p-4">
          <div className="flex flex-col gap-y-3">
            <Link
              href="#button"
              className={linkVariants({
                className: 'text-text-secondary gayx-24',
                variant: 'plain',
              })}
            >
              {'>'} Button
            </Link>
            <hr />
            <Link
              href="#combobox"
              className={linkVariants({ className: 'text-text-secondary', variant: 'plain' })}
            >
              {'>'} Combobox
            </Link>
            <hr />
            <Link
              href="#input"
              className={linkVariants({ className: 'text-text-secondary', variant: 'plain' })}
            >
              {'>'} Input
            </Link>
            <hr />
            <Link
              href="#link"
              className={linkVariants({ className: 'text-text-secondary', variant: 'plain' })}
            >
              {'>'} Link
            </Link>
            <hr />
            <Link
              href="#tooltip"
              className={linkVariants({ className: 'text-text-secondary', variant: 'plain' })}
            >
              {'>'} Tooltip
            </Link>
            <hr />
            <Link
              href="#dropdown-menu"
              className={linkVariants({ className: 'text-text-secondary', variant: 'plain' })}
            >
              {'>'} Dropdown Menu
            </Link>
            <hr />
            <Link
              href="#collapsible"
              className={linkVariants({ className: 'text-text-secondary', variant: 'plain' })}
            >
              {'>'} Collapsible
            </Link>
            <hr />
            <Link
              href="/playground/shadcn/sidebar"
              className={linkVariants({ className: 'text-text-secondary', variant: 'plain' })}
            >
              {'>'} Sidebar
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
