import { CreateClientView } from './create.client'
import { CollectionFormLayout } from './layouts/collection-form-layout'
import type { BaseViewProps } from './types'

import { getFieldsClient } from '../../../core'
import { Typography } from '../../components/primitives/typography'

interface CreateViewProps extends BaseViewProps {
  slug: string
  headers: Headers
}

export async function CreateView(props: CreateViewProps) {
  const fieldsClient = getFieldsClient(props.fields)

  return (
    <CollectionFormLayout size="md">
      <Typography type="h2" weight="semibold">
        Create new {props.slug}
      </Typography>
      <CreateClientView slug={props.slug} fields={fieldsClient} />
    </CollectionFormLayout>
  )
}
