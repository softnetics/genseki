'use client'

import { useState } from 'react'

import { GithubLogo } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Button } from '~/intentui/ui/button'
import { Tabs } from '~/intentui/ui/tab'
import { useRootContext } from '~/providers/root'
import { cn } from '~/utils/cn'

import { InputEmailSection } from './_components/input-email-section'
import { InputOtpSection } from './_components/input-otp-section'
import { InputPhoneSection } from './_components/input-phone-section'

import { TermAndPrivacy } from '../../_components/term-and-privacy'
import { Step } from '../types'

export function ForgotPasswordRightPanel() {
  const router = useRouter()
  const { clientConfig } = useRootContext()

  const emailEnabled = clientConfig.auth?.login?.emailAndPassword?.enabled
  const phoneEnabled = clientConfig.auth?.login?.phoneNumber?.enabled
  const isSingle = Number(phoneEnabled) + Number(emailEnabled) === 1

  const [authType, setAuthType] = useState<'phone' | 'email'>(phoneEnabled ? 'phone' : 'email')
  const [step, setStep] = useState<Step>(Step.INPUT_PHONE)
  const [target, setTarget] = useState<string>('')

  return (
    <div className="relative flex w-full items-center justify-center p-6 md:w-1/2">
      <div className="flex h-full w-full max-w-sm flex-col space-y-6">
        <div className="absolute right-16 top-16 text-right text-sm">
          <Link href="./login" className="text-muted-foreground text-md hover:underline">
            Back to Login
          </Link>
        </div>
        <div className="my-auto flex flex-col gap-4">
          <div>
            <h2 className="text-2xl font-semibold">
              {step === Step.INPUT_PHONE ? 'Forgot Password' : 'Enter OTP'}
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              {step === Step.INPUT_PHONE
                ? authType === 'phone'
                  ? 'Enter your phone number to receive an OTP'
                  : 'Enter your email to receive an OTP'
                : `${authType === 'phone' ? 'Phone number' : 'Email'} ending with ${target.slice(-4)}`}
            </p>
          </div>

          {(() => {
            switch (step) {
              case Step.INPUT_PHONE:
                return (
                  <Tabs
                    selectedKey={authType}
                    onSelectionChange={(key) => setAuthType(key.toString() as 'phone' | 'email')}
                  >
                    <Tabs.List className={cn(isSingle && 'border-0')}>
                      {phoneEnabled && !isSingle && <Tabs.Tab id="phone">Phone</Tabs.Tab>}
                      {emailEnabled && !isSingle && <Tabs.Tab id="email">Email</Tabs.Tab>}
                    </Tabs.List>

                    {phoneEnabled && (
                      <Tabs.Panel id="phone">
                        <InputPhoneSection
                          onNext={(phone) => {
                            setTarget(phone)
                            setAuthType('phone')
                            setStep(Step.INPUT_OTP)
                          }}
                        />
                      </Tabs.Panel>
                    )}

                    {emailEnabled && (
                      <Tabs.Panel id="email">
                        <InputEmailSection
                          onNext={(email) => {
                            setTarget(email)
                            setAuthType('email')
                            setStep(Step.INPUT_OTP)
                          }}
                        />
                      </Tabs.Panel>
                    )}
                  </Tabs>
                )
              case Step.INPUT_OTP:
                return (
                  <InputOtpSection
                    onSuccess={() => router.push(`./reset-password?${authType}=${target}`)}
                  />
                )
              default:
                return null
            }
          })()}

          <div className="flex items-center justify-center gap-4">
            <div className="flex w-full border-b" />
            <span className="text-muted-foreground text-nowrap text-xs">OR CONTINUE WITH</span>
            <div className="flex w-full border-b" />
          </div>
          <Button variant="outline" size="md" className="w-full">
            <GithubLogo className="mr-2 h-8 w-8" /> GitHub
          </Button>
          <TermAndPrivacy />
        </div>
      </div>
    </div>
  )
}
