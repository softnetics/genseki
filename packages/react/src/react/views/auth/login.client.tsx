'use client'

import { Link, TextField } from '../../components'
import { SubmitButton } from '../../components/compound/submit-button'
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

    // TODO: Pass redirect from context
    // redirect('../collections')
  }

  return (
    <form className="flex flex-col space-y-8 flex-1" action={login}>
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
    </form>
  )
}
