'use client'

import Form from 'next/form'
import { redirect } from 'next/navigation'

import { SubmitButton } from '../../components/submit-button'
import { Link } from '../../intentui/ui/link'
import { TextField } from '../../intentui/ui/text-field'
import { useServerFunction } from '../../providers/root'

export function LoginClientForm() {
  const serverFunction = useServerFunction()

  async function login(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const response = await serverFunction({
      method: 'auth.loginEmail',
      body: {
        email,
        password,
      },
      headers: {},
      query: {},
      pathParams: {},
    })

    if (response.status !== 200) {
      console.error('Login failed', response)
      return
    }

    redirect('../collections')
  }

  return (
    <Form className="flex flex-col space-y-8 flex-1" action={login} onSubmit={() => {}}>
      <TextField name="email" type="email" placeholder="email..." label="Email" />
      <TextField
        name="password"
        type="password"
        placeholder="password..."
        label="Password"
        isRevealable
      />
      <SubmitButton>Login</SubmitButton>
      <Link href="./sign-up" intent="primary" className="text-sm">
        Create an account?
      </Link>
    </Form>
  )
}
