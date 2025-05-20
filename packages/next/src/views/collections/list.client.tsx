'use client'

import { Selection } from 'react-aria-components'

import { DotsThreeVerticalIcon } from '@phosphor-icons/react'
import {
  ClientCollection,
  InferFieldsFromCollection,
} from 'node_modules/@kivotos/core/src/collection'
import { FieldClient } from 'node_modules/@kivotos/core/src/field'

import BaseIcon from '~/components/primitives/base-icon'
import { Menu } from '~/intentui/ui/menu'
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '~/intentui/ui/table'

// Maybe tanstack-hooks-form is more reasonable for this, but the clock is ticking fr fr nocap
const tableDataExtract = <
  TCollection extends ClientCollection<any, any, any, any, Record<string, FieldClient>, any>,
>(
  collection: TCollection,
  data: InferFieldsFromCollection<TCollection>[]
) => {
  const headers = Object.entries(collection.fields).map(([key, column]) => {
    return { ...column, label: column.label ?? key /* Fallback to key if no label */ }
  })

  headers.sort((a, b) => (b.label === collection.primaryField ? 1 : -1))

  const rows = data.map((record) => ({
    key: record[collection.primaryField],
    rows: headers.map(
      (header) =>
        record[header.label] ??
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
                  <Menu.Trigger className="cursor-pointer">
                    <BaseIcon icon={DotsThreeVerticalIcon} size="md" weight="bold" />
                  </Menu.Trigger>
                  <Menu.Content aria-label="Actions" placement="left top">
                    <Menu.Item>View</Menu.Item>
                    <Menu.Item>Edit</Menu.Item>
                    <Menu.Separator />
                    <Menu.Item isDanger>Delete</Menu.Item>
                  </Menu.Content>
                </Menu>
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
