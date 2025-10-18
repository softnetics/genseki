'use client'

import * as React from 'react'
import { forwardRef, useEffect, useRef } from 'react'
import type { HeadingProps as AriaHeadingProps } from 'react-aria-components'
import {
  Button as AriaButtonPrimitive,
  Dialog as DialogPrimitive,
  Heading,
  Text,
} from 'react-aria-components'

import { XIcon } from '@phosphor-icons/react'
import { twJoin, twMerge } from 'tailwind-merge'

import { Button, type ButtonProps } from './button'
import { composeTailwindRenderProps } from './primitive'

import { BaseIcon } from '../../components/primitives/base-icon'
import { useMediaQuery } from '../../hooks/use-media-query'

/**
 *
 * React Aria component
 *
 */

/**
 * @deprecated
 */
const Dialog = ({
  role = 'dialog',
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive>) => {
  return (
    <DialogPrimitive
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
const DialogTrigger = (props: ButtonProps) => <Button {...props} />
/**
 * @deprecated
 */
type DialogHeaderProps = React.HTMLAttributes<HTMLDivElement> & {
  title?: string
  description?: string
}
/**
 * @deprecated
 */
const DialogHeader = ({ className, ...props }: DialogHeaderProps) => {
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
      {props.title && <DialogTitle>{props.title}</DialogTitle>}
      {props.description && <DialogDescription>{props.description}</DialogDescription>}
      {!props.title && typeof props.children === 'string' ? (
        <DialogTitle {...props}>
          <>{props.children}</>
        </DialogTitle>
      ) : (
        <>{props.children}</>
      )}
    </div>
  )
}
/**
 * @deprecated
 */
interface DialogTitleProps extends Omit<AriaHeadingProps, 'level'> {
  level?: 1 | 2 | 3 | 4
  ref?: React.Ref<HTMLHeadingElement>
}
/**
 * @deprecated
 */
const DialogTitle = forwardRef<HTMLHeadingElement, DialogTitleProps>(function Title(
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
type DialogDescriptionProps = React.ComponentProps<'div'>
/**
 * @deprecated
 */
const DialogDescription = forwardRef<HTMLElement, DialogDescriptionProps>(function Description(
  { className, ...props },
  ref
) {
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
})

/**
 * @deprecated
 */
type DialogBodyProps = React.ComponentProps<'div'>

/**
 * @deprecated
 */
const DialogBody = ({ className, ref, ...props }: DialogBodyProps) => (
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
type DialogFooterProps = React.ComponentProps<'div'>
/**
 * @deprecated
 */
const DialogFooter = ({ className, ...props }: DialogFooterProps) => {
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
const DialogClose = forwardRef<HTMLButtonElement, ButtonProps>(function Close(
  { className, size = 'md', variant = 'vanish', ...props },
  ref
) {
  return (
    <Button slot="close" className={className} ref={ref} size={size} variant={variant} {...props} />
  )
})

/**
 * @deprecated
 */
interface CloseButtonIndicatorProps extends Omit<ButtonProps, 'children'> {
  className?: string
  isDismissable?: boolean | undefined
}

/**
 * @deprecated
 */
const DialogCloseIndicator = ({ className, ...props }: CloseButtonIndicatorProps) => {
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
        'close hover:bg-secondary focus:bg-secondary focus:outline-hidden focus-visible:ring-primary absolute right-1 top-1 z-50 grid size-12 place-content-center rounded-xl focus-visible:ring-[2px] sm:right-2 sm:top-2 sm:size-7 sm:rounded-md'
      )}
    >
      <BaseIcon icon={XIcon} size="sm" weight="bold" />
    </AriaButtonPrimitive>
  ) : null
}

/**
 * @deprecated
 */
const DialogCloseIcon = ({ className, ...props }: CloseButtonIndicatorProps) => {
  const isMobile = useMediaQuery('(max-width: 600px)')
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (isMobile && buttonRef.current) {
      buttonRef.current.focus()
    }
  }, [isMobile])
  return props.isDismissable ? (
    <Button
      ref={buttonRef}
      {...(isMobile ? { autoFocus: true } : {})}
      aria-label="Close"
      slot="close"
      className={composeTailwindRenderProps(
        className,
        'close absolute top-4 right-4 z-50 grid size-8 place-content-center rounded-full hover:bg-secondary focus:bg-secondary focus:outline-hidden focus-visible:ring-[2px] focus-visible:ring-primary sm:top-5 sm:right-5 sm:size-8 sm:rounded-md'
      )}
      {...props}
    >
      <BaseIcon icon={XIcon} size="sm" weight="bold" />
    </Button>
  ) : null
}

export type {
  CloseButtonIndicatorProps,
  DialogBodyProps,
  DialogDescriptionProps,
  DialogFooterProps,
  DialogHeaderProps,
  DialogTitleProps,
}

export {
  Dialog,
  DialogBody,
  DialogClose,
  DialogCloseIcon,
  DialogCloseIndicator,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
}
