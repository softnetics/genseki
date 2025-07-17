import { type DataType, type SchemaType } from '@genseki/prisma-generator'

export interface TableAModelConfig {
  name: 'TableAModel'
  dbModelName: 'TableA'
  prismaModelName: 'TableA'
  primaryFields: ['id']
  uniqueFields: [['id']]
}

export interface TableAModelShape {
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
  }
}

export interface TableAModel {
  shape: TableAModelShape
  config: TableAModelConfig
}

export interface TableBModelConfig {
  name: 'TableBModel'
  dbModelName: 'TableB'
  prismaModelName: 'TableB'
  primaryFields: ['id']
  uniqueFields: [['id']]
}

export interface TableBModelShape {
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
  }
}

export interface TableBModel {
  shape: TableBModelShape
  config: TableBModelConfig
}

export interface TableCModelConfig {
  name: 'TableCModel'
  dbModelName: 'TableC'
  prismaModelName: 'TableC'
  primaryFields: ['id']
  uniqueFields: [['id']]
}

export interface TableCModelShape {
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
  }
}

export interface TableCModel {
  shape: TableCModelShape
  config: TableCModelConfig
}
