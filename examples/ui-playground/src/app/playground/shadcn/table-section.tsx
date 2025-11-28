import React, { useMemo } from 'react'

import { LinkIcon } from '@phosphor-icons/react'
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import Link from 'next/link'

import { linkVariants, TanstackTable, TanstackTableContainer, Typography } from '@genseki/ui'

import { InformationCard, PlaygroundCard } from '../../../components/card'

interface User {
  id: number
  fname: string
  lname: string
  food: string
}

const columnHelper = createColumnHelper<User>()

const columns = [
  columnHelper.accessor('id', {
    header: 'ID',
    cell: (props) => <p>{props.getValue()}</p>,
  }),
  columnHelper.accessor('fname', {
    header: 'First Name',
    cell: (props) => <p>{props.getValue()}</p>,
  }),
  columnHelper.accessor('lname', {
    header: 'Last Name',
    cell: (props) => <p>{props.getValue()}</p>,
  }),
  columnHelper.accessor('food', {
    header: 'Favorite Food',
    cell: (props) => <p>{props.getValue()}</p>,
  }),
]

function BasicTable() {
  const users: User[] = [
    {
      id: 1,
      fname: 'Supakorn',
      lname: 'Netsuwan',
      food: 'Hamburger',
    },
    {
      id: 2,
      fname: 'Jane',
      lname: 'Doe',
      food: 'Pizza',
    },
    {
      id: 3,
      fname: 'John',
      lname: 'Smith',
      food: 'Sushi',
    },
    {
      id: 4,
      fname: 'Emily',
      lname: 'Johnson',
      food: 'Tacos',
    },
    {
      id: 5,
      fname: 'Michael',
      lname: 'Brown',
      food: 'Pasta',
    },
  ]

  const table = useReactTable<User>({
    getCoreRowModel: getCoreRowModel(),
    data: users,
    columns,
  })

  return (
    <div>
      <TanstackTableContainer>
        <TanstackTable table={table} />
      </TanstackTableContainer>
    </div>
  )
}

function BasicStickyColumnTable() {
  const users: User[] = useMemo(
    () => [
      {
        id: 1,
        fname: 'Supakorn',
        lname: 'Netsuwan',
        food: 'Hamburger',
      },
      {
        id: 2,
        fname: 'Jane',
        lname: 'Doe',
        food: 'Pizza',
      },
      {
        id: 3,
        fname: 'John',
        lname: 'Smith',
        food: 'Sushi',
      },
      {
        id: 4,
        fname: 'Emily',
        lname: 'Johnson',
        food: 'Tacos',
      },
      {
        id: 5,
        fname: 'Michael',
        lname: 'Brown',
        food: 'Pasta',
      },
      {
        id: 6,
        fname: 'Alice',
        lname: 'Williams',
        food: 'Steak',
      },
      {
        id: 7,
        fname: 'Robert',
        lname: 'Taylor',
        food: 'Salad',
      },
      {
        id: 8,
        fname: 'Linda',
        lname: 'Anderson',
        food: 'Ice Cream',
      },
      {
        id: 9,
        fname: 'David',
        lname: 'Thomas',
        food: 'Chicken',
      },
      {
        id: 10,
        fname: 'Barbara',
        lname: 'Jackson',
        food: 'Sandwich',
      },
      {
        id: 11,
        fname: 'William',
        lname: 'White',
        food: 'Burger',
      },
      {
        id: 12,
        fname: 'Susan',
        lname: 'Harris',
        food: 'Soup',
      },
      {
        id: 13,
        fname: 'James',
        lname: 'Martin',
        food: 'Ramen',
      },
      {
        id: 14,
        fname: 'Patricia',
        lname: 'Thompson',
        food: 'Falafel',
      },
      {
        id: 15,
        fname: 'Christopher',
        lname: 'Garcia',
        food: 'Curry',
      },
      {
        id: 16,
        fname: 'Jessica',
        lname: 'Martinez',
        food: 'Stew',
      },
      {
        id: 17,
        fname: 'Daniel',
        lname: 'Robinson',
        food: 'Dumplings',
      },
      {
        id: 18,
        fname: 'Karen',
        lname: 'Clark',
        food: 'Schnitzel',
      },
      {
        id: 19,
        fname: 'Paul',
        lname: 'Rodriguez',
        food: 'Pizza',
      },
      {
        id: 20,
        fname: 'Nancy',
        lname: 'Lewis',
        food: 'Pancakes',
      },
      {
        id: 21,
        fname: 'Matthew',
        lname: 'Lee',
        food: 'Hot Dog',
      },
      {
        id: 22,
        fname: 'Michelle',
        lname: 'Walker',
        food: 'Waffles',
      },
      {
        id: 23,
        fname: 'Anthony',
        lname: 'Hall',
        food: 'Quiche',
      },
      {
        id: 24,
        fname: 'Sarah',
        lname: 'Allen',
        food: 'Cake',
      },
      {
        id: 25,
        fname: 'Mark',
        lname: 'Young',
        food: 'Lasagna',
      },
    ],
    []
  )

  const table = useReactTable<User>({
    getCoreRowModel: getCoreRowModel(),
    data: users,
    columns,
    state: {
      columnPinning: { left: ['id'] },
    },
  })

  return (
    <div>
      <TanstackTableContainer>
        <TanstackTable table={table} />
      </TanstackTableContainer>
    </div>
  )
}

function SortableTable() {
  const users: User[] = [
    {
      id: 1,
      fname: 'Supakorn',
      lname: 'Netsuwan',
      food: 'Hamburger',
    },
    {
      id: 2,
      fname: 'Jane',
      lname: 'Doe',
      food: 'Pizza',
    },
    {
      id: 3,
      fname: 'John',
      lname: 'Smith',
      food: 'Sushi',
    },
    {
      id: 4,
      fname: 'Emily',
      lname: 'Johnson',
      food: 'Tacos',
    },
    {
      id: 5,
      fname: 'Michael',
      lname: 'Brown',
      food: 'Pasta',
    },
  ]

  const table = useReactTable<User>({
    getCoreRowModel: getCoreRowModel(),
    data: users,
    columns,
  })

  return (
    <div>
      <TanstackTableContainer>
        <TanstackTable
          table={table}
          configuration={{
            sortBy: [['id'], ['fname'], ['lname'], ['food']],
          }}
        />
      </TanstackTableContainer>
    </div>
  )
}

function LoadingTable() {
  const users: User[] = []

  const table = useReactTable<User>({
    getCoreRowModel: getCoreRowModel(),
    data: users,
    columns,
  })

  return (
    <div className="grid gap-y-6">
      <TanstackTableContainer>
        <TanstackTable table={table} isLoading={true} />
      </TanstackTableContainer>
      <Typography>
        Or using{' '}
        <span className="text-secondary-fg border rounded-sm bg-secondary p-1 ml-2">
          loadingMessage
        </span>{' '}
        prop
      </Typography>
      <TanstackTableContainer>
        <TanstackTable table={table} isLoading={true} loadingMessage="Loading is in progress" />
      </TanstackTableContainer>
      <Typography>
        And if you want fully control over, you can use{' '}
        <span className="text-secondary-fg border rounded-sm bg-secondary p-1 ml-2">
          loadingFallback
        </span>{' '}
        prop
      </Typography>
      <TanstackTableContainer>
        <TanstackTable
          table={table}
          isLoading={true}
          loadingFallback={
            <div>
              <Typography weight="semibold" className="text-primary">
                Dowloading...
              </Typography>
            </div>
          }
        />
      </TanstackTableContainer>
    </div>
  )
}

function EmptyTable() {
  const users: User[] = []

  const table = useReactTable<User>({
    getCoreRowModel: getCoreRowModel(),
    data: users,
    columns,
  })

  return (
    <div>
      <TanstackTableContainer>
        <TanstackTable table={table} />
      </TanstackTableContainer>
    </div>
  )
}

function ErrorTable() {
  const users: User[] = []

  const table = useReactTable<User>({
    getCoreRowModel: getCoreRowModel(),
    data: users,
    columns,
  })

  return (
    <div>
      <TanstackTableContainer>
        <TanstackTable
          table={table}
          isError={true}
          errorMessage="Failed to load data. Please try again later."
        />
      </TanstackTableContainer>
    </div>
  )
}

export const TableSection = React.memo(function () {
  return (
    <div className="grid gap-8">
      <InformationCard>
        For more comprehensive please visit{' '}
        <Link
          className={linkVariants({ variant: 'underline', size: 'lg' })}
          href="/playground/shadcn/table"
        >
          This table example
        </Link>
        <LinkIcon className="inline-block text-primary align-middle" />
      </InformationCard>
      <InformationCard>
        Important default. You can apply loading state display, error state display and empty state.
        <Typography className="mt-12">
          For <b>loading state</b> use
          <span className="text-secondary-fg border rounded-sm bg-secondary p-1 ml-2">
            loadingMessage
          </span>{' '}
          , if this does not comprehensive enough, leverage the
          <span className="text-secondary-fg border rounded-sm bg-secondary p-1 ml-2">
            loadingFallback
          </span>{' '}
        </Typography>{' '}
        <Typography className="mt-6">
          For <b>empty state</b> use
          <span className="text-secondary-fg border rounded-sm bg-secondary p-1 ml-2">
            emptyMessage
          </span>{' '}
          , if this does not comprehensive enough, leverage the
          <span className="text-secondary-fg border rounded-sm bg-secondary p-1 ml-2">
            emptyFallback
          </span>{' '}
        </Typography>{' '}
        <Typography className="mt-6">
          For <b>error state</b> use
          <span className="text-secondary-fg border rounded-sm bg-secondary p-1 ml-2">
            errorMessage
          </span>{' '}
          , if this does not comprehensive enough, leverage the
          <span className="text-secondary-fg border rounded-sm bg-secondary p-1 ml-2">
            errorFallback
          </span>{' '}
        </Typography>{' '}
      </InformationCard>

      <PlaygroundCard title="Basic Table" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          A simple table with basic data display functionality.
        </Typography>

        <div className="p-4 bg-background w-full rounded-lg">
          <BasicTable />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Basic sticky column Table" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          A simple table with sticky column
        </Typography>

        <div className="p-4 bg-background w-full rounded-lg">
          <BasicStickyColumnTable />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Sortable Table" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          Table with sortable columns. Click on column headers to sort.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <SortableTable />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Loading State" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          Table displaying a loading state while data is being fetched.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <LoadingTable />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Empty State" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          Table displaying an empty state when no data is available.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <EmptyTable />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Error State" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          Table displaying an error state when data fetching fails.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <ErrorTable />
        </div>
      </PlaygroundCard>
    </div>
  )
})

TableSection.displayName = 'TableSection'
