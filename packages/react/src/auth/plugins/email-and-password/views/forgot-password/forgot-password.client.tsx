'use client'

import { useState } from 'react'

import { toast } from 'sonner'

import { useServerFunction } from '@genseki/react'

import { InputEmailSection } from './_components/input-email-section'
import { Step } from './types'

export function ForgotPasswordClientForm() {
  const serverFunction = useServerFunction()

  const [step, setStep] = useState<Step>(Step.INPUT_EMAIL)

  const [email, setEmail] = useState<string | null>(null)

  switch (step) {
    case Step.INPUT_EMAIL:
      return (
        <InputEmailSection
          onNext={async (email) => {
            const response = await serverFunction(
              'POST /auth/email-and-password/request-reset-password',
              {
                body: {
                  email,
                },
                headers: {},
                query: {},
                pathParams: {},
              }
            )

            if (response.status !== 200) {
              toast.error('Failed to send OTP', {
                // TODO: use response.body.status when available
                // description: response.body.status || 'Failed to send OTP',
                description: 'Failed to send OTP',
              })
              return {
                status: response.status,
                // errormessage: response.body.status || 'Failed to send OTP',
                errorMessage: 'Failed to send OTP',
              }
            }

            toast.success('OTP sent successfully', {
              description: 'Please check your email to continue.',
            })

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
        <p className="text-center text-md text-gray-500">
          An OTP has been sent to <strong>{email}</strong>. Please check your email to continue.
        </p>
      )
    default:
      return null
  }
}
