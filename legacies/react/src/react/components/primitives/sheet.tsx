'use client'

import * as React from 'react'
import type {
  DialogProps as DialogProps,
  DialogTriggerProps as DialogTriggerProps,
  ModalOverlayProps as ModalOverlayProps,
} from 'react-aria-components'
import {
  composeRenderProps as ariaComposeRenderProps,
  DialogTrigger as DialogTrigger,
  Modal as Modal,
  ModalOverlay as ModalOverlay,
} from 'react-aria-components'

import { tv, type VariantProps } from 'tailwind-variants'

import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogCloseIndicator,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './dialog'

/**
 *
 * React Aria component
 *
 */

/**
 * @deprecated
 */
const overlayStyles = tv({
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
type sides = 'top' | 'bottom' | 'left' | 'right'

/**
 * @deprecated
 */
const generateCompoundVariants = (sides: Array<sides>) => {
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
const contentStyles = tv({
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
  compoundVariants: generateCompoundVariants(['top', 'bottom', 'left', 'right']),
})

/**
 * @deprecated
 */
interface SheetProps extends DialogTriggerProps {}

/**
 * @deprecated
 */
const Sheet = (props: SheetProps) => {
  return <DialogTrigger {...props} />
}

/**
 * @deprecated
 */
interface SheetContentProps
  extends Omit<React.ComponentProps<typeof Modal>, 'children' | 'className'>,
    Omit<ModalOverlayProps, 'className'>,
    VariantProps<typeof overlayStyles> {
  'aria-label'?: DialogProps['aria-label']
  'aria-labelledby'?: DialogProps['aria-labelledby']
  role?: DialogProps['role']
  closeButton?: boolean
  isBlurred?: boolean
  isFloat?: boolean
  side?: sides
  classNames?: {
    overlay?: ModalOverlayProps['className']
    content?: ModalOverlayProps['className']
  }
}

/**
 * @deprecated
 */
const SheetContent = ({
  classNames,
  isBlurred = false,
  isDismissable = true,
  side = 'right',
  role = 'dialog',
  closeButton = true,
  isFloat = true,
  children,
  ...props
}: SheetContentProps) => {
  const _isDismissable = role === 'alertdialog' ? false : isDismissable
  return (
    <ModalOverlay
      isDismissable={_isDismissable}
      className={ariaComposeRenderProps(classNames?.overlay, (className, renderProps) => {
        return overlayStyles({
          ...renderProps,
          isBlurred,
          className,
        })
      })}
      {...props}
    >
      <Modal
        className={ariaComposeRenderProps(classNames?.content, (className, renderProps) =>
          contentStyles({
            ...renderProps,
            side,
            isFloat,
            className,
          })
        )}
        {...props}
      >
        {(values) => (
          <Dialog role={role} aria-label={props['aria-label'] ?? undefined} className="h-full">
            <>
              {typeof children === 'function' ? children(values) : children}
              {closeButton && (
                <DialogCloseIndicator
                  className="right-4 top-4 p-4"
                  isDismissable={_isDismissable}
                  variant="outline"
                  size="md"
                />
              )}
            </>
          </Dialog>
        )}
      </Modal>
    </ModalOverlay>
  )
}

/**
 * @deprecated
 */
const SheetTrigger = DialogTrigger
/**
 * @deprecated
 */
const SheetFooter = DialogFooter
/**
 * @deprecated
 */
const SheetHeader = DialogHeader
/**
 * @deprecated
 */
const SheetTitle = DialogTitle
/**
 * @deprecated
 */
const SheetDescription = DialogDescription
/**
 * @deprecated
 */
const SheetBody = DialogBody
/**
 * @deprecated
 */
const SheetClose = DialogClose

export type { sides as AriaSides, SheetContentProps, SheetProps }
export {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
}
