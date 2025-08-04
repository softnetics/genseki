'use client'

import { useMemo } from 'react'

import { IconArrowLeft, IconArrowRight } from '@intentui/icons'
import clsx from 'clsx'

import { Select, SelectList, SelectOption, SelectTrigger } from '../..'

interface PaginationProps {
  variant?: 'default' | 'compact'
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  maxVisiblePages?: number
}

const Pagination = (props: PaginationProps) => {
  const { currentPage, totalPages, onPageChange, maxVisiblePages = 5, variant = 'compact' } = props

  if (totalPages <= 1) return null

  const pages = useMemo(() => {
    return generatePages(currentPage, totalPages, maxVisiblePages)
  }, [currentPage, totalPages, maxVisiblePages])

  return (
    <div
      className={clsx(
        'flex items-center',
        variant === 'compact'
          ? 'border border-bluegray-300 rounded-md w-fit overflow-hidden'
          : 'gap-6 justify-between w-full'
      )}
    >
      {/* Previous Button */}
      <button
        className={clsx(
          'flex gap-2.5 size-20 transition-colors text-lg shrink-0 items-center justify-center bg-white dark:bg-bluegray-800',
          currentPage === 1
            ? 'cursor-not-allowed text-bluegray-300'
            : 'cursor-pointer text-text-body '
        )}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <IconArrowLeft className="size-10" />
        <p className="hidden tablet:block font-bold text-sm">ก่อนหน้า</p>
      </button>

      {/* Page Numbers */}
      <div className="flex items-center">
        {pages.map((page, idx) => {
          if (page === '...') {
            return (
              <div
                key={`elipse-${page}-${idx}`}
                className={`size-20 shrink-0 flex items-center justify-center text-text-body transition-colors cursor-pointer text-lg border-l border-bluegray-300 bg-white dark:bg-bluegray-800`}
              >
                <span className="text-lg">...</span>
              </div>
            )
          }
          return (
            <button
              key={`page-${page}-${idx}`}
              className={clsx(
                'flex size-20 shrink-0 items-center justify-center bg-accent-fg text-text-body transition-colors cursor-pointer text-lg',
                page === currentPage
                  ? 'bg-bluegray-50 dark:bg-bluegray-700'
                  : 'bg-white dark:bg-bluegray-800',
                variant === 'compact' ? 'border-l border-bluegray-300' : 'rounded-lg',
                page === totalPages && variant === 'compact' && 'border-r border-bluegray-300'
              )}
              onClick={() => onPageChange(page as number)}
            >
              {page}
            </button>
          )
        })}
      </div>

      {/* Next Button */}
      <button
        className={clsx(
          'flex gap-2.5 size-20 transition-colors cursor-pointer text-lg shrink-0 items-center justify-center bg-white dark:bg-bluegray-800',
          currentPage === totalPages
            ? 'cursor-not-allowed text-bluegray-300'
            : 'cursor-pointer text-text-body'
        )}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <p className="hidden tablet:block font-bold text-sm">ถัดไป</p>
        <IconArrowRight className="size-10" />
      </button>
    </div>
  )
}

interface PageSizeSelectProps {
  pageSize: number
  onPageSizeChange: (pageSize: number) => void
  options?: { value: number; label: string }[]
}

const PageSizeSelect = (props: PageSizeSelectProps) => {
  const pageSizeOptions = props.options ?? [
    { value: 10, label: '10' },
    { value: 25, label: '25' },
    { value: 50, label: '50' },
    { value: 100, label: '100' },
  ]

  return (
    <div className="flex items-center gap-6">
      <Select
        placeholder="show"
        className="w-72"
        selectedKey={String(props.pageSize)}
        onSelectionChange={(key) => props.onPageSizeChange(Number(key))}
      >
        <SelectTrigger />
        <SelectList>
          {pageSizeOptions.map((option) => (
            <SelectOption key={option.value} id={String(option.value)}>
              {option.label}
            </SelectOption>
          ))}
        </SelectList>
      </Select>
    </div>
  )
}

/**
 * Generates an array of page numbers (and '...' for ellipses).
 * Example output: [1, '...', 4, 5, 6, '...', 10]
 */
function generatePages(current: number, total: number, maxVisible: number) {
  const pages: (number | string)[] = []

  // If total pages <= maxVisible, show all pages
  if (total <= maxVisible) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
    return pages
  }

  const half = Math.floor(maxVisible / 2)
  let start = Math.max(current - half, 1)
  const end = Math.min(start + maxVisible - 1, total)

  // Adjust if the range is smaller than maxVisible
  if (end - start < maxVisible - 1) {
    start = Math.max(end - maxVisible + 1, 1)
  }

  // First page + ellipses
  if (start > 1) {
    pages.push(1)
    if (start > 2) {
      pages.push('...')
    }
  }

  // Main page range
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  // Ellipses + last page
  if (end < total) {
    if (end < total - 1) {
      pages.push('...')
    }
    pages.push(total)
  }

  return pages
}

export type { PageSizeSelectProps, PaginationProps }
export { PageSizeSelect, Pagination }
