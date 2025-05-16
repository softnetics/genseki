'use client'

import { useState } from 'react'

import { GithubLogo } from '@phosphor-icons/react/dist/ssr'
import type { NextPage } from 'next'
import Link from 'next/link'

import { Button } from '~/intentui/ui/button'
import { Input } from '~/intentui/ui/field'

const RegisterPage: NextPage = () => {
  const [email, setEmail] = useState('')

  const handleEmailSignIn = async () => {
    // await signIn('email', { email, redirect: false })
  }

  return (
    <div className="flex min-h-screen text-white">
      {/* Left Panel */}
      <div className="bg-muted hidden w-1/2 items-center justify-center p-10 md:flex">
        <div>
          <div className="mb-4 text-2xl font-semibold">⌘ Acme Inc</div>
          <blockquote className="text-muted-foreground">
            “This library has saved me countless hours of work and helped me deliver stunning
            designs to my clients faster than ever before.”
            <footer className="text-muted-foreground mt-2 text-sm">— Sofia Davis</footer>
          </blockquote>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex w-full items-center justify-center p-6 md:w-1/2">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-right text-sm">
            <Link href="/login" className="text-muted-foreground hover:underline">
              Login
            </Link>
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Create an account</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Enter your email below to create your account
            </p>
          </div>
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button className="w-full" onClick={handleEmailSignIn}>
              Sign In with Email
            </Button>
          </div>
          <div className="flex items-center justify-center">
            <span className="text-muted-foreground text-xs">OR CONTINUE WITH</span>
          </div>
          อ
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              // signIn('github')
            }}
          >
            <GithubLogo className="mr-2 h-4 w-4" /> GitHub
          </Button>
          <p className="text-muted-foreground text-center text-xs">
            By clicking continue, you agree to our{' '}
            <Link href="/terms" className="underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
