import React from 'react'

import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table'

import { TanstackTable } from '@genseki/react'
import { Typography } from '@genseki/react/v2'

import { PlaygroundCard } from '../../../components/card'

type User = {
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
      <TanstackTable table={table} />
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
      <TanstackTable
        table={table}
        configuration={{
          sortBy: [['id'], ['fname'], ['lname'], ['food']],
        }}
      />
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
    <div>
      <TanstackTable table={table} isLoading={true} />
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
      <TanstackTable table={table} />
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
      <TanstackTable
        table={table}
        isError={true}
        errorMessage="Failed to load data. Please try again later."
      />
    </div>
  )
}

export const TableSection = React.memo(function () {
  return (
    <div className="grid gap-8">
      <PlaygroundCard title="Basic Table" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          A simple table with basic data display functionality.
        </Typography>

        <div className="p-4 bg-background w-full rounded-lg">
          <BasicTable />
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
