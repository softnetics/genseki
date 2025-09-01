'use client'

import { useCollectionCreate } from './context'

export const DefaultCollectionCreatePage = () => {
  const {
    components: { CollectionFormLayout, CollectionCreateTitle, DefaultCollectionCreateView },
  } = useCollectionCreate()

  return (
    <CollectionFormLayout>
      <CollectionCreateTitle />
      <DefaultCollectionCreateView />
    </CollectionFormLayout>
  )
}
