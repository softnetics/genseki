'use client'

import { useState } from 'react'

import { GithubLogo } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'

import { Button } from '~/intentui/ui/button'
import { Tabs } from '~/intentui/ui/tab'
import { useRootContext } from '~/providers/root'
import { cn } from '~/utils/cn'

import { EmailLoginForm } from './_components/email-form'
import { PhoneLoginForm } from './_components/phone-form'

import { TermAndPrivacy } from '../../_components/term-and-privacy'

interface RightPanelProps {
  action: (formData: FormData) => Promise<any>
}

export function RightPanel({ action }: RightPanelProps) {
  const { clientConfig } = useRootContext()
  const emailAndPasswordEnabled = clientConfig.auth?.login?.emailAndPassword?.enabled
  const phoneNumberEnabled = clientConfig.auth.login?.phoneNumber?.enabled

  const isSingleEnabled = (emailAndPasswordEnabled ? 1 : 0) + (phoneNumberEnabled ? 1 : 0) === 1

  const [tabsState, setTabsState] = useState(
    emailAndPasswordEnabled ? 'email' : phoneNumberEnabled ? 'phone' : 'email'
  )

  return (
    <div className="relative flex w-full items-center justify-center p-6 md:w-1/2">
      <div className="flex h-full w-full max-w-sm flex-col space-y-6">
        <div className="absolute right-16 top-16 text-right text-sm">
          <Link href="./register" className="text-muted-foreground text-md hover:underline">
            Register
          </Link>
        </div>
        <div className="my-auto flex flex-col gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Login</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              {tabsState === 'email' && 'Enter your email and password to sign in'}
              {tabsState === 'phone' && 'Enter your phone number to sign in'}
            </p>
          </div>
          <Tabs
            aria-label="Recipe App"
            className="my-auto"
            defaultSelectedKey="email"
            selectedKey={tabsState}
            onSelectionChange={(key) => {
              setTabsState(key.toString())
            }}
          >
            <Tabs.List className={cn(isSingleEnabled && 'border-0')}>
              {emailAndPasswordEnabled && !isSingleEnabled && (
                <Tabs.Tab
                  className="text-md mx-auto w-full items-center justify-center text-center"
                  id="email"
                >
                  Email
                </Tabs.Tab>
              )}
              {phoneNumberEnabled && !isSingleEnabled && (
                <Tabs.Tab
                  className="text-md mx-auto w-full items-center justify-center text-center"
                  id="phone"
                >
                  Phone
                </Tabs.Tab>
              )}
            </Tabs.List>
            <Tabs.Panel id="email">
              <EmailLoginForm action={action} />
            </Tabs.Panel>
            <Tabs.Panel id="phone">
              <PhoneLoginForm action={action} />
            </Tabs.Panel>
          </Tabs>
          <div className="flex items-center justify-center gap-4">
            <div className="flex w-full border-b" />
            <span className="text-muted-foreground text-nowrap text-xs">OR CONTINUE WITH</span>
            <div className="flex w-full border-b" />
          </div>
          <Button variant="outline" size="md" className="w-full" onPress={() => {}}>
            <GithubLogo className="mr-2 h-8 w-8" /> GitHub
          </Button>
          <TermAndPrivacy />
        </div>
      </div>
    </div>
  )
}
