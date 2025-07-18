import { type DataType, type SchemaType } from '@genseki/react'

export interface DataModelConfig {
  name: 'DataModel'
  dbModelName: 'Data'
  prismaModelName: 'Data'
  primaryFields: ['id']
  uniqueFields: [['id']]
}

export interface DataModelShape {
  id: {
    schema: typeof SchemaType.COLUMN
    name: 'id'
    isId: true
    isList: false
    isUnique: false
    isReadOnly: false
    isRequired: true
    hasDefaultValue: false
    dataType: typeof DataType.INT
  }
  stringField: {
    schema: typeof SchemaType.COLUMN
    name: 'stringField'
    isId: false
    isList: false
    isUnique: false
    isReadOnly: false
    isRequired: true
    hasDefaultValue: false
    dataType: typeof DataType.STRING
  }
  booleanField: {
    schema: typeof SchemaType.COLUMN
    name: 'booleanField'
    isId: false
    isList: false
    isUnique: false
    isReadOnly: false
    isRequired: true
    hasDefaultValue: false
    dataType: typeof DataType.BOOLEAN
  }
  intField: {
    schema: typeof SchemaType.COLUMN
    name: 'intField'
    isId: false
    isList: false
    isUnique: false
    isReadOnly: false
    isRequired: true
    hasDefaultValue: false
    dataType: typeof DataType.INT
  }
  bigIntField: {
    schema: typeof SchemaType.COLUMN
    name: 'bigIntField'
    isId: false
    isList: false
    isUnique: false
    isReadOnly: false
    isRequired: true
    hasDefaultValue: false
    dataType: typeof DataType.BIGINT
  }
  floatField: {
    schema: typeof SchemaType.COLUMN
    name: 'floatField'
    isId: false
    isList: false
    isUnique: false
    isReadOnly: false
    isRequired: true
    hasDefaultValue: false
    dataType: typeof DataType.FLOAT
  }
  decimalField: {
    schema: typeof SchemaType.COLUMN
    name: 'decimalField'
    isId: false
    isList: false
    isUnique: false
    isReadOnly: false
    isRequired: true
    hasDefaultValue: false
    dataType: typeof DataType.DECIMAL
  }
  dateField: {
    schema: typeof SchemaType.COLUMN
    name: 'dateField'
    isId: false
    isList: false
    isUnique: false
    isReadOnly: false
    isRequired: true
    hasDefaultValue: false
    dataType: typeof DataType.DATETIME
  }
  jsonField: {
    schema: typeof SchemaType.COLUMN
    name: 'jsonField'
    isId: false
    isList: false
    isUnique: false
    isReadOnly: false
    isRequired: true
    hasDefaultValue: false
    dataType: typeof DataType.JSON
  }
  bytesField: {
    schema: typeof SchemaType.COLUMN
    name: 'bytesField'
    isId: false
    isList: false
    isUnique: false
    isReadOnly: false
    isRequired: true
    hasDefaultValue: false
    dataType: typeof DataType.BYTES
  }
  enumField: {
    schema: typeof SchemaType.COLUMN
    name: 'enumField'
    isId: false
    isList: false
    isUnique: false
    isReadOnly: false
    isRequired: true
    hasDefaultValue: false
    dataType: typeof DataType.STRING
    enumValues: ['Apple', 'Banana', 'Orange', 'Pear']
  }
  relationId: {
    schema: typeof SchemaType.COLUMN
    name: 'relationId'
    isId: false
    isList: false
    isUnique: false
    isReadOnly: true
    isRequired: true
    hasDefaultValue: false
    dataType: typeof DataType.INT
  }
  relationField: {
    schema: typeof SchemaType.RELATION
    name: 'relationField'
    isId: false
    isList: false
    isUnique: false
    isReadOnly: false
    isRequired: true
    hasDefaultValue: false
    relationName: 'DataToRelationA'
    referencedModel: RelationAModel
    relationToFields: ['id']
    relationFromFields: ['id']
    relationDataTypes: [typeof DataType.STRING]
  }
  optionalStringField: {
    schema: typeof SchemaType.COLUMN
    name: 'optionalStringField'
    isId: false
    isList: false
    isUnique: false
    isReadOnly: false
    isRequired: false
    hasDefaultValue: false
    dataType: typeof DataType.STRING
  }
  optionalBooleanField: {
    schema: typeof SchemaType.COLUMN
    name: 'optionalBooleanField'
    isId: false
    isList: false
    isUnique: false
    isReadOnly: false
    isRequired: false
    hasDefaultValue: false
    dataType: typeof DataType.BOOLEAN
  }
  optionalIntField: {
    schema: typeof SchemaType.COLUMN
    name: 'optionalIntField'
    isId: false
    isList: false
    isUnique: false
    isReadOnly: false
    isRequired: false
    hasDefaultValue: false
    dataType: typeof DataType.INT
  }
  optionalBigIntField: {
    schema: typeof SchemaType.COLUMN
    name: 'optionalBigIntField'
    isId: false
    isList: false
    isUnique: false
    isReadOnly: false
    isRequired: false
    hasDefaultValue: false
    dataType: typeof DataType.BIGINT
  }
  optionalFloatField: {
    schema: typeof SchemaType.COLUMN
    name: 'optionalFloatField'
    isId: false
    isList: false
    isUnique: false
    isReadOnly: false
    isRequired: false
    hasDefaultValue: false
    dataType: typeof DataType.FLOAT
  }
  optionalDecimalField: {
    schema: typeof SchemaType.COLUMN
    name: 'optionalDecimalField'
    isId: false
    isList: false
    isUnique: false
    isReadOnly: false
    isRequired: false
    hasDefaultValue: false
    dataType: typeof DataType.DECIMAL
  }
  optionalDateField: {
    schema: typeof SchemaType.COLUMN
    name: 'optionalDateField'
    isId: false
    isList: false
    isUnique: false
    isReadOnly: false
    isRequired: false
    hasDefaultValue: false
    dataType: typeof DataType.DATETIME
  }
  optionalJsonField: {
    schema: typeof SchemaType.COLUMN
    name: 'optionalJsonField'
    isId: false
    isList: false
    isUnique: false
    isReadOnly: false
    isRequired: false
    hasDefaultValue: false
    dataType: typeof DataType.JSON
  }
  optionalBytesField: {
    schema: typeof SchemaType.COLUMN
    name: 'optionalBytesField'
    isId: false
    isList: false
    isUnique: false
    isReadOnly: false
    isRequired: false
    hasDefaultValue: false
    dataType: typeof DataType.BYTES
  }
  optionalEnumField: {
    schema: typeof SchemaType.COLUMN
    name: 'optionalEnumField'
    isId: false
    isList: false
    isUnique: false
    isReadOnly: false
    isRequired: false
    hasDefaultValue: false
    dataType: typeof DataType.STRING
    enumValues: ['Apple', 'Banana', 'Orange', 'Pear']
  }
  optionalRelationField: {
    schema: typeof SchemaType.RELATION
    name: 'optionalRelationField'
    isId: false
    isList: false
    isUnique: false
    isReadOnly: false
    isRequired: false
    hasDefaultValue: false
    relationName: 'DataToRelationB'
    referencedModel: RelationBModel
    relationToFields: []
    relationFromFields: []
    relationDataTypes: []
  }
  stringArrayField: {
    schema: typeof SchemaType.COLUMN
    name: 'stringArrayField'
    isId: false
    isList: true
    isUnique: false
    isReadOnly: false
    isRequired: true
    hasDefaultValue: false
    dataType: typeof DataType.STRING
  }
  booleanArrayField: {
    schema: typeof SchemaType.COLUMN
    name: 'booleanArrayField'
    isId: false
    isList: true
    isUnique: false
    isReadOnly: false
    isRequired: true
    hasDefaultValue: false
    dataType: typeof DataType.BOOLEAN
  }
  intArrayField: {
    schema: typeof SchemaType.COLUMN
    name: 'intArrayField'
    isId: false
    isList: true
    isUnique: false
    isReadOnly: false
    isRequired: true
    hasDefaultValue: false
    dataType: typeof DataType.INT
  }
  bigIntArrayField: {
    schema: typeof SchemaType.COLUMN
    name: 'bigIntArrayField'
    isId: false
    isList: true
    isUnique: false
    isReadOnly: false
    isRequired: true
    hasDefaultValue: false
    dataType: typeof DataType.BIGINT
  }
  floatArrayField: {
    schema: typeof SchemaType.COLUMN
    name: 'floatArrayField'
    isId: false
    isList: true
    isUnique: false
    isReadOnly: false
    isRequired: true
    hasDefaultValue: false
    dataType: typeof DataType.FLOAT
  }
  decimalArrayField: {
    schema: typeof SchemaType.COLUMN
    name: 'decimalArrayField'
    isId: false
    isList: true
    isUnique: false
    isReadOnly: false
    isRequired: true
    hasDefaultValue: false
    dataType: typeof DataType.DECIMAL
  }
  dateArrayField: {
    schema: typeof SchemaType.COLUMN
    name: 'dateArrayField'
    isId: false
    isList: true
    isUnique: false
    isReadOnly: false
    isRequired: true
    hasDefaultValue: false
    dataType: typeof DataType.DATETIME
  }
  jsonArrayField: {
    schema: typeof SchemaType.COLUMN
    name: 'jsonArrayField'
    isId: false
    isList: true
    isUnique: false
    isReadOnly: false
    isRequired: true
    hasDefaultValue: false
    dataType: typeof DataType.JSON
  }
  bytesArrayField: {
    schema: typeof SchemaType.COLUMN
    name: 'bytesArrayField'
    isId: false
    isList: true
    isUnique: false
    isReadOnly: false
    isRequired: true
    hasDefaultValue: false
    dataType: typeof DataType.BYTES
  }
  enumArrayField: {
    schema: typeof SchemaType.COLUMN
    name: 'enumArrayField'
    isId: false
    isList: true
    isUnique: false
    isReadOnly: false
    isRequired: true
    hasDefaultValue: false
    dataType: typeof DataType.STRING
    enumValues: ['Apple', 'Banana', 'Orange', 'Pear']
  }
  relationArrayField: {
    schema: typeof SchemaType.RELATION
    name: 'relationArrayField'
    isId: false
    isList: true
    isUnique: false
    isReadOnly: false
    isRequired: true
    hasDefaultValue: false
    relationName: 'DataToRelationC'
    referencedModel: RelationCModel
    relationToFields: []
    relationFromFields: []
    relationDataTypes: []
  }
}

export interface DataModel {
  shape: DataModelShape
  config: DataModelConfig
}

export interface RelationAModelConfig {
  name: 'RelationAModel'
  dbModelName: 'RelationA'
  prismaModelName: 'RelationA'
  primaryFields: ['id']
  uniqueFields: [['id']]
}

export interface RelationAModelShape {
  id: {
    schema: typeof SchemaType.COLUMN
    name: 'id'
    isId: true
    isList: false
    isUnique: false
    isReadOnly: false
    isRequired: true
    hasDefaultValue: false
    dataType: typeof DataType.INT
  }
  fieldA: {
    schema: typeof SchemaType.COLUMN
    name: 'fieldA'
    isId: false
    isList: false
    isUnique: false
    isReadOnly: false
    isRequired: true
    hasDefaultValue: false
    dataType: typeof DataType.STRING
  }
  data: {
    schema: typeof SchemaType.RELATION
    name: 'data'
    isId: false
    isList: true
    isUnique: false
    isReadOnly: false
    isRequired: true
    hasDefaultValue: false
    relationName: 'DataToRelationA'
    referencedModel: DataModel
    relationToFields: []
    relationFromFields: []
    relationDataTypes: []
  }
}

export interface RelationAModel {
  shape: RelationAModelShape
  config: RelationAModelConfig
}

export interface RelationBModelConfig {
  name: 'RelationBModel'
  dbModelName: 'RelationB'
  prismaModelName: 'RelationB'
  primaryFields: ['id']
  uniqueFields: [['id'], ['dataId']]
}

export interface RelationBModelShape {
  id: {
    schema: typeof SchemaType.COLUMN
    name: 'id'
    isId: true
    isList: false
    isUnique: false
    isReadOnly: false
    isRequired: true
    hasDefaultValue: false
    dataType: typeof DataType.INT
  }
  fieldB: {
    schema: typeof SchemaType.COLUMN
    name: 'fieldB'
    isId: false
    isList: false
    isUnique: false
    isReadOnly: false
    isRequired: true
    hasDefaultValue: false
    dataType: typeof DataType.STRING
  }
  dataId: {
    schema: typeof SchemaType.COLUMN
    name: 'dataId'
    isId: false
    isList: false
    isUnique: true
    isReadOnly: true
    isRequired: true
    hasDefaultValue: false
    dataType: typeof DataType.INT
  }
  data: {
    schema: typeof SchemaType.RELATION
    name: 'data'
    isId: false
    isList: false
    isUnique: false
    isReadOnly: false
    isRequired: true
    hasDefaultValue: false
    relationName: 'DataToRelationB'
    referencedModel: DataModel
    relationToFields: ['id']
    relationFromFields: ['id']
    relationDataTypes: [typeof DataType.STRING]
  }
}

export interface RelationBModel {
  shape: RelationBModelShape
  config: RelationBModelConfig
}

export interface RelationCModelConfig {
  name: 'RelationCModel'
  dbModelName: 'RelationC'
  prismaModelName: 'RelationC'
  primaryFields: ['id']
  uniqueFields: [['id']]
}

export interface RelationCModelShape {
  id: {
    schema: typeof SchemaType.COLUMN
    name: 'id'
    isId: true
    isList: false
    isUnique: false
    isReadOnly: false
    isRequired: true
    hasDefaultValue: false
    dataType: typeof DataType.INT
  }
  fieldC: {
    schema: typeof SchemaType.COLUMN
    name: 'fieldC'
    isId: false
    isList: false
    isUnique: false
    isReadOnly: false
    isRequired: true
    hasDefaultValue: false
    dataType: typeof DataType.STRING
  }
  dataId: {
    schema: typeof SchemaType.COLUMN
    name: 'dataId'
    isId: false
    isList: false
    isUnique: false
    isReadOnly: true
    isRequired: true
    hasDefaultValue: false
    dataType: typeof DataType.INT
  }
  data: {
    schema: typeof SchemaType.RELATION
    name: 'data'
    isId: false
    isList: false
    isUnique: false
    isReadOnly: false
    isRequired: true
    hasDefaultValue: false
    relationName: 'DataToRelationC'
    referencedModel: DataModel
    relationToFields: ['id']
    relationFromFields: ['id']
    relationDataTypes: [typeof DataType.STRING]
  }
}

export interface RelationCModel {
  shape: RelationCModelShape
  config: RelationCModelConfig
}
