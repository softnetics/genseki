'use client'

import * as React from 'react'
import { forwardRef, useEffect, useRef } from 'react'
import type { HeadingProps as AriaHeadingProps } from 'react-aria-components'
import {
  Button as AriaButtonPrimitive,
  Dialog as AriaDialogPrimitive,
  Heading,
  Text,
} from 'react-aria-components'

import { XIcon } from '@phosphor-icons/react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { twJoin, twMerge } from 'tailwind-merge'

import { AriaButton, type AriaButtonProps } from './button'
import { composeTailwindRenderProps } from './primitive'

import { BaseIcon } from '../../components/primitives/base-icon'
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
const AriaDialog = ({
  role = 'dialog',
  className,
  ...props
}: React.ComponentProps<typeof AriaDialogPrimitive>) => {
  return (
    <AriaDialogPrimitive
      role={role}
      className={twMerge(
        'peer/dialog group/dialog outline-hidden relative flex max-h-[inherit] flex-col overflow-hidden [scrollbar-width:thin] [&::-webkit-scrollbar]:size-0.5',
        className
      )}
      {...props}
    />
  )
}
/**
 * @deprecated
 */
const AriaDialogTrigger = (props: AriaButtonProps) => <AriaButton {...props} />
/**
 * @deprecated
 */
type AriaDialogHeaderProps = React.HTMLAttributes<HTMLDivElement> & {
  title?: string
  description?: string
}
/**
 * @deprecated
 */
const AriaDialogHeader = ({ className, ...props }: AriaDialogHeaderProps) => {
  const headerRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const header = headerRef.current
    if (!header) {
      return
    }

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        header.parentElement?.style.setProperty(
          '--dialog-header-height',
          `${entry.target.clientHeight}px`
        )
      }
    })

    observer.observe(header)
    return () => observer.unobserve(header)
  }, [])

  return (
    <div
      data-slot="dialog-header"
      ref={headerRef}
      className={twMerge(
        'relative flex flex-col gap-0.5 sm:gap-1 p-6 pt-8 sm:p-10 sm:pt-10 [&[data-slot=dialog-header]:has(+[data-slot=dialog-footer])]:pb-0',
        className
      )}
    >
      {props.title && <AriaDialogTitle>{props.title}</AriaDialogTitle>}
      {props.description && <AriaDialogDescription>{props.description}</AriaDialogDescription>}
      {!props.title && typeof props.children === 'string' ? (
        <AriaDialogTitle {...props}>
          <>{props.children}</>
        </AriaDialogTitle>
      ) : (
        <>{props.children}</>
      )}
    </div>
  )
}
/**
 * @deprecated
 */
interface AriaDialogTitleProps extends Omit<AriaHeadingProps, 'level'> {
  level?: 1 | 2 | 3 | 4
  ref?: React.Ref<HTMLHeadingElement>
}
/**
 * @deprecated
 */
const AriaDialogTitle = forwardRef<HTMLHeadingElement, AriaDialogTitleProps>(function Title(
  { level = 3, className, ...props },
  ref
) {
  return (
    <Heading
      slot="title"
      level={level}
      ref={ref}
      className={twMerge(
        twJoin(
          'text-fg flex flex-1 items-center',
          level === 1 && 'text-lg font-semibold sm:text-xl',
          level === 2 && 'text-lg font-semibold sm:text-lg',
          level === 3 && 'text-base font-semibold sm:text-base',
          level === 4 && 'text-base font-semibold sm:text-base'
        ),
        className
      )}
      {...props}
    />
  )
})
/**
 * @deprecated
 */
type AriaDialogDescriptionProps = React.ComponentProps<'div'>
/**
 * @deprecated
 */
const AriaDialogDescription = forwardRef<HTMLElement, AriaDialogDescriptionProps>(
  function Description({ className, ...props }, ref) {
    return (
      <Text
        slot="description"
        className={twMerge('text-muted-fg text-sm', className)}
        ref={ref}
        {...props}
      >
        <>{props.children}</>
      </Text>
    )
  }
)

/**
 * @deprecated
 */
type AriaDialogBodyProps = React.ComponentProps<'div'>

/**
 * @deprecated
 */
const AriaDialogBody = ({ className, ref, ...props }: AriaDialogBodyProps) => (
  <div
    data-slot="dialog-body"
    ref={ref}
    className={twMerge(
      'isolate flex max-h-[calc(var(--visual-viewport-height)-var(--visual-viewport-vertical-padding)-var(--dialog-header-height,0px)-var(--dialog-footer-height,0px))] flex-1 flex-col overflow-auto px-4 py-1 sm:px-6',
      className
    )}
    {...props}
  />
)
/**
 * @deprecated
 */
type AriaDialogFooterProps = React.ComponentProps<'div'>
/**
 * @deprecated
 */
const AriaDialogFooter = ({ className, ...props }: AriaDialogFooterProps) => {
  const footerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const footer = footerRef.current

    if (!footer) {
      return
    }

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        footer.parentElement?.style.setProperty(
          '--dialog-footer-height',
          `${entry.target.clientHeight}px`
        )
      }
    })

    observer.observe(footer)
    return () => {
      observer.unobserve(footer)
    }
  }, [])
  return (
    <div
      ref={footerRef}
      data-slot="dialog-footer"
      className={twMerge(
        'isolate mt-auto flex flex-col-reverse justify-between gap-3 sm:flex-row p-6 sm:p-10',
        className
      )}
      {...props}
    />
  )
}

/**
 * @deprecated
 */
const AriaDialogClose = forwardRef<HTMLButtonElement, AriaButtonProps>(function Close(
  { className, size = 'md', variant = 'vanish', ...props },
  ref
) {
  return (
    <AriaButton
      slot="close"
      className={className}
      ref={ref}
      size={size}
      variant={variant}
      {...props}
    />
  )
})

/**
 * @deprecated
 */
interface AriaCloseButtonIndicatorProps extends Omit<AriaButtonProps, 'children'> {
  className?: string
  isDismissable?: boolean | undefined
}

/**
 * @deprecated
 */
const AriaDialogCloseIndicator = ({ className, ...props }: AriaCloseButtonIndicatorProps) => {
  const isMobile = useMediaQuery('(max-width: 600px)')
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (isMobile && buttonRef.current) {
      buttonRef.current.focus()
    }
  }, [isMobile])
  return props.isDismissable ? (
    <AriaButtonPrimitive
      ref={buttonRef}
      {...(isMobile ? { autoFocus: true } : {})}
      aria-label="Close"
      slot="close"
      className={composeTailwindRenderProps(
        className,
        'close hover:bg-secondary focus:bg-secondary focus:outline-hidden focus-visible:ring-primary absolute right-1 top-1 z-50 grid size-12 place-content-center rounded-xl focus-visible:ring-1 sm:right-2 sm:top-2 sm:size-7 sm:rounded-md'
      )}
    >
      <BaseIcon icon={XIcon} size="sm" weight="bold" />
    </AriaButtonPrimitive>
  ) : null
}

/**
 * @deprecated
 */
const AriaDialogCloseIcon = ({ className, ...props }: AriaCloseButtonIndicatorProps) => {
  const isMobile = useMediaQuery('(max-width: 600px)')
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (isMobile && buttonRef.current) {
      buttonRef.current.focus()
    }
  }, [isMobile])
  return props.isDismissable ? (
    <AriaButton
      ref={buttonRef}
      {...(isMobile ? { autoFocus: true } : {})}
      aria-label="Close"
      slot="close"
      className={composeTailwindRenderProps(
        className,
        'close absolute top-4 right-4 z-50 grid size-8 place-content-center rounded-full hover:bg-secondary focus:bg-secondary focus:outline-hidden focus-visible:ring-1 focus-visible:ring-primary sm:top-5 sm:right-5 sm:size-8 sm:rounded-md'
      )}
      {...props}
    >
      <BaseIcon icon={XIcon} size="sm" weight="bold" />
    </AriaButton>
  ) : null
}

export type {
  AriaCloseButtonIndicatorProps,
  AriaDialogBodyProps,
  AriaDialogDescriptionProps,
  AriaDialogFooterProps,
  AriaDialogHeaderProps,
  AriaDialogTitleProps,
}

export {
  AriaDialog,
  AriaDialogBody,
  AriaDialogClose,
  AriaDialogCloseIcon,
  AriaDialogCloseIndicator,
  AriaDialogDescription,
  AriaDialogFooter,
  AriaDialogHeader,
  AriaDialogTitle,
  AriaDialogTrigger,
}

/**
 *
 * Shadcn component
 *
 */
function Dialog({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({ ...props }: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({ ...props }: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50',
        className
      )}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean
}) {
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-8 rounded-lg border p-12 shadow-lg duration-200 sm:max-w-lg',
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-8 right-8 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-4 focus:ring-offset-4 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-8"
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-header"
      className={cn('flex flex-col gap-4 text-center sm:text-left', className)}
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn('flex flex-col-reverse gap-4 sm:flex-row sm:justify-end', className)}
      {...props}
    />
  )
}

function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn('text-lg leading-none font-semibold', className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
