'use client'

import type { Selection } from 'react-aria-components'

import { DotsThreeVerticalIcon } from '@phosphor-icons/react'
import type { FieldClient } from 'node_modules/@kivotos/core/src/field'

import type { ClientCollection, InferFieldsFromCollection } from '@kivotos/core'

import { BaseIcon } from '../../components/primitives/base-icon'
import { Menu, MenuContent, MenuItem, MenuSeparator, MenuTrigger } from '../../intentui/ui/menu'
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '../../intentui/ui/table'

// Maybe tanstack-hooks-form is more reasonable for this, but the clock is ticking fr fr nocap
const tableDataExtract = <
  TCollection extends ClientCollection<any, any, any, any, Record<string, FieldClient>, any>,
>(
  collection: TCollection,
  data: InferFieldsFromCollection<TCollection>[]
) => {
  const headers = Object.values(collection.fields).map((column) => {
    return { ...column, label: column.fieldName /* Fallback to key if no label */ }
  })

  headers.sort((a, b) => (b.label === collection.primaryField ? 1 : -1))

  const rows = data.map((record) => ({
    key: record[collection.primaryField],
    rows: headers.map(
      (header) =>
        record[header.fieldName] ??
        'Unknown' /* Unknown meant that it's missing a correct heading label */
    ),
  }))

  return { headers, rows }
}

export function ListTable<
  TCollection extends ClientCollection<any, any, any, any, Record<string, FieldClient>, any>,
>(props: { collection: TCollection; data: InferFieldsFromCollection<TCollection>[] }) {
  const onSelectedChange = (selected: Selection) => {
    console.log(selected)
  }

  const { headers, rows } = tableDataExtract(props.collection, props.data)

  return (
    <Table
      bleed
      aria-label="Items"
      selectionMode="multiple"
      className="overflow-clip rounded-xl"
      allowResize
      onSelectionChange={onSelectedChange}
    >
      <TableHeader>
        {headers.map(({ label }) => (
          <TableColumn isResizable isRowHeader key={label}>
            {label}
          </TableColumn>
        ))}
        <TableColumn className="w-24!" />
      </TableHeader>
      <TableBody items={rows}>
        {({ key, rows }) => (
          <TableRow href="." id={key}>
            {rows.map((cell) => (
              // TODO: Make this right
              <TableCell key={JSON.stringify(cell)}>{JSON.stringify(cell, null)}</TableCell>
            ))}
            <TableCell className="">
              <div className="grid place-items-center">
                <Menu>
                  <MenuTrigger className="cursor-pointer">
                    <BaseIcon icon={DotsThreeVerticalIcon} size="md" weight="bold" />
                  </MenuTrigger>
                  <MenuContent aria-label="Actions" placement="left top">
                    <MenuItem>View</MenuItem>
                    <MenuItem>Edit</MenuItem>
                    <MenuSeparator />
                    <MenuItem isDanger>Delete</MenuItem>
                  </MenuContent>
                </Menu>
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
