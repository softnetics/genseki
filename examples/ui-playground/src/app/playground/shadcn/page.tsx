'use client'
import * as React from 'react'

import Link from 'next/link'

import { Typography } from '@genseki/react'

import { ButtonSection } from './button-section'
import { ComboboxSection } from './combobox-section'
import { InputSection } from './input-section'

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
      </div>
      <div className="relative bg-card border-l border-border w-[200px]">
        <div className="sticky inset-0 max-h-screen [overscroll-behavior:none] p-4">
          <div className="flex flex-col gap-y-4">
            <Link href="#button">{'>'} Button</Link>
            <hr />
            <Link href="#combobox">{'>'} Combobox</Link>
            <hr />
            <Link href="#input">{'>'} Input</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
