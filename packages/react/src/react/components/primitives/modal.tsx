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
  AriaDialog,
  AriaDialogBody,
  AriaDialogClose,
  AriaDialogCloseIcon,
  AriaDialogDescription,
  type AriaDialogDescriptionProps,
  AriaDialogFooter,
  AriaDialogHeader,
  AriaDialogTitle,
  type AriaDialogTitleProps,
  AriaDialogTrigger,
} from './dialog'

/**
 * @deprecated
 */
const AriaModal = (props: DialogTriggerProps) => {
  return <DialogTriggerPrimitive {...props} />
}

/**
 * @deprecated
 */
const ariaModalOverlayStyles = tv({
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

/**
 * @deprecated
 */
const ariaModalContentStyles = tv({
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

/**
 * @deprecated
 */
interface AriaModalContentProps
  extends Omit<ModalOverlayProps, 'className' | 'children'>,
    Pick<DialogProps, 'aria-label' | 'aria-labelledby' | 'role' | 'children'>,
    VariantProps<typeof ariaModalContentStyles> {
  closeButton?: boolean
  isBlurred?: boolean
  classNames?: {
    overlay?: ModalOverlayProps['className']
    content?: ModalOverlayProps['className']
  }
}

/**
 * @deprecated
 */
const AriaModalContent = ({
  classNames,
  isDismissable: isDismissableInternal,
  isBlurred = false,
  children,
  size,
  role = 'dialog',
  closeButton = true,
  ...props
}: AriaModalContentProps) => {
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
          ariaModalOverlayStyles({
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
            ariaModalContentStyles({
              ...renderProps,
              size,
              className,
            })
          )}
          {...props}
        >
          <AriaDialog role={role}>
            {(values) => (
              <>
                {typeof children === 'function' ? children(values) : children}
                {closeButton && (
                  <AriaDialogCloseIcon size="md" variant="ghost" isDismissable={isDismissable} />
                )}
              </>
            )}
          </AriaDialog>
        </ModalPrimitive>
      </ModalOverlay>
    </div>
  )
}

/**
 * @deprecated
 */
const AriaModalTitle = forwardRef<HTMLHeadingElement, AriaDialogTitleProps>(
  function ModalTitle(props, ref) {
    return <AriaDialogTitle ref={ref} className="text-bluegray-800" {...props} />
  }
)

/**
 * @deprecated
 */
const AriaModalDescription = forwardRef<HTMLDivElement, AriaDialogDescriptionProps>(
  function ModalDescription(props, ref) {
    return <AriaDialogDescription ref={ref} className="text-text-secondary" {...props} />
  }
)

export {
  AriaModal,
  AriaDialogBody as AriaModalBody,
  AriaDialogClose as AriaModalClose,
  AriaModalContent,
  AriaModalDescription,
  AriaDialogFooter as AriaModalFooter,
  AriaDialogHeader as AriaModalHeader,
  AriaModalTitle,
  AriaDialogTrigger as AriaModalTrigger,
}
