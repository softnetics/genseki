'use client'

import * as React from 'react'

import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot, Typography } from '@genseki/ui'

import { PlaygroundCard } from '~/src/components/card'

// Basic Input OTP
function BasicInputOtp() {
  const [value, setValue] = React.useState('')

  return (
    <div className="space-y-4">
      <InputOTP maxLength={6} value={value} onChange={setValue}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <Typography type="body" className="text-text-secondary">
        Value: {value || 'Empty'}
      </Typography>
    </div>
  )
}

// 4-digit OTP
function FourDigitOtp() {
  const [value, setValue] = React.useState('')

  return (
    <div className="space-y-4">
      <InputOTP maxLength={4} value={value} onChange={setValue}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
        </InputOTPGroup>
      </InputOTP>
      <Typography type="body" className="text-text-secondary">
        Value: {value || 'Empty'}
      </Typography>
    </div>
  )
}

// 8-digit OTP with separators
function EightDigitOtp() {
  const [value, setValue] = React.useState('')

  return (
    <div className="space-y-4">
      <InputOTP maxLength={8} value={value} onChange={setValue}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={6} />
          <InputOTPSlot index={7} />
        </InputOTPGroup>
      </InputOTP>
      <Typography type="body" className="text-text-secondary">
        Value: {value || 'Empty'}
      </Typography>
    </div>
  )
}

// Disabled OTP
function DisabledOtp() {
  return (
    <div className="space-y-4">
      <InputOTP maxLength={6} disabled>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <Typography type="body" className="text-text-secondary">
        This OTP input is disabled and cannot be interacted with.
      </Typography>
    </div>
  )
}

// Invalid OTP
function InvalidOtp() {
  const [value, setValue] = React.useState('')

  return (
    <div className="space-y-4">
      <InputOTP maxLength={6} value={value} onChange={setValue}>
        <InputOTPGroup>
          <InputOTPSlot aria-invalid index={0} />
          <InputOTPSlot aria-invalid index={1} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot aria-invalid index={2} />
          <InputOTPSlot aria-invalid index={3} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot aria-invalid index={4} />
          <InputOTPSlot aria-invalid index={5} />
        </InputOTPGroup>
      </InputOTP>
      <Typography type="body" className="text-text-secondary">
        This OTP input has an invalid state with error styling.
      </Typography>
    </div>
  )
}

// OTP with validation
function ValidatedOtp() {
  const [value, setValue] = React.useState('')
  const [isValid, setIsValid] = React.useState<boolean | null>(null)

  React.useEffect(() => {
    if (value.length === 6) {
      // Simulate validation - in real app, this would be an API call
      const isValidCode = value === '123456'
      setIsValid(isValidCode)
    } else {
      setIsValid(null)
    }
  }, [value])

  return (
    <div className="space-y-4">
      <InputOTP
        maxLength={6}
        value={value}
        onChange={setValue}
        aria-invalid={isValid === false ? 'true' : 'false'}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <div className="space-y-2">
        <Typography type="body" className="text-text-secondary">
          Value: {value || 'Empty'}
        </Typography>
        {isValid === true && (
          <Typography type="body" className="text-text-correct">
            ✓ Valid code!
          </Typography>
        )}
        {isValid === false && (
          <Typography type="body" className="text-text-incorrect">
            ✗ Invalid code. Try 123456
          </Typography>
        )}
      </div>
    </div>
  )
}

// OTP with custom separator
function CustomSeparatorOtp() {
  const [value, setValue] = React.useState('')

  return (
    <div className="space-y-4">
      <InputOTP maxLength={6} value={value} onChange={setValue}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
        </InputOTPGroup>
        <InputOTPSeparator>
          <span className="text-muted-foreground">•</span>
        </InputOTPSeparator>
        <InputOTPGroup>
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
        </InputOTPGroup>
        <InputOTPSeparator>
          <span className="text-muted-foreground">•</span>
        </InputOTPSeparator>
        <InputOTPGroup>
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <Typography type="body" className="text-text-secondary">
        Value: {value || 'Empty'}
      </Typography>
    </div>
  )
}

// OTP with different sizes
function DifferentSizesOtp() {
  const [value1, setValue1] = React.useState('')
  const [value2, setValue2] = React.useState('')

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Typography type="caption" weight="medium">
          Small Size
        </Typography>
        <InputOTP maxLength={4} value={value1} onChange={setValue1}>
          <InputOTPGroup>
            <InputOTPSlot index={0} className="h-12 w-12" />
            <InputOTPSlot index={1} className="h-12 w-12" />
            <InputOTPSlot index={2} className="h-12 w-12" />
            <InputOTPSlot index={3} className="h-12 w-12" />
          </InputOTPGroup>
        </InputOTP>
      </div>

      <div className="space-y-2">
        <Typography type="caption" weight="medium">
          Default Size
        </Typography>
        <InputOTP maxLength={4} value={value2} onChange={setValue2}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
          </InputOTPGroup>
        </InputOTP>
      </div>

      <Typography type="body" className="text-text-secondary">
        Small: {value1 || 'Empty'} | Default: {value2 || 'Empty'}
      </Typography>
    </div>
  )
}

export function InputOtpSection() {
  return (
    <div className="grid gap-8">
      <PlaygroundCard title="Basic Input OTP" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          A 6-digit OTP input with separators and value tracking.
        </Typography>
        <div className="p-4 bg-secondary w-full rounded-lg">
          <BasicInputOtp />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="4-Digit OTP" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          A simple 4-digit OTP input without separators.
        </Typography>
        <div className="p-4 bg-secondary w-full rounded-lg">
          <FourDigitOtp />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="8-Digit OTP" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          An 8-digit OTP input with multiple separators for longer codes.
        </Typography>
        <div className="p-4 bg-secondary w-full rounded-lg">
          <EightDigitOtp />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Disabled OTP" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          Disabled OTP input that cannot be interacted with.
        </Typography>
        <div className="p-4 bg-secondary w-full rounded-lg">
          <DisabledOtp />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Invalid OTP" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          OTP input in invalid state with error styling.
        </Typography>
        <div className="p-4 bg-secondary w-full rounded-lg">
          <InvalidOtp />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Validated OTP" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          OTP input with real-time validation. Try entering 123456 for a valid code.
        </Typography>
        <div className="p-4 bg-secondary w-full rounded-lg">
          <ValidatedOtp />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Custom Separator" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          OTP input with custom bullet point separators instead of dashes.
        </Typography>
        <div className="p-4 bg-secondary w-full rounded-lg">
          <CustomSeparatorOtp />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Different Sizes" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          OTP inputs in different sizes: small and default.
        </Typography>
        <div className="p-4 bg-secondary w-full rounded-lg">
          <DifferentSizesOtp />
        </div>
      </PlaygroundCard>
    </div>
  )
}
