'use server'

import { handleServerFunction, ServerFunction } from '@repo/drizzlify-next'

import { serverConfig } from '~/drizzlify/config'

export const serverFunction: ServerFunction<typeof serverConfig> = async (args) => {
  return handleServerFunction(serverConfig, args)
}
