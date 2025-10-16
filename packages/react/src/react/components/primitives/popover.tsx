'use client'

import React from 'react'
import type {
  DialogProps,
  DialogTriggerProps,
  ModalOverlayProps,
  PopoverProps as PopoverPrimitiveProps,
} from 'react-aria-components'
import {
  composeRenderProps,
  DialogTrigger as DialogTrigger,
  Modal,
  ModalOverlay,
  OverlayArrow,
  Popover as PopoverPrimitive,
  PopoverContext,
  useSlottedContext,
} from 'react-aria-components'

import { twMerge } from 'tailwind-merge'
import { tv } from 'tailwind-variants'

import type {
  DialogBodyProps,
  DialogFooterProps,
  DialogHeaderProps,
  DialogTitleProps,
} from './dialog'
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './dialog'

import { useMediaQuery } from '../../hooks/use-media-query'

/**
 *
 * React Aria component
 *
 */

/**
 * @deprecated
 */
interface PopoverProps extends DialogTriggerProps {}

/**
 * @deprecated
 */
const Popover = (props: PopoverProps) => {
  return <DialogTrigger {...props} />
}

/**
 * @deprecated
 */
const PopoverTitle = React.forwardRef<HTMLHeadingElement, DialogTitleProps>(
  ({ className, ...props }, ref) => (
    <DialogTitle ref={ref} className={twMerge('sm:leading-none', className)} {...props} />
  )
)
PopoverTitle.displayName = 'PopoverTitle'

/**
 * @deprecated
 */
const PopoverHeader = ({ className, ...props }: DialogHeaderProps) => (
  <DialogHeader className={twMerge('sm:p-4', className)} {...props} />
)

/**
 * @deprecated
 */
const PopoverFooter = ({ className, ...props }: DialogFooterProps) => (
  <DialogFooter className={twMerge('sm:p-4', className)} {...props} />
)

/**
 * @deprecated
 */
const PopoverBody = ({ className, ref, ...props }: DialogBodyProps) => (
  // TODO: Fix type error with ref
  <DialogBody ref={ref as any} className={twMerge('sm:px-4 sm:pt-2', className)} {...props} />
)

/**
 * @deprecated
 */
const content = tv({
  base: [
    'peer/popover-content max-w-xs rounded-md border bg-overlay bg-clip-padding text-overlay-fg shadow-xs transition-transform [scrollbar-width:thin] sm:max-w-3xl sm:text-sm dark:backdrop-saturate-200 forced-colors:bg-[Canvas] [&::-webkit-scrollbar]:size-0.5',
  ],
  variants: {
    isPicker: {
      true: 'max-h-72 min-w-(--trigger-width) overflow-y-auto',
      false: 'min-w-80',
    },
    isMenu: {
      true: '',
    },
    isEntering: {
      true: [
        'fade-in animate-in duration-150 ease-out',
        'data-[placement=left]:slide-in-from-right-1 data-[placement=right]:slide-in-from-left-1 data-[placement=top]:slide-in-from-bottom-1 data-[placement=bottom]:slide-in-from-top-1',
      ],
    },
    isExiting: {
      true: [
        'fade-out animate-out duration-100 ease-in',
        'data-[placement=left]:slide-out-to-right-1 data-[placement=right]:slide-out-to-left-1 data-[placement=top]:slide-out-to-bottom-1 data-[placement=bottom]:slide-out-to-top-1',
      ],
    },
  },
})

/**
 * @deprecated
 */
const drawer = tv({
  base: [
    'fixed top-auto bottom-0 z-50 max-h-full w-full max-w-2xl border border-b-transparent bg-overlay outline-hidden',
  ],
  variants: {
    isMenu: {
      true: 'rounded-t-xl p-0 [&_[role=dialog]]:*:not-has-[[data-slot=dialog-body]]:px-1',
      false: 'rounded-t-2xl',
    },
    isEntering: {
      true: [
        '[transition:transform_0.5s_cubic-bezier(0.32,_0.72,_0,_1)] [will-change:transform]',
        'fade-in-0 slide-in-from-bottom-56 animate-in duration-200',
        '[transition:translate3d(0,_100%,_0)]',
        'sm:slide-in-from-bottom-auto sm:slide-in-from-top-[20%]',
      ],
    },
    isExiting: {
      true: 'slide-out-to-bottom-56 animate-out duration-200 ease-in',
    },
  },
})

/**
 * @deprecated
 */
interface PopoverContentProps
  extends Omit<PopoverPrimitiveProps, 'children' | 'className'>,
    Omit<ModalOverlayProps, 'className' | 'children'>,
    Pick<DialogProps, 'aria-label' | 'aria-labelledby'> {
  children: React.ReactNode
  showArrow?: boolean
  style?: React.CSSProperties
  respectScreen?: boolean
  className?: string | ((values: { defaultClassName?: string }) => string)
}

/**
 * @deprecated
 */
const PopoverContent = ({
  respectScreen = true,
  children,
  showArrow = true,
  className,
  ...props
}: PopoverContentProps) => {
  const isMobile = useMediaQuery('(max-width: 600px)')
  const popoverContext = useSlottedContext(PopoverContext)!
  const isMenuTrigger = popoverContext?.trigger === 'MenuTrigger'
  const isSubmenuTrigger = popoverContext?.trigger === 'SubmenuTrigger'
  const isMenu = isMenuTrigger || isSubmenuTrigger
  const isComboBoxTrigger = popoverContext?.trigger === 'ComboBox'
  const offset = showArrow ? 12 : 8
  const effectiveOffset = isSubmenuTrigger ? offset - 5 : offset
  return isMobile && respectScreen ? (
    <ModalOverlay
      className="h-(--visual-viewport-height) bg-overlay/10 fixed left-0 top-0 isolate z-50 w-full [--visual-viewport-vertical-padding:16px]"
      {...props}
      isDismissable
    >
      <Modal
        className={composeRenderProps(className, (className, renderProps) =>
          drawer({ ...renderProps, isMenu, className })
        )}
      >
        <Dialog role="dialog" aria-label={props['aria-label'] ?? 'List item'}>
          <>{children}</>
        </Dialog>
      </Modal>
    </ModalOverlay>
  ) : (
    <PopoverPrimitive
      offset={effectiveOffset}
      className={composeRenderProps(className, (className, renderProps) =>
        content({
          ...renderProps,
          className,
        })
      )}
      {...props}
    >
      {showArrow && (
        <OverlayArrow className="group">
          <svg
            width={12}
            height={12}
            viewBox="0 0 12 12"
            className="fill-overlay stroke-border block group-data-[placement=bottom]:rotate-180 group-data-[placement=left]:-rotate-90 group-data-[placement=right]:rotate-90 forced-colors:fill-[Canvas] forced-colors:stroke-[ButtonBorder]"
          >
            <path d="M0 0 L6 6 L12 0" />
          </svg>
        </OverlayArrow>
      )}
      {!isComboBoxTrigger ? (
        <Dialog role="dialog" aria-label={props['aria-label'] ?? 'List item'}>
          <> {children}</>
        </Dialog>
      ) : (
        <> {children}</>
      )}
    </PopoverPrimitive>
  )
}

/**
 * @deprecated
 */
const PopoverTrigger = DialogTrigger
/**
 * @deprecated
 */
const PopoverClose = DialogClose
/**
 * @deprecated
 */
const PopoverDescription = DialogDescription

export type { PopoverContentProps, PopoverProps }
export {
  Popover,
  PopoverBody,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverFooter,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
}
