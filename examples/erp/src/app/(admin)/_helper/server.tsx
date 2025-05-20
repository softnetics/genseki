'use server'

import { handleServerFunction, type ServerFunction } from '@kivotos/next'

import { serverConfig } from '~/drizzlify/config'

export const serverFunction: ServerFunction<typeof serverConfig> = async (args) => {
  return handleServerFunction(serverConfig, args)
}
