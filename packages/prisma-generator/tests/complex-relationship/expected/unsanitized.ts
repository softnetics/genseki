import { type DataType, type SchemaType, unsanitizedModelSchemas } from '@genseki/react'

import { SanitizedFullModelSchemas } from './sanitized'

export interface TableAModelConfig {
  name: 'TableAModel'
  dbModelName: 'TableA'
  prismaModelName: 'tableA'
}

export interface TableAModelShape {
  columns: {
    id: {
      schema: typeof SchemaType.COLUMN
      name: 'id'
      isId: true
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: true
      hasDefaultValue: false
      dataType: typeof DataType.STRING
    }
    name: {
      schema: typeof SchemaType.COLUMN
      name: 'name'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: true
      hasDefaultValue: false
      dataType: typeof DataType.STRING
    }
    description: {
      schema: typeof SchemaType.COLUMN
      name: 'description'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: false
      hasDefaultValue: false
      dataType: typeof DataType.STRING
    }
    createdAt: {
      schema: typeof SchemaType.COLUMN
      name: 'createdAt'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: true
      hasDefaultValue: true
      dataType: typeof DataType.DATETIME
    }
    updatedAt: {
      schema: typeof SchemaType.COLUMN
      name: 'updatedAt'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: true
      hasDefaultValue: false
      dataType: typeof DataType.DATETIME
    }
  }
  relations: {
    tableB: {
      schema: typeof SchemaType.RELATION
      name: 'tableB'
      isId: false
      isList: true
      isUnique: false
      isReadOnly: false
      isRequired: true
      hasDefaultValue: false
      relationName: 'TableAToTableB'
      referencedModel: TableBModel
      relationToFields: []
      relationFromFields: []
      relationDataTypes: [typeof DataType.STRING]
    }
    tableC: {
      schema: typeof SchemaType.RELATION
      name: 'tableC'
      isId: false
      isList: true
      isUnique: false
      isReadOnly: false
      isRequired: true
      hasDefaultValue: false
      relationName: 'TableAToTableC'
      referencedModel: TableCModel
      relationToFields: []
      relationFromFields: []
      relationDataTypes: [typeof DataType.STRING]
    }
  }
  primaryFields: ['id']
  uniqueFields: [['id']]
}

export interface TableAModel {
  shape: TableAModelShape
  config: TableAModelConfig
}

export interface TableBModelConfig {
  name: 'TableBModel'
  dbModelName: 'TableB'
  prismaModelName: 'tableB'
}

export interface TableBModelShape {
  columns: {
    id: {
      schema: typeof SchemaType.COLUMN
      name: 'id'
      isId: true
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: true
      hasDefaultValue: false
      dataType: typeof DataType.STRING
    }
    name: {
      schema: typeof SchemaType.COLUMN
      name: 'name'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: true
      hasDefaultValue: false
      dataType: typeof DataType.STRING
    }
    description: {
      schema: typeof SchemaType.COLUMN
      name: 'description'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: false
      hasDefaultValue: false
      dataType: typeof DataType.STRING
    }
    createdAt: {
      schema: typeof SchemaType.COLUMN
      name: 'createdAt'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: true
      hasDefaultValue: true
      dataType: typeof DataType.DATETIME
    }
    updatedAt: {
      schema: typeof SchemaType.COLUMN
      name: 'updatedAt'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: true
      hasDefaultValue: false
      dataType: typeof DataType.DATETIME
    }
    tableCId: {
      schema: typeof SchemaType.COLUMN
      name: 'tableCId'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: true
      isRequired: true
      hasDefaultValue: false
      dataType: typeof DataType.STRING
    }
  }
  relations: {
    tableA: {
      schema: typeof SchemaType.RELATION
      name: 'tableA'
      isId: false
      isList: true
      isUnique: false
      isReadOnly: false
      isRequired: true
      hasDefaultValue: false
      relationName: 'TableAToTableB'
      referencedModel: TableAModel
      relationToFields: []
      relationFromFields: []
      relationDataTypes: [typeof DataType.STRING]
    }
    tableC: {
      schema: typeof SchemaType.RELATION
      name: 'tableC'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: true
      hasDefaultValue: false
      relationName: 'TableBToTableC'
      referencedModel: TableCModel
      relationToFields: ['id']
      relationFromFields: ['id']
      relationDataTypes: [typeof DataType.STRING]
    }
  }
  primaryFields: ['id']
  uniqueFields: [['id']]
}

export interface TableBModel {
  shape: TableBModelShape
  config: TableBModelConfig
}

export interface TableCModelConfig {
  name: 'TableCModel'
  dbModelName: 'TableC'
  prismaModelName: 'tableC'
}

export interface TableCModelShape {
  columns: {
    id: {
      schema: typeof SchemaType.COLUMN
      name: 'id'
      isId: true
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: true
      hasDefaultValue: false
      dataType: typeof DataType.STRING
    }
    name: {
      schema: typeof SchemaType.COLUMN
      name: 'name'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: true
      hasDefaultValue: false
      dataType: typeof DataType.STRING
    }
    description: {
      schema: typeof SchemaType.COLUMN
      name: 'description'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: false
      hasDefaultValue: false
      dataType: typeof DataType.STRING
    }
    createdAt: {
      schema: typeof SchemaType.COLUMN
      name: 'createdAt'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: true
      hasDefaultValue: true
      dataType: typeof DataType.DATETIME
    }
    updatedAt: {
      schema: typeof SchemaType.COLUMN
      name: 'updatedAt'
      isId: false
      isList: false
      isUnique: false
      isReadOnly: false
      isRequired: true
      hasDefaultValue: false
      dataType: typeof DataType.DATETIME
    }
  }
  relations: {
    tableA: {
      schema: typeof SchemaType.RELATION
      name: 'tableA'
      isId: false
      isList: true
      isUnique: false
      isReadOnly: false
      isRequired: true
      hasDefaultValue: false
      relationName: 'TableAToTableC'
      referencedModel: TableAModel
      relationToFields: []
      relationFromFields: []
      relationDataTypes: [typeof DataType.STRING]
    }
    tableB: {
      schema: typeof SchemaType.RELATION
      name: 'tableB'
      isId: false
      isList: true
      isUnique: false
      isReadOnly: false
      isRequired: true
      hasDefaultValue: false
      relationName: 'TableBToTableC'
      referencedModel: TableBModel
      relationToFields: []
      relationFromFields: []
      relationDataTypes: [typeof DataType.STRING]
    }
  }
  primaryFields: ['id']
  uniqueFields: [['id']]
}

export interface TableCModel {
  shape: TableCModelShape
  config: TableCModelConfig
}

export type FullModelSchemas = {
  tableA: TableAModel
  tableB: TableBModel
  tableC: TableCModel
} & {}

export const FullModelSchemas = unsanitizedModelSchemas<FullModelSchemas>(SanitizedFullModelSchemas)
