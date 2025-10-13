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
  DialogTrigger as AriaDialogTrigger,
  Modal,
  ModalOverlay,
  OverlayArrow,
  Popover as AriaPopoverPrimitive,
  PopoverContext,
  useSlottedContext,
} from 'react-aria-components'

import * as PopoverPrimitive from '@radix-ui/react-popover'
import { twMerge } from 'tailwind-merge'
import { tv } from 'tailwind-variants'

import type {
  AriaDialogBodyProps,
  AriaDialogFooterProps,
  AriaDialogHeaderProps,
  AriaDialogTitleProps,
} from './dialog'
import {
  AriaDialog,
  AriaDialogBody,
  AriaDialogClose,
  AriaDialogDescription,
  AriaDialogFooter,
  AriaDialogHeader,
  AriaDialogTitle,
} from './dialog'

import { useMediaQuery } from '../../hooks/use-media-query'
import { cn } from '../../utils/cn'

/**
 *
 * React Aria component
 *
 */

/**
 * @deprecated
 */
interface AriaPopoverProps extends DialogTriggerProps {}

/**
 * @deprecated
 */
const AriaPopover = (props: AriaPopoverProps) => {
  return <AriaDialogTrigger {...props} />
}

/**
 * @deprecated
 */
const AriaPopoverTitle = React.forwardRef<HTMLHeadingElement, AriaDialogTitleProps>(
  ({ className, ...props }, ref) => (
    <AriaDialogTitle ref={ref} className={twMerge('sm:leading-none', className)} {...props} />
  )
)
AriaPopoverTitle.displayName = 'PopoverTitle'

/**
 * @deprecated
 */
const AriaPopoverHeader = ({ className, ...props }: AriaDialogHeaderProps) => (
  <AriaDialogHeader className={twMerge('sm:p-4', className)} {...props} />
)

/**
 * @deprecated
 */
const AriaPopoverFooter = ({ className, ...props }: AriaDialogFooterProps) => (
  <AriaDialogFooter className={twMerge('sm:p-4', className)} {...props} />
)

/**
 * @deprecated
 */
const AriaPopoverBody = ({ className, ref, ...props }: AriaDialogBodyProps) => (
  // TODO: Fix type error with ref
  <AriaDialogBody ref={ref as any} className={twMerge('sm:px-4 sm:pt-2', className)} {...props} />
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
interface AriaPopoverContentProps
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
const AriaPopoverContent = ({
  respectScreen = true,
  children,
  showArrow = true,
  className,
  ...props
}: AriaPopoverContentProps) => {
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
        <AriaDialog role="dialog" aria-label={props['aria-label'] ?? 'List item'}>
          <>{children}</>
        </AriaDialog>
      </Modal>
    </ModalOverlay>
  ) : (
    <AriaPopoverPrimitive
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
        <AriaDialog role="dialog" aria-label={props['aria-label'] ?? 'List item'}>
          <> {children}</>
        </AriaDialog>
      ) : (
        <> {children}</>
      )}
    </AriaPopoverPrimitive>
  )
}

/**
 * @deprecated
 */
const AriaPopoverTrigger = AriaDialogTrigger
/**
 * @deprecated
 */
const AriaPopoverClose = AriaDialogClose
/**
 * @deprecated
 */
const AriaPopoverDescription = AriaDialogDescription

export type { AriaPopoverContentProps, AriaPopoverProps }
export {
  AriaPopover,
  AriaPopoverBody,
  AriaPopoverClose,
  AriaPopoverContent,
  AriaPopoverDescription,
  AriaPopoverFooter,
  AriaPopoverHeader,
  AriaPopoverTitle,
  AriaPopoverTrigger,
}

/**
 *
 * Shadcn component
 *
 */

function Popover({ ...props }: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

function PopoverTrigger({ ...props }: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

function PopoverContent({
  className,
  align = 'center',
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-144 origin-(--radix-popover-content-transform-origin) rounded-md border p-8 shadow-md outline-hidden',
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  )
}

function PopoverAnchor({ ...props }: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />
}

export { Popover, PopoverAnchor, PopoverContent, PopoverTrigger }
