'use client'

import * as React from 'react'
import type {
  DialogProps as AriaDialogProps,
  DialogTriggerProps as AriaDialogTriggerProps,
  ModalOverlayProps as AriaModalOverlayProps,
} from 'react-aria-components'
import {
  composeRenderProps as ariaComposeRenderProps,
  DialogTrigger as AriaDialogTrigger,
  Modal as AriaModal,
  ModalOverlay as AriaModalOverlay,
} from 'react-aria-components'

import { XIcon } from '@phosphor-icons/react'
import * as SheetPrimitive from '@radix-ui/react-dialog'
import { tv, type VariantProps } from 'tailwind-variants'

import {
  AriaDialog,
  AriaDialogBody,
  AriaDialogClose,
  AriaDialogCloseIndicator,
  AriaDialogDescription,
  AriaDialogFooter,
  AriaDialogHeader,
  AriaDialogTitle,
} from './dialog'

import { cn } from '../../utils/cn'

/**
 *
 * React Aria component
 *
 */

/**
 * @deprecated
 */
const ariaOverlayStyles = tv({
  base: [
    'fixed top-0 left-0 isolate z-50 flex h-(--visual-viewport-height) w-full items-center justify-center bg-fg/15 p-4 dark:bg-bg/40',
  ],
  variants: {
    isBlurred: {
      true: 'bg-bg/15 backdrop-blur dark:bg-bg/40',
    },
    isEntering: {
      true: 'fade-in animate-in duration-300 ease-out',
    },
    isExiting: {
      true: 'fade-out animate-out duration-200 ease-in',
    },
  },
})

/**
 * @deprecated
 */
type AriaSides = 'top' | 'bottom' | 'left' | 'right'

/**
 * @deprecated
 */
const ariaGenerateCompoundVariants = (sides: Array<AriaSides>) => {
  return sides.map((side) => ({
    side,
    isFloat: true,
    className:
      side === 'top'
        ? 'top-2 inset-x-2 rounded-xl ring-1 border-b-0'
        : side === 'bottom'
          ? 'bottom-2 inset-x-2 rounded-xl ring-1 border-t-0'
          : side === 'left'
            ? 'left-2 inset-y-2 rounded-xl ring-1 border-r-0'
            : 'right-2 inset-y-2 rounded-xl ring-1 border-l-0',
  }))
}

/**
 * @deprecated
 */
const ariaContentStyles = tv({
  base: 'fixed z-50 grid gap-4 border-fg/5 bg-overlay text-overlay-fg shadow-lg transition ease-in-out dark:border-border',
  variants: {
    isEntering: {
      true: 'animate-in duration-300 ',
    },
    isExiting: {
      true: 'animate-out duration-200',
    },
    side: {
      top: 'data-entering:slide-in-from-top data-exiting:slide-out-to-top inset-x-0 top-0 rounded-b-2xl border-b',
      bottom:
        'data-entering:slide-in-from-bottom data-exiting:slide-out-to-bottom inset-x-0 bottom-0 rounded-t-2xl border-t',
      left: 'data-entering:slide-in-from-left data-exiting:slide-out-to-left inset-y-0 left-0 h-auto w-full max-w-xs overflow-y-auto border-r',
      right:
        'data-entering:slide-in-from-right data-exiting:slide-out-to-right inset-y-0 right-0 h-auto w-full max-w-xs overflow-y-auto border-l',
    },
    isFloat: {
      false: 'border-fg/20 dark:border-border',
      true: 'ring-fg/5 dark:ring-border',
    },
  },
  compoundVariants: ariaGenerateCompoundVariants(['top', 'bottom', 'left', 'right']),
})

/**
 * @deprecated
 */
interface AriaSheetProps extends AriaDialogTriggerProps {}

/**
 * @deprecated
 */
const AriaSheet = (props: AriaSheetProps) => {
  return <AriaDialogTrigger {...props} />
}

/**
 * @deprecated
 */
interface AriaSheetContentProps
  extends Omit<React.ComponentProps<typeof AriaModal>, 'children' | 'className'>,
    Omit<AriaModalOverlayProps, 'className'>,
    VariantProps<typeof ariaOverlayStyles> {
  'aria-label'?: AriaDialogProps['aria-label']
  'aria-labelledby'?: AriaDialogProps['aria-labelledby']
  role?: AriaDialogProps['role']
  closeButton?: boolean
  isBlurred?: boolean
  isFloat?: boolean
  side?: AriaSides
  classNames?: {
    overlay?: AriaModalOverlayProps['className']
    content?: AriaModalOverlayProps['className']
  }
}

/**
 * @deprecated
 */
const AriaSheetContent = ({
  classNames,
  isBlurred = false,
  isDismissable = true,
  side = 'right',
  role = 'dialog',
  closeButton = true,
  isFloat = true,
  children,
  ...props
}: AriaSheetContentProps) => {
  const _isDismissable = role === 'alertdialog' ? false : isDismissable
  return (
    <AriaModalOverlay
      isDismissable={_isDismissable}
      className={ariaComposeRenderProps(classNames?.overlay, (className, renderProps) => {
        return ariaOverlayStyles({
          ...renderProps,
          isBlurred,
          className,
        })
      })}
      {...props}
    >
      <AriaModal
        className={ariaComposeRenderProps(classNames?.content, (className, renderProps) =>
          ariaContentStyles({
            ...renderProps,
            side,
            isFloat,
            className,
          })
        )}
        {...props}
      >
        {(values) => (
          <AriaDialog role={role} aria-label={props['aria-label'] ?? undefined} className="h-full">
            <>
              {typeof children === 'function' ? children(values) : children}
              {closeButton && (
                <AriaDialogCloseIndicator
                  className="right-4 top-4 p-4"
                  isDismissable={_isDismissable}
                  variant="outline"
                  size="md"
                />
              )}
            </>
          </AriaDialog>
        )}
      </AriaModal>
    </AriaModalOverlay>
  )
}

/**
 * @deprecated
 */
const AriaSheetTrigger = AriaDialogTrigger
/**
 * @deprecated
 */
const AriaSheetFooter = AriaDialogFooter
/**
 * @deprecated
 */
const AriaSheetHeader = AriaDialogHeader
/**
 * @deprecated
 */
const AriaSheetTitle = AriaDialogTitle
/**
 * @deprecated
 */
const AriaSheetDescription = AriaDialogDescription
/**
 * @deprecated
 */
const AriaSheetBody = AriaDialogBody
/**
 * @deprecated
 */
const AriaSheetClose = AriaDialogClose

export type { AriaSheetContentProps, AriaSheetProps, AriaSides }
export {
  AriaSheet,
  AriaSheetBody,
  AriaSheetClose,
  AriaSheetContent,
  AriaSheetDescription,
  AriaSheetFooter,
  AriaSheetHeader,
  AriaSheetTitle,
  AriaSheetTrigger,
}

/**
 *
 * Shadcn component
 *
 */

function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

function SheetTrigger({ ...props }: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose({ ...props }: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetPortal({ ...props }: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50',
        className
      )}
      {...props}
    />
  )
}

function SheetContent({
  className,
  children,
  side = 'right',
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: 'top' | 'right' | 'bottom' | 'left'
}) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        className={cn(
          'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-8 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500',
          side === 'right' &&
            'data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm',
          side === 'left' &&
            'data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm',
          side === 'top' &&
            'data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b',
          side === 'bottom' &&
            'data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t',
          className
        )}
        {...props}
      >
        {children}
        <SheetPrimitive.Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-8 right-8 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-4 focus:ring-offset-4 focus:outline-hidden disabled:pointer-events-none">
          <XIcon className="size-8" />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPortal>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div data-slot="sheet-header" className={cn('flex flex-col gap-3 p-8', className)} {...props} />
  )
}

function SheetFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn('mt-auto flex flex-col gap-4 p-8', className)}
      {...props}
    />
  )
}

function SheetTitle({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn('text-foreground font-semibold', className)}
      {...props}
    />
  )
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
}
