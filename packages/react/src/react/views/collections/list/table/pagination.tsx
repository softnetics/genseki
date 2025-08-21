'use client'

import { PageSizeSelect, Pagination } from '../../../../components'
import { usePagination } from '../../../../hooks/use-pagination'

export interface CollectionListPaginationProps {
  totalPage?: number
}

export function CollectionListPagination(props: CollectionListPaginationProps) {
  const { pagination, setPagination } = usePagination()

  const totalPage = props.totalPage ?? 1

  const onPageChange = (page: number) =>
    setPagination((pagination) => ({ page: page, pageSize: pagination.pageSize }))

  return (
    <div className="flex flex-row items-center justify-between gap-x-4 mt-6">
      <div>
        <Pagination
          currentPage={pagination.page}
          totalPages={totalPage}
          onPageChange={onPageChange}
        />
      </div>
      <div className="flex items-center gap-x-6">
        <p className="text-base text-muted-fg font-bold">
          <span className="font-normal">Page </span>
          {pagination.page}
          <span className="font-normal"> of </span>
          {totalPage}
        </p>
        <PageSizeSelect
          pageSize={pagination.pageSize}
          onPageSizeChange={(pageSize) => setPagination(() => ({ page: 1, pageSize }))}
        />
      </div>
    </div>
  )
}
