'use client'

import { useState } from 'react'

import { GithubLogo } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'

import { Button } from '~/intentui/ui/button'
import { Tabs } from '~/intentui/ui/tab'
import { useRootContext } from '~/providers/root'
import { cn } from '~/utils/cn'

import EmailRegisterForm from './_components/email-form'
import PhoneRegisterForm from './_components/phone-form'

import { TermAndPrivacy } from '../../_components/term-and-privacy'

export default function RegisterRightPanel() {
  const { clientConfig } = useRootContext()
  const emailEnabled = clientConfig.auth?.login?.emailAndPassword?.enabled
  const phoneEnabled = clientConfig.auth?.login?.phoneNumber?.enabled

  const isSingleEnabled = (emailEnabled ? 1 : 0) + (phoneEnabled ? 1 : 0) === 1
  const [tabsState, setTabsState] = useState(emailEnabled ? 'email' : 'phone')

  return (
    <div className="relative flex w-full items-center justify-center p-6 md:w-1/2">
      <div className="flex h-full w-full max-w-sm flex-col space-y-6">
        <div className="absolute right-16 top-16 text-right text-sm">
          <Link href="./login" className="text-muted-foreground text-md hover:underline">
            Login
          </Link>
        </div>
        <div className="my-auto flex flex-col gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Create an account</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              {tabsState === 'email' && 'Register using your email address'}
              {tabsState === 'phone' && 'Register using your phone number'}
            </p>
          </div>

          <Tabs
            aria-label="Register Method"
            className="my-auto"
            defaultSelectedKey="email"
            selectedKey={tabsState}
            onSelectionChange={(key) => setTabsState(key.toString())}
          >
            <Tabs.List className={cn(isSingleEnabled && 'border-0')}>
              {emailEnabled && !isSingleEnabled && (
                <Tabs.Tab
                  className="text-md mx-auto w-full items-center justify-center text-center"
                  id="email"
                >
                  Email
                </Tabs.Tab>
              )}
              {phoneEnabled && !isSingleEnabled && (
                <Tabs.Tab
                  className="text-md mx-auto w-full items-center justify-center text-center"
                  id="phone"
                >
                  Phone
                </Tabs.Tab>
              )}
            </Tabs.List>

            {emailEnabled && (
              <Tabs.Panel id="email">
                <EmailRegisterForm />
              </Tabs.Panel>
            )}
            {phoneEnabled && (
              <Tabs.Panel id="phone">
                <PhoneRegisterForm />
              </Tabs.Panel>
            )}
          </Tabs>

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
