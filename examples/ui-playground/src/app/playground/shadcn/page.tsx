'use client'
import * as React from 'react'

import { Typography } from '@genseki/react/v2'

import { ButtonSection } from './button-section'
import { CheckboxSection } from './checkbox-section'
import { CollapsibleSection } from './collapsible-section'
import { CollectionCardSection } from './collection-card-section'
import { ColorPickerSection } from './color-picker-section'
import { ComboboxSection } from './combobox-section'
import { DatePickerSection } from './date-picker-section'
import { DialogSection } from './dialog-section'
import { DropZoneSection } from './drop-zone-section'
import { DropdownMenuSection } from './dropdown-menu-section'
import { InputOtpSection } from './input-otp-section'
import { InputSection } from './input-section'
import { LinkSection } from './link-section'
import PageSidebar from './page-sidebar'
import { PaginationSection } from './pagination-section'
import { ProgressSection } from './progress-section'
import { RichTextSection } from './rich-text-section'
import { SelectSection } from './select-section'
import { SliderSection } from './slider-section'
import { SwitchSection } from './switch-section'
import { TabsSection } from './tabs-section'
import { TextareaSection } from './textarea-section'
import { ToastSection } from './toast-section'
import { ToggleGroupSection } from './toggle-group-section'
import { ToggleSection } from './toggle-section'
import { TooltipSection } from './tooltip-section'

export default function ComboboxPage() {
  return (
    <div className="bg-background flex gap-y-8">
      <div className="flex-1 max-w-4xl flex flex-col gap-y-8 py-16 mx-auto">
        <Typography type="h1" weight="bold">
          Shadcn components
        </Typography>
        <hr />
        <Typography type="h2" weight="bold" id="button">
          Button
        </Typography>
        <ButtonSection />
        <Typography type="h2" weight="bold" id="checkbox">
          Checkbox
        </Typography>
        <CheckboxSection />
        <Typography type="h2" weight="bold" id="color-picker">
          Color Picker
        </Typography>
        <ColorPickerSection />
        <Typography type="h2" weight="bold" id="combobox">
          Combobox
        </Typography>
        <ComboboxSection />
        <Typography type="h2" weight="bold" id="date-picker">
          Date picker
        </Typography>
        <DatePickerSection />
        <Typography type="h2" weight="bold" id="dialog">
          Dialog
        </Typography>
        <DialogSection />
        <Typography type="h2" weight="bold" id="drop-zone">
          Drop Zone
        </Typography>
        <DropZoneSection />
        <Typography type="h2" weight="bold" id="input">
          Input
        </Typography>
        <InputSection />
        <Typography type="h2" weight="bold" id="input-otp">
          Input OTP
        </Typography>
        <InputOtpSection />A
        <Typography type="h2" weight="bold" id="link">
          Link
        </Typography>
        <LinkSection />
        <Typography type="h2" weight="bold" id="pagination">
          Pagination
        </Typography>
        <PaginationSection />
        <Typography type="h2" weight="bold" id="progress">
          Progress
        </Typography>
        <ProgressSection />
        <Typography type="h2" weight="bold" id="select">
          Select
        </Typography>
        <SelectSection />
        <Typography type="h2" weight="bold" id="slider">
          Slider
        </Typography>
        <SliderSection />
        <Typography type="h2" weight="bold" id="switch">
          Switch
        </Typography>
        <SwitchSection />
        <Typography type="h2" weight="bold" id="tabs">
          Tabs
        </Typography>
        <TabsSection />
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
        <Typography type="h2" weight="bold" id="toggle">
          Toggle
        </Typography>
        <ToggleSection />
        <Typography type="h2" weight="bold" id="toggle-group">
          Toggle Group
        </Typography>
        <ToggleGroupSection />
        <Typography type="h2" weight="bold" id="textarea">
          Textarea
        </Typography>
        <TextareaSection />
        <Typography type="h2" weight="bold" id="toast">
          Toast
        </Typography>
        <ToastSection />
        <Typography type="h2" weight="bold" id="rich-text-editor">
          Rich Text Editor
        </Typography>
        <RichTextSection />
        <Typography type="h2" weight="bold" id="collection-card">
          Collection Card
        </Typography>
        <CollectionCardSection />
      </div>
      <React.Suspense fallback={null}>
        <PageSidebar />
      </React.Suspense>
    </div>
  )
}
