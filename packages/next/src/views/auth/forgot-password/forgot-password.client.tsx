'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { InputEmailSection } from './_components/input-email-section'
import { Step } from './types'

import { useServerFunction } from '../../../providers/root'

export function ForgotPasswordClientForm() {
  const serverFunction = useServerFunction()

  const router = useRouter()

  const [step, setStep] = useState<Step>(Step.INPUT_EMAIL)

  const [email, setEmail] = useState<string | null>(null)

  switch (step) {
    case Step.INPUT_EMAIL:
      return (
        <InputEmailSection
          onNext={async (email) => {
            console.log('Email submitted:', email)
            const response = await serverFunction({
              method: 'auth.sendEmailResetPassword',
              body: {
                email,
              },
              headers: {},
              query: {},
              pathParams: {},
            })

            if (response.status !== 200) {
              return {
                status: response.status,
                errormessage: response.body.status || 'Failed to send OTP',
              }
            }

            setEmail(email)
            setStep(Step.COMPLETED)

            return {
              status: response.status,
            }
          }}
        />
      )
    case Step.COMPLETED:
      return (
        <div>
          <p className="text-center text-md text-gray-500">
            An OTP has been sent to <strong>{email}</strong>. Please check your email to continue.
          </p>
        </div>
      )
    default:
      return null
  }
}
