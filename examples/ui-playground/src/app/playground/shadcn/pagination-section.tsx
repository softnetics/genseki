'use client'

import * as React from 'react'

import { CaretDoubleLeftIcon, CaretDoubleRightIcon } from '@phosphor-icons/react'

import { Button, buttonVariants, Typography } from '@genseki/ui'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@genseki/ui'

import { PlaygroundCard } from '~/src/components/card'

import { cn } from '../../../../../../legacies/react/src/react/utils/cn'

// Default Pagination
function DefaultPagination() {
  const [currentPage, setCurrentPage] = React.useState(1)
  const totalPages = 10

  return (
    <div className="space-y-4">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault()
                setCurrentPage(Math.max(1, currentPage - 1))
              }}
              className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
          {[...Array(3).keys()].map((i) => {
            const page = i + 1
            return (
              <PaginationItem key={page} isActive={currentPage === page}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    setCurrentPage(page)
                  }}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            )
          })}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault()
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }}
              className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <Typography type="body" className="text-text-secondary">
        Current page: {currentPage} of {totalPages}
      </Typography>
    </div>
  )
}

function CustomizedPagination() {
  const [currentPage, setCurrentPage] = React.useState(2)
  const totalPages = 10

  return (
    <div className="space-y-4">
      <Pagination>
        <PaginationContent>
          {[...Array(12).keys()].map((i) => {
            const page = i + 1
            const isActive = currentPage === page
            return (
              <PaginationItem key={page} isActive={currentPage === page}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    setCurrentPage(page)
                  }}
                  className={cn(
                    'gap-2',
                    isActive && 'border-none',
                    buttonVariants({
                      variant: isActive ? 'primary' : 'outline',
                      size: 'md',
                    })
                  )}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            )
          })}
        </PaginationContent>
      </Pagination>
      <Typography type="body" className="text-text-secondary">
        Current page: {currentPage} of {totalPages}
      </Typography>
    </div>
  )
}

// First and Last Page Buttons
function FirstLastPagination() {
  const [currentPage, setCurrentPage] = React.useState(2)
  const totalPages = 10

  return (
    <div className="space-y-4">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="gap-2"
            >
              <CaretDoubleLeftIcon />
              <Typography className="sr-only">First page</Typography>
            </Button>
          </PaginationItem>
          {[...Array(3).keys()].map((i) => {
            const page = i + 1

            return (
              <PaginationItem key={page} isActive={currentPage === page}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    setCurrentPage(page)
                  }}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            )
          })}
          <PaginationItem>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="gap-2"
            >
              <CaretDoubleRightIcon />
              <Typography className="sr-only">Last page</Typography>
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <Typography type="body" className="text-text-secondary">
        Current page: {currentPage} of {totalPages}
      </Typography>
    </div>
  )
}

// With Ellipsis Pagination
function WithEllipsisPagination() {
  const [currentPage, setCurrentPage] = React.useState(5)
  const totalPages = 20

  const getVisiblePages = () => {
    if (currentPage <= 3) return [1, 2, 3, 4, 5]
    if (currentPage >= totalPages - 2)
      return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2]
  }

  const visiblePages = getVisiblePages()
  const showStartEllipsis = currentPage > 4
  const showEndEllipsis = currentPage < totalPages - 3

  return (
    <div className="space-y-4">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault()
                setCurrentPage(Math.max(1, currentPage - 1))
              }}
              className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>

          {showStartEllipsis && (
            <>
              <PaginationItem isActive={currentPage === 1}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    setCurrentPage(1)
                  }}
                >
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink>
                  <PaginationEllipsis />
                </PaginationLink>
              </PaginationItem>
            </>
          )}

          {visiblePages.map((page) => (
            <PaginationItem key={page} isActive={currentPage === page}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  setCurrentPage(page)
                }}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

          {showEndEllipsis && (
            <>
              <PaginationItem>
                <PaginationLink>
                  <PaginationEllipsis />
                </PaginationLink>
              </PaginationItem>
              <PaginationItem isActive={currentPage === totalPages}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    setCurrentPage(totalPages)
                  }}
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault()
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }}
              className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <Typography type="body" className="text-text-secondary">
        Current page: {currentPage} of {totalPages}
      </Typography>
    </div>
  )
}

// Numberless Pagination
function NumberlessPagination() {
  const [currentPage, setCurrentPage] = React.useState(2)
  const totalPages = 10

  return (
    <div className="space-y-4">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault()
                setCurrentPage(Math.max(1, currentPage - 1))
              }}
              className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault()
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }}
              className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <Typography type="body" className="text-text-secondary">
        Current page: {currentPage} of {totalPages}
      </Typography>
    </div>
  )
}

// Numberless with Text
function NumberlessWithTextPagination() {
  const [currentPage, setCurrentPage] = React.useState(1)
  const totalPages = 21

  return (
    <div className="space-y-4">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault()
                setCurrentPage(Math.max(1, currentPage - 1))
              }}
              className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink className="w-min cursor-default pointer-events-none" asChild>
              <div>
                <Typography className="px-4 py-2 text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </Typography>
              </div>
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault()
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }}
              className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <Typography type="body" className="text-text-secondary">
        Current page: {currentPage} of {totalPages}
      </Typography>
    </div>
  )
}

export function PaginationSection() {
  return (
    <div className="grid gap-8">
      <PlaygroundCard title="Default Pagination" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          Basic pagination with previous/next buttons and page numbers.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <DefaultPagination />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Custom pagination" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          Pagination with custom pagination link.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <CustomizedPagination />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="First and Last Page Buttons" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          Pagination with first and last page navigation buttons.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <FirstLastPagination />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="With Ellipsis Pagination" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          Pagination with ellipsis for large page counts, showing relevant pages around current
          page.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <WithEllipsisPagination />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Numberless Pagination" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          Simple pagination with only previous and next buttons, no page numbers.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <NumberlessPagination />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Numberless with Text" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          Pagination with previous/next buttons and current page information text.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <NumberlessWithTextPagination />
        </div>
      </PlaygroundCard>
    </div>
  )
}
