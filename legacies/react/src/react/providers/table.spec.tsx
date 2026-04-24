import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { describe, expect, it, vi } from 'vitest'

import { TableStatesContextProvider, TableStatesProvider, useTableStatesContext } from './table'

import type { UsePaginationReturn } from '../hooks/use-pagination'
import type { UseSearchReturn } from '../hooks/use-search'
import type { UseSort } from '../hooks/use-sort'

const mockedPagination: UsePaginationReturn = {
  pagination: { page: 2, pageSize: 25 },
  setPagination: vi.fn(),
}

const mockedSearch: UseSearchReturn = {
  search: 'seed-search',
  setSearch: vi.fn(),
}

const mockedSort: { sort: UseSort['Sort']; setSort: UseSort['SetSort'] } = {
  sort: [{ id: 'name', desc: false }],
  setSort: vi.fn(),
}

vi.mock('../hooks/use-pagination', () => ({
  usePagination: () => mockedPagination,
}))

vi.mock('../hooks/use-search', () => ({
  useSearch: () => mockedSearch,
}))

vi.mock('../hooks/use-sort', () => ({
  useSort: () => mockedSort,
}))

function TableStateProbe() {
  const state = useTableStatesContext()

  return (
    <div data-testid="state">
      {JSON.stringify({
        page: state.pagination.page,
        pageSize: state.pagination.pageSize,
        search: state.search,
        sort: state.sort,
      })}
    </div>
  )
}

describe('TableStatesContextProvider', () => {
  it('renders without NuqsAdapter and does not throw', () => {
    expect(() =>
      renderToStaticMarkup(
        <TableStatesContextProvider
          pagination={{ page: 1, pageSize: 10 }}
          setPagination={vi.fn()}
          sort={[]}
          setSort={vi.fn()}
          search=""
          setSearch={vi.fn()}
        >
          <TableStateProbe />
        </TableStatesContextProvider>
      )
    ).not.toThrow()
  })
})

describe('TableStatesProvider', () => {
  it('keeps legacy provider API behavior via nuqs-backed hooks', () => {
    const html = renderToStaticMarkup(
      <TableStatesProvider>
        <TableStateProbe />
      </TableStatesProvider>
    )

    expect(html).toContain('&quot;page&quot;:2')
    expect(html).toContain('&quot;pageSize&quot;:25')
    expect(html).toContain('&quot;search&quot;:&quot;seed-search&quot;')
    expect(html).toContain('&quot;id&quot;:&quot;name&quot;')
  })
})
