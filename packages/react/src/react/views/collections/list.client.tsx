'use client'

import { useState } from 'react'

import { TrashIcon } from '@phosphor-icons/react'
import {
  CaretLeftIcon,
  DotsThreeVerticalIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
} from '@phosphor-icons/react/dist/ssr'

import type { FieldsClient } from '../../../core'
import {
  Button,
  ButtonLink,
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  TextField,
} from '../../components'
import { BaseIcon } from '../../components/primitives/base-icon'
import { useNavigation } from '../../providers'
import { useServerFunction } from '../../providers/root'

// Maybe tanstack-hooks-form is more reasonable for this, but the clock is ticking fr fr nocap
const tableDataExtract = (
  data: any[],
  options: { fields: FieldsClient; identifierColumn: string }
) => {
  const headers = Object.values(options.fields.shape).map((column) => {
    return { ...column, label: column.$client.fieldName /* Fallback to key if no label */ }
  })

  headers.sort((a, b) => (b.label === options.identifierColumn ? 1 : -1))

  // `isCooked` header is not sent
  const rows = data.map((record) => ({
    key: record.__id,
    rows: headers.map(
      (header) =>
        record[header.$client.fieldName] ??
        'Unknown' /* Unknown meant that it's missing a correct heading label */
    ),
  }))

  return { headers, rows }
}

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

interface ListTableProps {
  slug: string
  identifierColumn: string
  fields: FieldsClient
  data: any[]
}

export function ListTable(props: ListTableProps) {
  const serverFunction = useServerFunction()
  const navigation = useNavigation()

  const [selection, setSelection] = useState<string[]>([])

  const { headers, rows } = tableDataExtract(props.data, {
    fields: props.fields,
    identifierColumn: props.identifierColumn,
  })

  return (
    <>
      <Toolbar slug={props.slug} selection={selection} setSelection={setSelection} />
      <Table
        bleed
        aria-label="Items"
        selectionMode="multiple"
        className="overflow-clip rounded-xl"
        allowResize
        onSelectionChange={(data) => {
          if (data === 'all') setSelection(rows.map((r) => r.key))
          else setSelection(Array.from(data) as string[])
        }}
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
            <TableRow href={`./${props.slug}/update/${key}`} id={key}>
              {rows.map((cell) => (
                // TODO: Make this right
                <TableCell key={JSON.stringify(cell)}>{JSON.stringify(cell, null)}</TableCell>
              ))}
              <TableCell>
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
                            body: { ids: [key] },
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
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  )
}
