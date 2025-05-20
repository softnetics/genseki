'use client'

import { useMemo } from 'react'

import {
  AccessorKeyColumnDef,
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

import { ClientCollection, FieldsClient, InferFields } from '@kivotos/core'

import { CustomTable } from '../../intentui/ui/custom-table'
import { TableCell } from '../../intentui/ui/table'

export function ListTable<
  TCollection extends ClientCollection<any, any, any, any, FieldsClient, any>,
>(props: { collection: TCollection; data: InferFields<TCollection['fields']>[] }) {
  const columns = useMemo(() => {
    const columnHelper = createColumnHelper()

    return Object.entries(props.collection.fields).map(([key, field]) => {
      return columnHelper.accessor(key, {
        id: key,
        header: () => <div>{field.label}</div>,
        enableSorting: true,
        cell: ({ getValue }) => <TableCell>{getValue()}</TableCell>,
      }) as AccessorKeyColumnDef<any, any>
    })
  }, [props.collection])

  const table = useReactTable({
    data: props.data,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return <CustomTable table={table} />
}
