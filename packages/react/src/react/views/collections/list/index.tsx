import { ListViewClient } from './list.client'
import { ClientListViewPropsProvider } from './providers/list-view-props'

import type { ListViewProps } from '../../../../core/collection'
import { getClientListViewProps } from '../../../../core/config'
import { TableStatesProvider } from '../../../providers/table'

export async function ListView(props: ListViewProps) {
  const clientListViewProps = getClientListViewProps(props)

  return (
    <TableStatesProvider>
      <ClientListViewPropsProvider clientListViewProps={clientListViewProps}>
        <ListViewClient />
      </ClientListViewPropsProvider>
    </TableStatesProvider>
  )
}
