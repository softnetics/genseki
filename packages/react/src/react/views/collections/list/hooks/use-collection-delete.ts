import { type DefaultError, useMutation } from '@tanstack/react-query'

export interface UseDelete {
  slug: string
  onSuccess: (data: any) => Promise<void> | void
  onError: (error: DefaultError) => Promise<void> | void
}
export function useCollectionDeleteMutation(args: UseDelete) {
  const deleteMutation = useMutation({
    mutationKey: ['DELETE', `/${args.slug}`],
    mutationFn: async (selectedRowIds: string[]) => {
      const res = await fetch(`/api/${args.slug}`, {
        method: 'DELETE',
        body: JSON.stringify({ ids: selectedRowIds }),
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.message || 'Failed to delete items')
      }
      return data
    },
    onSuccess: async (data) => {
      await args.onSuccess(data)
    },
    onError: async (error) => {
      await args.onError(error)
    },
  })

  return deleteMutation
}
