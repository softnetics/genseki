import {
  Column,
  FindTableByDBName,
  getTableName,
  One,
  Relation,
  Relations,
  Simplify,
  Table,
} from 'drizzle-orm'
import * as R from 'remeda'

import {
  appendFieldNameToFields,
  GetPrimaryColumn,
  getPrimaryColumn,
  getPrimaryColumnTsName,
} from './utils'

export type OptionCallback<
  TType extends string | number,
  TContext extends Record<string, unknown> = {},
> = (args: TContext) => Promise<Array<{ label: string; value: TType }>>

export interface FieldMetadataColumns {
  $source: 'columns'
  $columnTsName: string
  $column: Column
}

export interface FieldMetadataRelations {
  $source: 'relations'
  $fieldName: string
  $relation: Relation
  $primaryColumn: Column
  $primaryColumnTsName: string
}

export type FieldMetadata = FieldMetadataColumns | FieldMetadataRelations

export interface FieldColumnStringCollectionOptions<TContext extends Record<string, unknown> = {}> {
  text: {
    type: 'text'
    default?: string
    label?: string
    placeholder?: string
    // editor?: Editor // TODO: Support rich text editor
  }
  selectText: {
    type: 'selectText'
    options: OptionCallback<string, TContext>
    default?: string
    label?: string
    placeholder?: string
  }
  time: {
    type: 'time'
    default?: Date
    label?: string
    placeholder?: string
  }
  media: {
    type: 'media'
    mimeTypes: string[]
    label?: string
    placeholder?: string
  }
}

export interface FieldColumnStringArrayCollectionOptions<
  TContext extends Record<string, unknown> = {},
> {
  comboboxText: {
    type: 'comboboxText'
    options: OptionCallback<string, TContext>
    label?: string
    default?: string[]
    placeholder?: string
  }
}

export interface FieldColumnNumberCollectionOptions<TContext extends Record<string, unknown> = {}> {
  number: {
    type: 'number'
    default?: number
    label?: string
    placeholder?: string
  }
  selectNumber: {
    type: 'selectNumber'
    options: OptionCallback<number, TContext>
    default?: number
    label?: string
    placeholder?: string
  }
}

export interface FieldColumnNumberArrayCollectionOptions<
  TContext extends Record<string, unknown> = {},
> {
  comboboxNumber: {
    type: 'comboboxNumber'
    options: OptionCallback<number, TContext>
    label?: string
    default?: number[]
    placeholder?: string
  }
}

export interface FieldColumnBooleanCollectionOptions {
  checkbox: {
    type: 'checkbox'
    default?: boolean
    label?: string
    placeholder?: string
  }
  switch: {
    type: 'switch'
    default?: boolean
    label?: string
    placeholder?: string
  }
}

export interface FieldColumnBooleanArrayCollectionOptions {
  comboboxBoolean: {
    type: 'comboboxBoolean'
    default?: boolean[]
    label?: string
    placeholder?: string
  }
}

export interface FieldColumnDateCollectionOptions {
  date: {
    type: 'date'
    default?: Date
    label?: string
    placeholder?: string
  }
}

export type FieldRelationCollectionOptions<
  TContext extends Record<string, unknown> = {},
  TInputType extends string | number = string | number,
> = {
  connect: {
    type: 'connect'
    label?: string
    placeholder?: string
    options: OptionCallback<TInputType, TContext>
  }
  create: {
    type: 'create'
    label?: string
    placeholder?: string
    fields: Record<string, Field<TContext>>
  }
  connectOrCreate: {
    type: 'connectOrCreate'
    label?: string
    placeholder?: string
    fields: Record<string, Field<TContext>>
    options: OptionCallback<TInputType, TContext>
  }
}

export type FieldColumnCollection<TContext extends Record<string, unknown> = {}> =
  FieldColumnStringCollectionOptions<TContext> &
    FieldColumnStringArrayCollectionOptions<TContext> &
    FieldColumnNumberCollectionOptions<TContext> &
    FieldColumnNumberArrayCollectionOptions<TContext> &
    FieldColumnBooleanCollectionOptions &
    FieldColumnDateCollectionOptions

export type FieldColumn<TContext extends Record<string, unknown> = Record<string, unknown>> =
  FieldColumnCollection<TContext>[keyof FieldColumnCollection<TContext>] & {
    _: FieldMetadataColumns
  }

export type FieldRelationCollection<TContext extends Record<string, unknown> = {}> =
  FieldRelationCollectionOptions<TContext>

export type FieldRelation<TContext extends Record<string, unknown> = Record<string, unknown>> =
  FieldRelationCollection<TContext>[keyof FieldRelationCollection<TContext>] & {
    _: FieldMetadataRelations
    mode: 'one' | 'many'
  }

export type FieldCollection<TContext extends Record<string, unknown> = Record<string, unknown>> =
  FieldColumnCollection<TContext> & FieldRelationCollection<TContext>

export type FieldOptions<TContext extends Record<string, unknown> = Record<string, unknown>> =
  FieldCollection<TContext>[keyof FieldCollection<TContext>]

export type Field<TContext extends Record<string, unknown> = Record<string, unknown>> =
  | FieldColumn<TContext>
  | FieldRelation<TContext>

export type BaseField = Omit<Field, 'options'>

type ColumnKeysFromTable<TTable extends Table> = Extract<keyof TTable['_']['columns'], string>

export type FieldColumnOptionsFromTable<
  TColumn extends Column,
  TContext extends Record<string, unknown> = Record<string, unknown>,
> = TColumn['_']['dataType'] extends 'string'
  ? FieldColumnStringCollectionOptions<TContext>[keyof FieldColumnStringCollectionOptions<TContext>]
  : TColumn['_']['dataType'] extends 'number'
    ? FieldColumnNumberCollectionOptions<TContext>[keyof FieldColumnNumberCollectionOptions<TContext>]
    : TColumn['_']['dataType'] extends 'boolean'
      ? FieldColumnBooleanCollectionOptions[keyof FieldColumnBooleanCollectionOptions]
      : TColumn['_']['dataType'] extends 'date'
        ? FieldColumnDateCollectionOptions[keyof FieldColumnDateCollectionOptions]
        : TColumn['_']['dataType'] extends 'array'
          ? TColumn['_']['data'] extends string[]
            ? FieldColumnStringArrayCollectionOptions<TContext>[keyof FieldColumnStringArrayCollectionOptions<TContext>]
            : TColumn['_']['data'] extends number[]
              ? FieldColumnNumberArrayCollectionOptions<TContext>[keyof FieldColumnNumberArrayCollectionOptions<TContext>]
              : TColumn['_']['data'] extends boolean[]
                ? FieldColumnBooleanArrayCollectionOptions[keyof FieldColumnBooleanArrayCollectionOptions]
                : never
          : never

type RelationFieldOptionsFromTable<
  TRelationPrimaryColumn extends Column,
  TContext extends Record<string, unknown> = {},
> = TRelationPrimaryColumn['_']['data'] extends infer TType extends string | number
  ? FieldRelationCollectionOptions<TContext, TType>['connect' | 'create' | 'connectOrCreate']
  : TRelationPrimaryColumn

type GetReferencedPrimaryColumn<
  TTableRelationConfigByTableTsName extends Record<string, TableRelationalConfig>,
  TRelation extends Relation,
> =
  FindTableByDBName<
    TTableRelationConfigByTableTsName,
    TRelation['referencedTableName']
  > extends infer TReferencedTableRelationalConfig extends TableRelationalConfig
    ? GetPrimaryColumn<TReferencedTableRelationalConfig>
    : never

type GetReferencedTableTsName<
  TTableRelationConfigByTableTsName extends Record<string, TableRelationalConfig>,
  TRelation extends Relation,
> =
  FindTableByDBName<
    TTableRelationConfigByTableTsName,
    TRelation['referencedTableName']
  > extends infer TReferencedTableRelationalConfig extends TableRelationalConfig
    ? TReferencedTableRelationalConfig['tsName']
    : never
}[keyof TTable['_']['columns']]

type RelationKeysFromTable<
  TFullSchema extends Record<string, unknown>,
  TTable extends Table,
> = Extract<keyof ExtractTableRelationsFromSchema<TFullSchema, TTable['_']['name']>, string>

type RelationFieldOptionsFromTable<
  TFullSchema extends Record<string, unknown>,
  TRelation extends Relation,
  TContext extends Record<string, unknown> = {},
> = GetPrimaryColumn<
  FindTableByTableName<TFullSchema, TRelation['referencedTableName']>
>['_']['dataType'] extends 'string'
  ? FieldRelationCollectionOptions<TContext, string>['connect' | 'create' | 'connectOrCreate']
  : GetPrimaryColumn<
        FindTableByTableName<TFullSchema, TRelation['referencedTableName']>
      >['_']['dataType'] extends 'number'
    ? FieldRelationCollectionOptions<TContext, number>['connect' | 'create' | 'connectOrCreate']
    : never

export class FieldBuilder<
  TFullSchema extends Record<string, unknown>,
  TTableName extends string,
  TContext extends Record<string, unknown> = {},
  TTable extends Table = FindTableByTableName<TFullSchema, TTableName>,
> {
  protected _table: TTable | null = null
  protected _relations: Relations<TTableName, Record<string, Relation<TTableName>>> | null = null

  constructor(
    fullSchema: TFullSchema,
    private readonly tableName: string,
    private readonly context?: TContext
  ) {
    for (const value of R.values(fullSchema)) {
      if (value instanceof Table && getTableName(value) === this.tableName) {
        this._table = value as typeof this._table
      }
      if (value instanceof Relations && getTableName(value.table) === this.tableName) {
        this._relations = value
      }
    }
  }

  columns<
    TColumnKey extends ColumnKeysFromTable<TTable>,
    TOptions extends FieldColumnOptionsFromTable<TTable['_']['columns'][TColumnKey], TContext>,
  >(columnKey: TColumnKey, options: TOptions) {
    if (!this._table) throw new Error(`Table not found for table ${this.tableName}`)

    const fieldMetadata = {
      $source: 'columns',
      $columnTsName: columnKey,
      $column: getTableColumns(this._table)[columnKey] as TTable['_']['columns'][TColumnKey],
    } satisfies FieldMetadata

    return {
      _: fieldMetadata,
      ...options,
    } as Simplify<TOptions & { _: typeof fieldMetadata }>
  }

  relations<
    TRelationTsName extends Extract<
      keyof TTableRelationConfigByTableTsName[TTableTsName]['relations'],
      string
    >,
    const TOptions extends RelationFieldOptionsFromTable<
      GetReferencedPrimaryColumn<
        TTableRelationConfigByTableTsName,
        TTableRelationConfigByTableTsName[TTableTsName]['relations'][TRelationTsName]
      >,
      TContext
    >,
  >(
    relationTsName: TRelationTsName,
    optionsFn: (
      fb: FieldBuilder<
        TFullSchema,
        TTableRelationConfigByTableTsName,
        GetReferencedTableTsName<
          TTableRelationConfigByTableTsName,
          TTableRelationConfigByTableTsName[TTableTsName]['relations'][TRelationTsName]
        >,
        TContext
      >
    ) => TOptions
  ) {
    const relation = this.tableRelationalConfig['relations'][
      relationTsName
    ] as TTableRelationConfigByTableTsName[TTableTsName]['relations'][TRelationTsName]

    type GetRelationMode<TRelation extends Relation> = TRelation extends One ? 'one' : 'many'

    const relationsConfig = this._relations.config(
      createTableRelationsHelpers(this._relations.table)
    )

    const relation = relationsConfig[path]

    const primaryColumnEntry = R.entries(
      getTableColumns(relationsConfig[path].referencedTable)
    ).find(([_, column]) => column.primary)

    if (!primaryColumnEntry) throw new Error(`Primary column not found for relation ${path}`)

    type ReferencedTable = FindTableByTableName<
      TFullSchema,
      TRelations[TPath]['referencedTableName']
    >

    const referencedTableRelationalConfig = Object.values(
      this.tableRelationalConfigByTableTsName
    ).find((t) => t.dbName === relation.referencedTableName) as
      | ReferencedTableRelationalConfig
      | undefined
    if (!referencedTableRelationalConfig) {
      throw new Error(`Referenced table ${relation.referencedTableName} not found in schema`)
    }

    type SourceTableRelationalConfig = FindTableByDBName<
      TTableRelationConfigByTableTsName,
      TTableRelationConfigByTableTsName[TTableTsName]['relations'][TRelationTsName]['sourceTable']['_']['name']
    >

    const sourceTableRelationalConfig = Object.values(this.tableRelationalConfigByTableTsName).find(
      (t) => t.dbName === getTableName(relation.sourceTable)
    ) as SourceTableRelationalConfig | undefined
    if (!sourceTableRelationalConfig) {
      throw new Error(`Source table ${relation.sourceTable._.name} not found in schema`)
    }

    const primaryColumn = getPrimaryColumn(referencedTableRelationalConfig)
    const primaryColumnTsName = getPrimaryColumnTsName(referencedTableRelationalConfig)

    const fb = new FieldBuilder(
      referencedTableRelationalConfig.tsName,
      this.tableRelationalConfigByTableTsName
    ) as FieldBuilder<
      TFullSchema,
      TTableRelationConfigByTableTsName,
      GetReferencedTableTsName<
        TTableRelationConfigByTableTsName,
        TTableRelationConfigByTableTsName[TTableTsName]['relations'][TRelationTsName]
      >,
      TContext
    >

    const options = optionsFn(fb)

    if (options.type === 'connectOrCreate' || options.type === 'create') {
      options.fields = appendFieldNameToFields(options.fields)
    }

    const fieldMetadata = {
      $source: 'relations',
      $fieldName: path,
      $relation: relationsConfig[path] as unknown as TRelations[TPath],
      $primaryColumn: primaryColumnEntry[1] as GetPrimaryColumn<ReferencedTable>,
      $primaryColumnTsName: primaryColumnEntry[0],
    } satisfies FieldMetadata

    const mode = (relation instanceof One ? 'one' : 'many') as GetRelationMode<TRelations[TPath]>

    return {
      _: fieldMetadata,
      ...options,
      mode,
    } as Simplify<
      Result &
        (Result extends FieldRelationCollection<any>['connectOrCreate' | 'create']
          ? { fields: FieldsWithFieldName<Result['fields']> }
          : {})
    >
  }

  fields<TFields extends FieldsInitial<TContext>>(
    tableTsName: TTableTsName,
    optionsFn: (
      fb: FieldBuilder<TFullSchema, TTableRelationConfigByTableTsName, TTableTsName, TContext>
    ) => TFields
  ): Simplify<FieldsWithFieldName<TFields>> {
    const fb = new FieldBuilder(tableTsName, this.tableRelationalConfigByTableTsName)
    return appendFieldNameToFields(optionsFn(fb as any))
  }
}
