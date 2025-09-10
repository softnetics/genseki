'use client'

import { Banner } from './banner'
import { CollectionListTableContainer } from './container'
import { useCollectionList } from './context'
import { CollectionListTable } from './table'
import { CollectionListPagination } from './table/pagination'
import { CollectionListToolbar } from './toolbar'

export function DefaultCollectionListPage() {
  const context = useCollectionList()

  return (
    <>
      <Banner slug={context.slug} />
      <CollectionListTableContainer>
        <CollectionListToolbar />
        <CollectionListTable<any> columns={context.columns} onRowClick={undefined} />
        <CollectionListPagination />
      </CollectionListTableContainer>
    </>
  )
}
