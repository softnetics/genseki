'use client'

import { useCollectionCreate } from './context'

export function DefaultCollectionCreatePage() {
  const {
    components: { CreateFormLayout, CreateTitle, CreateView },
  } = useCollectionCreate()

  return (
    <CreateFormLayout>
      <CreateTitle />
      <CreateView />
    </CreateFormLayout>
  )
}
