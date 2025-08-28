import { useQuery } from '@tanstack/react-query'

import type { FieldOptionsCallbackReturn } from '../../../../core/field'

export function useOptionsHelperQuery(props: {
  optionsFetchPath: string
  optionsName: string
  queryFnBodyValue?: any
  retryCount?: number
}) {
  const query = useQuery<{ status: 200; body: FieldOptionsCallbackReturn }>({
    queryKey: ['POST', props.optionsFetchPath, { pathParams: { name: props.optionsName } }],
    queryFn: async () => {
      const response = await fetch(`/api${props.optionsFetchPath}?name=${props.optionsName}`, {
        method: 'POST',
        body: props.queryFnBodyValue ? JSON.stringify(props.queryFnBodyValue) : undefined,
        headers: { 'Content-Type': 'application/json' },
      })
      if (!response.ok) throw new Error('Failed to fetch options')
      return response.json()
    },
    enabled: false,
    retry: props.retryCount, // defaults is 3
  })
  return { query }
}
