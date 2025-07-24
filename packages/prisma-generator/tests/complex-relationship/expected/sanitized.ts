import {
  DataType,
  type ModelConfig,
  type SanitizedModelSchema,
  type SanitizedModelShape,
  SchemaType,
  type Simplify,
} from '@genseki/react'

/**
 * Creates a sanitized model with the given shape and config.
 * @param {TShape} shape The shape of the model
 * @param {TConfig} config The configuration of the model
 * @returns {SanitizedModel<TShape>} A sanitized model containing the shape and config
 */
function model<const TShape extends SanitizedModelShape, const TConfig extends ModelConfig>(
  shape: TShape,
  config: TConfig
): SanitizedModelSchema<TShape, TConfig> {
  return { config, shape }
}

export const TableAModel = model(
  {
    columns: {
      id: {
        schema: SchemaType.COLUMN,
        name: 'id',
        isId: true,
        isList: false,
        isUnique: false,
        isReadOnly: false,
        isRequired: true,
        hasDefaultValue: false,
        dataType: DataType.STRING,
      },
      name: {
        schema: SchemaType.COLUMN,
        name: 'name',
        isId: false,
        isList: false,
        isUnique: false,
        isReadOnly: false,
        isRequired: true,
        hasDefaultValue: false,
        dataType: DataType.STRING,
      },
      description: {
        schema: SchemaType.COLUMN,
        name: 'description',
        isId: false,
        isList: false,
        isUnique: false,
        isReadOnly: false,
        isRequired: false,
        hasDefaultValue: false,
        dataType: DataType.STRING,
      },
      createdAt: {
        schema: SchemaType.COLUMN,
        name: 'createdAt',
        isId: false,
        isList: false,
        isUnique: false,
        isReadOnly: false,
        isRequired: true,
        hasDefaultValue: true,
        dataType: DataType.DATETIME,
      },
      updatedAt: {
        schema: SchemaType.COLUMN,
        name: 'updatedAt',
        isId: false,
        isList: false,
        isUnique: false,
        isReadOnly: false,
        isRequired: true,
        hasDefaultValue: false,
        dataType: DataType.DATETIME,
      },
    },
    relations: {
      tableB: {
        schema: SchemaType.RELATION,
        name: 'tableB',
        isId: false,
        isList: true,
        isUnique: false,
        isReadOnly: false,
        isRequired: true,
        hasDefaultValue: false,
        relationName: 'TableAToTableB',
        referencedModel: 'TableB',
        relationToFields: [],
        relationFromFields: [],
        relationDataTypes: [],
      },
      tableC: {
        schema: SchemaType.RELATION,
        name: 'tableC',
        isId: false,
        isList: true,
        isUnique: false,
        isReadOnly: false,
        isRequired: true,
        hasDefaultValue: false,
        relationName: 'TableAToTableC',
        referencedModel: 'TableC',
        relationToFields: [],
        relationFromFields: [],
        relationDataTypes: [],
      },
    },
    primaryFields: ['id'],
    uniqueFields: [['id']],
  },
  {
    name: 'TableAModel',
    dbModelName: 'TableA',
    prismaModelName: 'tableA',
  }
)

export type TableAModel = Simplify<typeof TableAModel>

export const TableBModel = model(
  {
    columns: {
      id: {
        schema: SchemaType.COLUMN,
        name: 'id',
        isId: true,
        isList: false,
        isUnique: false,
        isReadOnly: false,
        isRequired: true,
        hasDefaultValue: false,
        dataType: DataType.STRING,
      },
      name: {
        schema: SchemaType.COLUMN,
        name: 'name',
        isId: false,
        isList: false,
        isUnique: false,
        isReadOnly: false,
        isRequired: true,
        hasDefaultValue: false,
        dataType: DataType.STRING,
      },
      description: {
        schema: SchemaType.COLUMN,
        name: 'description',
        isId: false,
        isList: false,
        isUnique: false,
        isReadOnly: false,
        isRequired: false,
        hasDefaultValue: false,
        dataType: DataType.STRING,
      },
      createdAt: {
        schema: SchemaType.COLUMN,
        name: 'createdAt',
        isId: false,
        isList: false,
        isUnique: false,
        isReadOnly: false,
        isRequired: true,
        hasDefaultValue: true,
        dataType: DataType.DATETIME,
      },
      updatedAt: {
        schema: SchemaType.COLUMN,
        name: 'updatedAt',
        isId: false,
        isList: false,
        isUnique: false,
        isReadOnly: false,
        isRequired: true,
        hasDefaultValue: false,
        dataType: DataType.DATETIME,
      },
      tableCId: {
        schema: SchemaType.COLUMN,
        name: 'tableCId',
        isId: false,
        isList: false,
        isUnique: false,
        isReadOnly: true,
        isRequired: true,
        hasDefaultValue: false,
        dataType: DataType.STRING,
      },
    },
    relations: {
      tableA: {
        schema: SchemaType.RELATION,
        name: 'tableA',
        isId: false,
        isList: true,
        isUnique: false,
        isReadOnly: false,
        isRequired: true,
        hasDefaultValue: false,
        relationName: 'TableAToTableB',
        referencedModel: 'TableA',
        relationToFields: [],
        relationFromFields: [],
        relationDataTypes: [],
      },
      tableC: {
        schema: SchemaType.RELATION,
        name: 'tableC',
        isId: false,
        isList: false,
        isUnique: false,
        isReadOnly: false,
        isRequired: true,
        hasDefaultValue: false,
        relationName: 'TableBToTableC',
        referencedModel: 'TableC',
        relationToFields: ['id'],
        relationFromFields: ['tableCId'],
        relationDataTypes: [DataType.STRING],
      },
    },
    primaryFields: ['id'],
    uniqueFields: [['id']],
  },
  {
    name: 'TableBModel',
    dbModelName: 'TableB',
    prismaModelName: 'tableB',
  }
)

export type TableBModel = Simplify<typeof TableBModel>

export const TableCModel = model(
  {
    columns: {
      id: {
        schema: SchemaType.COLUMN,
        name: 'id',
        isId: true,
        isList: false,
        isUnique: false,
        isReadOnly: false,
        isRequired: true,
        hasDefaultValue: false,
        dataType: DataType.STRING,
      },
      name: {
        schema: SchemaType.COLUMN,
        name: 'name',
        isId: false,
        isList: false,
        isUnique: false,
        isReadOnly: false,
        isRequired: true,
        hasDefaultValue: false,
        dataType: DataType.STRING,
      },
      description: {
        schema: SchemaType.COLUMN,
        name: 'description',
        isId: false,
        isList: false,
        isUnique: false,
        isReadOnly: false,
        isRequired: false,
        hasDefaultValue: false,
        dataType: DataType.STRING,
      },
      createdAt: {
        schema: SchemaType.COLUMN,
        name: 'createdAt',
        isId: false,
        isList: false,
        isUnique: false,
        isReadOnly: false,
        isRequired: true,
        hasDefaultValue: true,
        dataType: DataType.DATETIME,
      },
      updatedAt: {
        schema: SchemaType.COLUMN,
        name: 'updatedAt',
        isId: false,
        isList: false,
        isUnique: false,
        isReadOnly: false,
        isRequired: true,
        hasDefaultValue: false,
        dataType: DataType.DATETIME,
      },
    },
    relations: {
      tableA: {
        schema: SchemaType.RELATION,
        name: 'tableA',
        isId: false,
        isList: true,
        isUnique: false,
        isReadOnly: false,
        isRequired: true,
        hasDefaultValue: false,
        relationName: 'TableAToTableC',
        referencedModel: 'TableA',
        relationToFields: [],
        relationFromFields: [],
        relationDataTypes: [],
      },
      tableB: {
        schema: SchemaType.RELATION,
        name: 'tableB',
        isId: false,
        isList: true,
        isUnique: false,
        isReadOnly: false,
        isRequired: true,
        hasDefaultValue: false,
        relationName: 'TableBToTableC',
        referencedModel: 'TableB',
        relationToFields: [],
        relationFromFields: [],
        relationDataTypes: [],
      },
    },
    primaryFields: ['id'],
    uniqueFields: [['id']],
  },
  {
    name: 'TableCModel',
    dbModelName: 'TableC',
    prismaModelName: 'tableC',
  }
)

export type TableCModel = Simplify<typeof TableCModel>

export const SanitizedFullModelSchemas = {
  tableA: TableAModel,
  tableB: TableBModel,
  tableC: TableCModel,
}

export type SanitizedFullModelSchemas = Simplify<typeof SanitizedFullModelSchemas>
