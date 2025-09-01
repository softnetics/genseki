'use client'

import { useCollectionCreate } from './context'

export function DefaultCollectionCreatePage() {
  const {
    components: {
      CreateFormLayout: CollectionFormLayout,
      CreateTitle: CollectionCreateTitle,
      CreateView: DefaultCollectionCreateView,
    },
  } = useCollectionCreate()

  return (
    <CollectionFormLayout>
      <CollectionCreateTitle />
      <DefaultCollectionCreateView />
    </CollectionFormLayout>
  )
}
