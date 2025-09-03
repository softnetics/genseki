'use client'

import { useMemo } from 'react'

import { Banner } from './banner'
import { CollectionListTableContainer } from './container'
import { useCollectionList } from './context'
import { CollectionListTable } from './table'
import { CollectionListPagination } from './table/pagination'
import { CollectionListToolbar } from './toolbar'

export function DefaultCollectionListPage() {
  const context = useCollectionList()

  const columns = useMemo(() => {
    if (context.isQuerying) return context.columns

    return context.columns
  }, [context.columns, context.actions, context.isQuerying])

  return (
    <>
      <Banner slug={context.slug} />
      <CollectionListTableContainer>
        <CollectionListToolbar />
        <CollectionListTable<any>
          columns={columns}
          onRowClick={context.actions?.select ? 'toggleSelect' : undefined}
        />
        <CollectionListPagination />
      </CollectionListTableContainer>
    </>
  )
}
