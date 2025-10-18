'use client'

import {
  CheckCircleIcon,
  InfoIcon,
  SpinnerIcon,
  WarningCircleIcon,
  WarningIcon,
} from '@phosphor-icons/react'
import { toast, Toaster as Sonner, type ToasterProps } from 'sonner'

import { cn } from '../../../src/react/utils/cn'

const Toaster = (props: ToasterProps) => {
  console.log(props)
  return (
    <Sonner
      className="toaster group"
      icons={{
        success: <CheckCircleIcon weight="fill" className="size-8 text-icon-correct " />,
        info: <InfoIcon weight="fill" className="size-8 text-icon-info" />,
        warning: <WarningIcon weight="fill" className="size-8 text-icon-accent" />,
        error: <WarningCircleIcon weight="fill" className="size-8 text-icon-incorrect" />,
        loading: <SpinnerIcon weight="regular" className="size-8 animate-spin text-text-primary" />,
      }}
      toastOptions={{
        className:
          'group/each !gap-0 [&:has([data-description],[data-action],[data-cancel])]:!flex [&:has([data-description],[data-action],[data-cancel])]:!flex-wrap',
        classNames: {
          icon: '!m-0 !mr-5 group-[&:has([data-description],[data-action],[data-cancel])]/each:!mb-5',
          success: cn(
            '!bg-surface-correct !border-border-correct [&:has([data-description],[data-action],[data-cancel])]:!bg-surface-primary',
            '[&_*:where([data-title],[data-description])]:!text-text-correct-bold ', // Title and description styling
            '[&_*[data-cancel]]:!bg-surface-correct [&_*[data-cancel]]:!text-text-correct-bold', // Cancel button styling
            '[&_*[data-action]]:!bg-surface-correct-hover [&_*[data-action]]:!text-text-inverse' // Action button styling
          ),
          error: cn(
            '!bg-surface-incorrect !border-border-incorrect [&:has([data-description],[data-action],[data-cancel])]:!bg-surface-primary',
            '[&_*:where([data-title],[data-description])]:!text-text-incorrect-bold ', // Title and description styling
            '[&_*[data-cancel]]:!bg-surface-incorrect [&_*[data-cancel]]:!text-text-incorrect-bold', // Cancel button styling
            '[&_*[data-action]]:!bg-surface-incorrect-hover [&_*[data-action]]:!text-text-inverse' // Action button styling
          ),
          warning: cn(
            '!bg-surface-accent !border-border-accent [&:has([data-description],[data-action],[data-cancel])]:!bg-surface-primary',
            '[&_*:where([data-title],[data-description])]:!text-text-accent-bold ', // Title and description styling
            '[&_*[data-cancel]]:!bg-surface-accent [&_*[data-cancel]]:!text-text-accent-bold', // Cancel button styling
            '[&_*[data-action]]:!bg-surface-accent-hover [&_*[data-action]]:!text-text-inverse' // Action button styling
          ),
          info: cn(
            '!bg-surface-info !border-border-info [&:has([data-description],[data-action],[data-cancel])]:!bg-surface-primary',
            '[&_*:where([data-title],[data-description])]:!text-text-info-bold ', // Title and description styling
            '[&_*[data-cancel]]:!bg-surface-info [&_*[data-cancel]]:!text-text-info-bold', // Cancel button styling
            '[&_*[data-action]]:!bg-surface-info-hover [&_*[data-action]]:!text-text-inverse' // Action button styling
          ),
          content: '!basis-full', // Content wrap both title and description
          title: '!text-base !font-medium',
          description: '!text-base !font-normal',
          cancelButton: '!m-0 !mt-6 !rounded-sm',
          actionButton: '!m-0 !mt-6 !rounded-sm [button+&]:!ml-6',
        },
        style: {
          '--normal-bg': 'var(--color-popover)',
          '--normal-text': 'var(--color-popover-foreground)',
          '--normal-border': 'var(--color-border)',
          '--border-radius': 'var(--color-radius)',
        } as React.CSSProperties,
      }}
      {...props}
    />
  )
}

export { toast, Toaster }
