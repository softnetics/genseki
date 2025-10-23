'use client'

import { use } from 'react'

import { IconBulletFill } from '@intentui/icons'
import { OTPInput, OTPInputContext } from 'input-otp'
import { twMerge } from 'tailwind-merge'

/**
 * @deprecated
 */
type InputOTOPProps = React.ComponentProps<typeof OTPInput>
const InputOTP = ({
  className,
  autoFocus = true,
  containerClassName,
  ref,
  ...props
}: InputOTOPProps) => (
  <OTPInput
    data-1p-ignore
    ref={ref}
    autoFocus={autoFocus}
    containerClassName={twMerge(
      'flex items-center gap-2 has-disabled:opacity-50',
      containerClassName
    )}
    className={twMerge(
      'mt-auto h-[2.5rem] bg-surface-incorrect-hover disabled:cursor-not-allowed',
      className
    )}
    {...props}
  />
)

/**
 * @deprecated
 */
type InputOTPGroupProps = React.ComponentProps<'div'>

/**
 * @deprecated
 */
const InputOTPGroup = ({ className, ref, ...props }: InputOTPGroupProps) => (
  <div ref={ref} className={twMerge('flex items-center gap-x-1.5', className)} {...props} />
)

/**
 * @deprecated
 */
interface InputOTPSlotProps extends React.ComponentProps<'div'> {
  index: number
}

/**
 * @deprecated
 */
const InputOTPSlot = ({ index, className, ref, ...props }: InputOTPSlotProps) => {
  const inputOTPContext = use(OTPInputContext)
  const slot = inputOTPContext.slots[index]

  if (!slot) {
    throw new Error('Slot not found')
  }

  const { char, hasFakeCaret, isActive } = slot

  return (
    <div
      ref={ref}
      className={twMerge(
        'border-input relative flex size-10 items-center justify-center rounded-md border text-sm tabular-nums transition-all',
        isActive && 'border-ring/70 ring-ring/20 z-10 ring-4',
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="animate-caret-blink bg-fg h-4 w-px duration-1000" />
        </div>
      )}
    </div>
  )
}

/**
 * @deprecated
 */
type InputOTPSeparatorProps = React.ComponentProps<'div'>
/**
 * @deprecated
 */
const InputOTPSeparator = ({ ref, ...props }: InputOTPSeparatorProps) => (
  <div ref={ref} {...props}>
    <IconBulletFill className="size-2" />
  </div>
)

export type { InputOTOPProps, InputOTPGroupProps, InputOTPSeparatorProps, InputOTPSlotProps }
export { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot }
