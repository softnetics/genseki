import { useMutation } from '@tanstack/react-query'

interface UseDelete {
  slug: string
  onSuccess: () => Promise<void> | void
  onError: () => Promise<void> | void
}
export const useCollectionDelete = (args: UseDelete) => {
  const deleteMutation = useMutation({
    mutationKey: ['DELETE', `/api/${args.slug}`],
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
    onSuccess: async () => {
      await args.onSuccess()
    },
    onError: async () => {
      await args.onError()
    },
  })

  return deleteMutation
}
