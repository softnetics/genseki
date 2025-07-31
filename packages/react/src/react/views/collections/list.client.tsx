'use client'

import { useMemo, useState } from 'react'

import { TrashIcon } from '@phosphor-icons/react'
import {
  CaretLeftIcon,
  DotsThreeVerticalIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
} from '@phosphor-icons/react/dist/ssr'
import { useQuery } from '@tanstack/react-query'
import {
  type ColumnDef,
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

import type { FieldsClient } from '../../../core'
import {
  Button,
  ButtonLink,
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
  TextField,
} from '../../components'
import { BaseIcon } from '../../components/primitives/base-icon'
import { TanstackTable } from '../../components/primitives/tanstack-table'
import { useNavigation } from '../../providers'
import { useServerFunction } from '../../providers/root'

const Toolbar = (props: {
  slug: string
  selection: string[]
  setSelection: (args: string[]) => void
}) => {
  const navigation = useNavigation()
  const serverFunction = useServerFunction()

  return (
    <div className="flex items-center justify-between gap-x-3">
      <ButtonLink
        href="."
        variant="ghost"
        size="md"
        leadingIcon={<BaseIcon icon={CaretLeftIcon} size="md" />}
      >
        Back
      </ButtonLink>
      <div className="flex items-center gap-x-4">
        {props.selection.length ? (
          <Button
            variant="destruction"
            size="md"
            leadingIcon={<BaseIcon icon={TrashIcon} size="md" />}
            onClick={async () => {
              await serverFunction(`${props.slug}.delete`, {
                body: { ids: props.selection },
                headers: {},
                pathParams: {},
                query: {},
              })
              props.setSelection([])
              navigation.refresh()
            }}
          >
            Delete
          </Button>
        ) : null}
        <TextField
          placeholder="Search"
          prefix={<BaseIcon icon={MagnifyingGlassIcon} size="md" />}
          className="w-full"
        />
        <Button variant="outline" size="md" leadingIcon={<BaseIcon icon={FunnelIcon} size="md" />}>
          Filter
        </Button>
        <ButtonLink variant="primary" size="md" href={`./${props.slug}/create`}>
          Create
        </ButtonLink>
      </div>
    </div>
  )
}

type BaseData = {
  __id: string
  __pk: string
} & {}

interface ListTableProps {
  slug: string
  identifierColumn: string
  fields: FieldsClient
  columns: ColumnDef<BaseData>[]
  searchParams: Record<string, string | string[]>
}

export function ListTable(props: ListTableProps) {
  const serverFunction = useServerFunction()
  const navigation = useNavigation()

  const [selection, setSelection] = useState<string[]>([])

  const query = useQuery({
    queryKey: ['GET', `/api/${props.slug}`, props.searchParams],
    queryFn: () => {
      // TODO: Need to pass baseUrl from the server
      // TODO: Pagination from searchParams
      return fetch(`/api/${props.slug}`)
        .then((res) => res.json())
        .then((data) => data.body as { data: BaseData[]; total: number; page: number })
    },
  })

  const enhancedColumns = useMemo(() => {
    const columnHelper = createColumnHelper<BaseData>()
    if (query.isLoading) return props.columns
    return [
      ...props.columns,
      columnHelper.display({
        id: 'actions',
        cell: ({ row }) => (
          <div className="grid place-items-center">
            <Menu>
              <MenuTrigger className="cursor-pointer">
                <BaseIcon icon={DotsThreeVerticalIcon} size="md" weight="bold" />
              </MenuTrigger>
              <MenuContent aria-label="Actions" placement="left top">
                <MenuItem>View</MenuItem>
                <MenuItem>Edit</MenuItem>
                <MenuSeparator />
                <MenuItem
                  isDanger
                  onAction={async () => {
                    await serverFunction(`${props.slug}.delete`, {
                      body: { ids: [row.original.__id] },
                      headers: {},
                      pathParams: {},
                      query: {},
                    })
                    navigation.refresh()
                  }}
                >
                  Delete
                </MenuItem>
              </MenuContent>
            </Menu>
          </div>
        ),
      }),
    ]
  }, [query.isLoading])

  const table = useReactTable({
    data: query.data?.data ?? [],
    columns: enhancedColumns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <>
      <Toolbar slug={props.slug} selection={selection} setSelection={setSelection} />
      <TanstackTable
        table={table}
        className="static"
        onRowClick="toggleSelect"
        isLoading={query.isLoading}
        isError={query.isError}
      />
    </>
  )
}
