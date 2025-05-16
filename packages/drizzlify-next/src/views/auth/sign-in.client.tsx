'use client'

import { redirect } from 'next/navigation'

import { SubmitButton } from '~/components/submit-button'
import { useServerFunction } from '~/providers/root'

interface SignInViewProps {}

export function SignInClientForm(props: SignInViewProps) {
  const serverFunction = useServerFunction()

  async function action(formData: FormData) {
    'use server'
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (password !== confirmPassword) {
      throw new Error('Passwords do not match')
    }

    await serverFunction('auth.signInEmail', {
      body: { email, password },
    })

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
