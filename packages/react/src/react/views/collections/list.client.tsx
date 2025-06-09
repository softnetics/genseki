'use client'

import { useState } from 'react'

import { TrashIcon } from '@phosphor-icons/react'
import {
  CaretLeftIcon,
  DotsThreeVerticalIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
} from '@phosphor-icons/react/dist/ssr'

import type { ClientCollection, FieldsClient, InferFieldsFromCollection } from '@genseki/react'

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
import { useServerFunction } from '../../providers/root'

// Maybe tanstack-hooks-form is more reasonable for this, but the clock is ticking fr fr nocap
const tableDataExtract = <
  TCollection extends ClientCollection<any, any, any, any, FieldsClient, any>,
>(
  collection: TCollection,
  data: InferFieldsFromCollection<TCollection>[]
) => {
  const headers = Object.values(collection.fields).map((column) => {
    return { ...column, label: column.fieldName /* Fallback to key if no label */ }
  })

  headers.sort((a, b) => (b.label === collection.identifierColumn ? 1 : -1))

  const rows = data.map((record) => ({
    key: record.__id,
    rows: headers.map(
      (header) =>
        record[header.fieldName] ??
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
  // const router = useRouter()
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
              await serverFunction({
                method: `${props.slug}.delete`,
                body: { ids: props.selection },
                headers: {},
                pathParams: {},
                query: {},
              })
              props.setSelection([])
              // TODO: Find the another way to refresh the page
              // router.refresh()
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

export function ListTable<
  TCollection extends ClientCollection<string, any, any, any, FieldsClient, any>,
>(props: { collection: TCollection; data: InferFieldsFromCollection<TCollection>[] }) {
  const serverFunction = useServerFunction()

  const [selection, setSelection] = useState<string[]>([])

  const { headers, rows } = tableDataExtract(props.collection, props.data)

  return (
    <>
      <Toolbar slug={props.collection.slug} selection={selection} setSelection={setSelection} />
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
            <TableRow href={`./${props.collection.slug}/update/${key}`} id={key}>
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
                          await serverFunction({
                            method: `${props.collection.slug}.delete`,
                            body: { ids: [key] },
                            headers: {},
                            pathParams: {},
                            query: {},
                          })
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
