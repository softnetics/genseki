'use server'

import { handleServerFunction, type ServerFunction } from '@genseki/next'

import { serverConfig } from '~/genseki/config'

export const serverFunction: ServerFunction<typeof serverConfig> = async (args) => {
  return handleServerFunction(serverConfig, args)
}
