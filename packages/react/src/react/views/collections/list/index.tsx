import { ClientCollectionListView } from './list.client'
import { CollectionListViewProvider } from './providers'

import type { CollectionListViewProps } from '../../../../core/collection'
import { getClientListViewProps } from '../../../../core/config'

export async function CollectionListView(props: CollectionListViewProps) {
  const clientListViewProps = getClientListViewProps(props)

  return (
    <CollectionListViewProvider clientListViewProps={clientListViewProps}>
      <ClientCollectionListView />
    </CollectionListViewProvider>
  )
}
