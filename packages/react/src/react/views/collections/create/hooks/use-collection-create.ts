import { useMutation } from '@tanstack/react-query'

import { useCollection } from '../../context'
import type { BaseData } from '../../types'

export class CollectionCreateError extends Error {
  constructor(
    public readonly status: number,
    message?: string
  ) {
    super(message)
  }
}

export interface UseCollectionCreateMutationParams {
  slug?: string
  onSuccess?: (data: any) => Promise<void> | void
  onError?: (error: CollectionCreateError) => Promise<void> | void
}

export const useCollectionCreateMutation = ({
  slug: customSlug,
  onSuccess,
  onError,
}: UseCollectionCreateMutationParams) => {
  const context = useCollection()

  const slug = customSlug ?? context.slug

  return useMutation<
    {
      status: number
      body: BaseData
    },
    CollectionCreateError
  >({
    mutationKey: ['POST', `/${slug}`],
    mutationFn: async (data: any) => {
      // TODO: This should be provided from App Config
      const response = await fetch(`/api/${slug}`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      })
      if (!response.ok) {
        let errorBody
        try {
          errorBody = await response.json()
        } catch (e) {
          errorBody = await response.text()
        }
        const errorMessage =
          typeof errorBody === 'object' && errorBody && errorBody.message
            ? errorBody.message
            : typeof errorBody === 'string' && errorBody
              ? errorBody
              : 'Failed to create'
        throw new CollectionCreateError(response.status, errorMessage)
      }
      return response.json()
    },
    onSuccess,
    onError,
  })
}
