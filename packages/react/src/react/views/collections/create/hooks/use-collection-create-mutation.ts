import { type MutationOptions, useMutation } from '@tanstack/react-query'

import { useCollection } from '../../context'
import type { BaseData } from '../../types'

class CollectionCreateError extends Error {
  constructor(
    public readonly status: number,
    message?: string
  ) {
    super(message)
  }
}

type Response = {
  status: number
  body: BaseData
}

interface UseCollectionCreateMutationParams<
  T,
  TMutationOptions extends MutationOptions<Response, CollectionCreateError, T> = MutationOptions<
    Response,
    CollectionCreateError,
    T
  >,
> {
  slug?: string
  onSuccess?: TMutationOptions['onSuccess']
  onError?: TMutationOptions['onError']
  onMutate?: TMutationOptions['onMutate']
}

export const useCollectionCreateMutation = <T>({
  slug: customSlug,
  onSuccess,
  onError,
  onMutate,
}: UseCollectionCreateMutationParams<T>) => {
  const context = useCollection()

  const slug = customSlug ?? context.slug

  return useMutation<Response, CollectionCreateError, T>({
    mutationKey: ['POST', `/${slug}`],
    mutationFn: async (data) => {
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
          typeof errorBody === 'object' && errorBody && errorBody.body.message
            ? errorBody.body.message
            : typeof errorBody === 'string' && errorBody
              ? errorBody
              : 'Failed to create'
        throw new CollectionCreateError(response.status, errorMessage)
      }
      return response.json()
    },
    onSuccess,
    onError,
    onMutate,
  })
}
