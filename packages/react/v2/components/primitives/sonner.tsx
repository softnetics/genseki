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
  const toastOprions: ToasterProps = {
    ...props,
    icons: {
      success: <CheckCircleIcon weight="fill" className="size-8 text-icon-correct " />,
      info: <InfoIcon weight="fill" className="size-8 text-icon-info" />,
      warning: <WarningIcon weight="fill" className="size-8 text-icon-accent" />,
      error: <WarningCircleIcon weight="fill" className="size-8 text-icon-incorrect" />,
      loading: <SpinnerIcon weight="regular" className="size-8 animate-spin text-text-primary" />,
      ...props.icons,
    },
    toastOptions: {
      ...props.toastOptions,
      className: cn(
        'group/each !gap-0 [&:has([data-description],[data-action],[data-cancel])]:!flex [&:has([data-description],[data-action],[data-cancel])]:!flex-wrap',
        props.toastOptions?.className
      ),
      classNames: {
        ...props.toastOptions?.classNames,
        icon: cn(
          '!m-0 !mr-5 group-[&:has([data-description],[data-action],[data-cancel])]/each:!mb-5',
          props.toastOptions?.classNames?.icon
        ),
        success: cn(
          '!bg-surface-correct !border-border-correct [&:has([data-description],[data-action],[data-cancel])]:!bg-surface-primary',
          '[&_*:where([data-title],[data-description])]:!text-text-correct-bold ', // Title and description styling
          '[&_*[data-cancel]]:!bg-surface-correct [&_*[data-cancel]]:!text-text-correct-bold', // Cancel button styling
          '[&_*[data-action]]:!bg-surface-correct-hover [&_*[data-action]]:!text-text-inverse', // Action button styling
          props.toastOptions?.classNames?.success
        ),
        error: cn(
          '!bg-surface-incorrect !border-border-incorrect [&:has([data-description],[data-action],[data-cancel])]:!bg-surface-primary',
          '[&_*:where([data-title],[data-description])]:!text-text-incorrect-bold ', // Title and description styling
          '[&_*[data-cancel]]:!bg-surface-incorrect [&_*[data-cancel]]:!text-text-incorrect-bold', // Cancel button styling
          '[&_*[data-action]]:!bg-surface-incorrect-hover [&_*[data-action]]:!text-text-inverse', // Action button styling
          props.toastOptions?.classNames?.error
        ),
        warning: cn(
          '!bg-surface-accent !border-border-accent [&:has([data-description],[data-action],[data-cancel])]:!bg-surface-primary',
          '[&_*:where([data-title],[data-description])]:!text-text-accent-bold ', // Title and description styling
          '[&_*[data-cancel]]:!bg-surface-accent [&_*[data-cancel]]:!text-text-accent-bold', // Cancel button styling
          '[&_*[data-action]]:!bg-surface-accent-hover [&_*[data-action]]:!text-text-inverse', // Action button styling
          props.toastOptions?.classNames?.warning
        ),
        info: cn(
          '!bg-surface-info !border-border-info [&:has([data-description],[data-action],[data-cancel])]:!bg-surface-primary',
          '[&_*:where([data-title],[data-description])]:!text-text-info-bold ', // Title and description styling

          '[&_*[data-cancel]]:!bg-surface-info [&_*[data-cancel]]:!text-text-info-bold', // Cancel button styling
          '[&_*[data-action]]:!bg-surface-info-hover [&_*[data-action]]:!text-text-inverse', // Action button styling
          props.toastOptions?.classNames?.info
        ),
        content: cn('!basis-full', props.toastOptions?.classNames?.content), // Content wrap both title and description
        title: cn('!text-base !font-medium', props.toastOptions?.classNames?.title),
        description: cn('!text-base !font-normal', props.toastOptions?.classNames?.description),
        cancelButton: cn('!m-0 !mt-6 !rounded-sm', props.toastOptions?.classNames?.cancelButton),
        actionButton: cn(
          '!m-0 !mt-6 !rounded-sm [button+&]:!ml-6',
          props.toastOptions?.classNames?.actionButton
        ),
      },
      style: {
        '--normal-bg': 'var(--color-popover)',
        '--normal-text': 'var(--color-popover-foreground)',
        '--normal-border': 'var(--color-border)',
        '--border-radius': 'var(--color-radius)',
        ...props.toastOptions?.style,
      } as React.CSSProperties,
    },
  }

  return <Sonner className="toaster group" {...toastOprions} />
}

export { toast, Toaster }
