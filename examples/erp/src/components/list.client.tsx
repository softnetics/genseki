'use client'

import type { AnyCollection, InferFields, ToClientCollection } from '@genseki/react'
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@genseki/react'

const tableDataExtract = <TCollection extends AnyCollection>(
  collection: ToClientCollection<TCollection>,
  data: InferFields<TCollection['fields']>[]
) => {
  const headers = Object.values(collection.fields).map((column) => {
    return { ...column, label: column.fieldName /* Fallback to key if no label */ }
  })

  headers.sort((a, b) => (b.label === collection.identifierColumn ? 1 : -1))

  const rows = data.map((record) => ({
    key: record.__id,
    rows: headers.map(
      (header) =>
        record[header.fieldName as keyof typeof record] ??
        'Unknown' /* Unknown meant that it's missing a correct heading label */
    ),
  }))

  return { headers, rows }
}

export type FieldsRenderFn<
  TCollection extends AnyCollection,
  TFields extends InferFields<TCollection['fields']> = InferFields<TCollection['fields']>,
> = { [key in keyof TFields]?: (data: TFields[key]) => React.ReactNode }

interface IListTableProps<TCollection extends AnyCollection> {
  collection: ToClientCollection<TCollection>
  data: InferFields<TCollection['fields']>[]
  renderCellFns?: FieldsRenderFn<TCollection>
}

export function ListTable<TCollection extends AnyCollection>(props: IListTableProps<TCollection>) {
  const { headers, rows } = tableDataExtract(props.collection, props.data)

  return (
    <>
      <Table
        bleed
        aria-label="Items"
        selectionMode="none"
        className="overflow-clip rounded-xl"
        allowResize
      >
        <TableHeader>
          {headers.map(({ label }) => (
            <TableColumn isResizable isRowHeader key={label}>
              {label}
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody items={rows}>
          {({ key, rows }) => (
            <TableRow href={`./${props.collection.slug}/update/${key}`} id={key}>
              {
                /* @ts-expect-error union type too complex */
                rows.map((cell, i) => {
                  const fieldName = headers[i].fieldName
                  let renderFn: (data: any) => React.ReactNode = JSON.stringify

                  if (!!props.renderCellFns && fieldName in props.renderCellFns)
                    renderFn =
                      props.renderCellFns[fieldName as keyof InferFields<TCollection['fields']>]!

                  return (
                    <TableCell key={`${i}-${JSON.stringify(cell)}`}>{renderFn(cell)}</TableCell>
                  )
                })
              }
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  )
}
