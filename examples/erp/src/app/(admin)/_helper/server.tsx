'use server'

import { handleServerFunction, type ServerFunction } from '@genseki/react'

import { serverConfig } from '~/drizzlify/config'

export const serverFunction: ServerFunction<typeof serverConfig> = async (args) => {
  return handleServerFunction(serverConfig, args)
}
