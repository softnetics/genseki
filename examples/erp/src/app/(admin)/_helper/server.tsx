'use server'

import { handleServerFunction, type ServerFunction } from '@genseki/next'

import { nextjsApp } from '../../../../genseki/config'

export const serverFunction: ServerFunction<typeof nextjsApp> = async (method, args) => {
  return handleServerFunction(nextjsApp, method, args)
}
