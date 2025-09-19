'use client'

import { forwardRef, useCallback, useEffect, useRef, useState } from 'react'
import type { DialogProps, DialogTriggerProps, ModalOverlayProps } from 'react-aria-components'
import {
  composeRenderProps,
  DialogTrigger as DialogTriggerPrimitive,
  Modal as ModalPrimitive,
  ModalOverlay,
} from 'react-aria-components'

import { tv, type VariantProps } from 'tailwind-variants'

import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogCloseIcon,
  DialogDescription,
  type DialogDescriptionProps,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  type DialogTitleProps,
  DialogTrigger,
} from './dialog'

const Modal = (props: DialogTriggerProps) => {
  return <DialogTriggerPrimitive {...props} />
}

const modalOverlayStyles = tv({
  base: [
    'fixed top-0 left-0 isolate z-50 h-(--visual-viewport-height) w-full',
    'flex items-end justify-end bg-fg/15 text-center sm:block dark:bg-bg/40',
    '[--visual-viewport-vertical-padding:16px] sm:[--visual-viewport-vertical-padding:32px]',
  ],
  variants: {
    isBlurred: {
      true: 'bg-bg supports-backdrop-filter:bg-bg/15 supports-backdrop-filter:backdrop-blur dark:supports-backdrop-filter:bg-bg/40',
    },
    isEntering: {
      true: 'fade-in animate-in duration-200 ease-out',
    },
    isExiting: {
      true: 'fade-out animate-out ease-in',
    },
  },
})
const modalContentStyles = tv({
  base: [
    'max-h-full w-full rounded-t-2xl bg-white text-left align-middle text-overlay-fg shadow-lg ring-1 ring-fg/5 border border-bluegray-300',
    'overflow-hidden sm:rounded-2xl dark:ring-border',
    'sm:-translate-x-1/2 sm:-translate-y-1/2 sm:fixed sm:top-1/2 sm:left-[50vw]',
  ],
  variants: {
    isEntering: {
      true: [
        'fade-in slide-in-from-bottom animate-in duration-200 ease-out',
        'sm:zoom-in-95 sm:slide-in-from-bottom-0',
      ],
    },
    isExiting: {
      true: [
        'slide-out-to-bottom sm:slide-out-to-bottom-0 sm:zoom-out-95 animate-out duration-150 ease-in',
      ],
    },
    size: {
      xs: 'sm:max-w-xs',
      sm: 'sm:max-w-sm',
      md: 'sm:max-w-md',
      lg: 'sm:max-w-lg',
      xl: 'sm:max-w-xl',
      '2xl': 'sm:max-w-2xl',
      '3xl': 'sm:max-w-3xl',
      '4xl': 'sm:max-w-4xl',
      '5xl': 'sm:max-w-5xl',
    },
  },
  defaultVariants: {
    size: 'lg',
  },
})

interface ModalContentProps
  extends Omit<ModalOverlayProps, 'className' | 'children'>,
    Pick<DialogProps, 'aria-label' | 'aria-labelledby' | 'role' | 'children'>,
    VariantProps<typeof modalContentStyles> {
  closeButton?: boolean
  isBlurred?: boolean
  classNames?: {
    overlay?: ModalOverlayProps['className']
    content?: ModalOverlayProps['className']
  }
}

const ModalContent = ({
  classNames,
  isDismissable: isDismissableInternal,
  isBlurred = false,
  children,
  size,
  role = 'dialog',
  closeButton = true,
  ...props
}: ModalContentProps) => {
  const isDismissable = isDismissableInternal ?? role !== 'alertdialog'
  const modalPrimiveiRef = useRef<HTMLDivElement>(null)
  const [shakeFlag, setShakeFlag] = useState(false)

  const handleAnimationEnd = useCallback(() => {
    modalPrimiveiRef.current?.classList.remove('shake')
  }, [])

  useEffect(() => {
    const hasShakeClass = modalPrimiveiRef.current?.classList.contains('shake')

    if (!hasShakeClass) modalPrimiveiRef.current?.classList.add('shake')

    modalPrimiveiRef.current?.addEventListener('animationend', handleAnimationEnd)
    return () => {
      modalPrimiveiRef.current?.removeEventListener('animationend', handleAnimationEnd)
    }
  }, [shakeFlag])

  const playShake = () => setShakeFlag((prev) => !prev)

  return (
    <div
      aria-hidden
      onClick={(e) => {
        const target = e.target as HTMLElement

        if (target.dataset?.overlay && !isDismissable) playShake()

        e.stopPropagation()
      }}
    >
      <ModalOverlay
        data-overlay
        isDismissable={isDismissable}
        className={composeRenderProps(classNames?.overlay, (className, renderProps) =>
          modalOverlayStyles({
            ...renderProps,
            isBlurred,
            className,
          })
        )}
        {...props}
      >
        <ModalPrimitive
          ref={modalPrimiveiRef}
          isDismissable={isDismissable}
          className={composeRenderProps(classNames?.content, (className, renderProps) =>
            modalContentStyles({
              ...renderProps,
              size,
              className,
            })
          )}
          {...props}
        >
          <Dialog role={role}>
            {(values) => (
              <>
                {typeof children === 'function' ? children(values) : children}
                {closeButton && (
                  <DialogCloseIcon size="md" variant="ghost" isDismissable={isDismissable} />
                )}
              </>
            )}
          </Dialog>
        </ModalPrimitive>
      </ModalOverlay>
    </div>
  )
}

const ModalTitle = forwardRef<HTMLHeadingElement, DialogTitleProps>(
  function ModalTitle(props, ref) {
    return <DialogTitle ref={ref} className="text-bluegray-800" {...props} />
  }
)

const ModalDescription = forwardRef<HTMLDivElement, DialogDescriptionProps>(
  function ModalDescription(props, ref) {
    return <DialogDescription ref={ref} className="text-text-secondary" {...props} />
  }
)

export {
  Modal,
  DialogBody as ModalBody,
  DialogClose as ModalClose,
  ModalContent,
  ModalDescription,
  DialogFooter as ModalFooter,
  DialogHeader as ModalHeader,
  ModalTitle,
  DialogTrigger as ModalTrigger,
}
