'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { InputEmailSection } from './_components/input-email-section'
import { InputOtpSection } from './_components/input-otp-section'
import { Step } from './types'

export function ForgotPasswordClientForm() {
  const router = useRouter()

  const [step, setStep] = useState<Step>(Step.INPUT_EMAIL)

  switch (step) {
    case Step.INPUT_EMAIL:
      return (
        <InputEmailSection
          onNext={(email) => {
            console.log('Email submitted:', email)
            setStep(Step.INPUT_OTP)
          }}
        />
      )
    case Step.INPUT_OTP:
      return <InputOtpSection onSuccess={() => router.push(`./reset-password`)} />
    default:
      return null
  }
}
