'use server'

import { getServerConfig } from './server-context'

export const signInAction = async (formData: FormData) => {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const serverConfig = getServerConfig()

  const context = serverConfig.context
  const signIn = serverConfig.endpoints.signInEmail.handler

  // await signIn({ context: context, body: { email, password } })
}
