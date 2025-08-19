import { ListViewClient } from './list.client'

import { type Fields, getFieldsClient } from '../../../../core'
import type { ListViewProps } from '../../../../core/collection'
import { TanstackTableProvider } from '../../../providers/table'

export async function ListView<TFields extends Fields>(props: ListViewProps<TFields>) {
  const fieldsClient = getFieldsClient(props.fields)

  return (
    <TanstackTableProvider>
      <ListViewClient
        slug={props.slug}
        identifierColumn={props.identifierColumn}
        fieldsClient={fieldsClient}
        columns={props.columns as any}
        listConfiguration={props.listConfiguration}
        features={props.features}
      />
    </TanstackTableProvider>
  )
}
