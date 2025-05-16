import React from 'react'

import { redirect } from 'next/navigation'

import { ServerConfig } from '@repo/drizzlify'

import { SubmitButton } from '~/components/submit-button'

interface SignInViewProps {
  serverConfig: ServerConfig
}

export function SignInView(props: SignInViewProps) {
  const context = props.serverConfig.context
  const signIn = props.serverConfig.endpoints?.signInEmail.handler

  async function action(formData: FormData) {
    'use server'
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (password !== confirmPassword) {
      throw new Error('Passwords do not match')
    }

    signIn({ context: context, body: { email, password } })

    redirect('/collections')
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sign In</h1>
      <form action={action}>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2 font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block mb-2 font-medium">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block mb-2 font-medium">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <SubmitButton>Sign In</SubmitButton>
      </form>
    </div>
  )
}
