'use client'

import { createQueryClient } from '@genseki/react-query'
import { createRestClient } from '@genseki/rest'

import type { nextjsApp } from './config'

export const restClient = createRestClient<typeof nextjsApp>({
  baseUrl: '/api',
})

export const queryClient = createQueryClient<typeof nextjsApp>({
  baseUrl: '/api',
})
