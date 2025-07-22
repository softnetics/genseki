import type { DMMF } from '@prisma/generator-helper'
import ts, { factory } from 'typescript'

import { getAllPrimaryFields, toCamelCase } from './utils'

function generateFieldBaseSchemaProperties(field: DMMF.Field) {
  function createBooleanProperties(fieldKeys: (keyof typeof field)[]) {
    return fieldKeys.flatMap((key) => {
      const value = field[key]
      if (value === undefined) return []
      return [
        factory.createPropertySignature(
          undefined,
          key,
          undefined,
          factory.createTypeReferenceNode(`${value}`)
        ),
      ]
    })
  }

  const isRelation = !!field.relationName
  const schemaTypeName = isRelation ? 'typeof SchemaType.RELATION' : 'typeof SchemaType.COLUMN'

  return [
    factory.createPropertySignature(
      undefined,
      'schema',
      undefined,
      factory.createTypeReferenceNode(schemaTypeName)
    ),
    factory.createPropertySignature(
      undefined,
      'name',
      undefined,
      factory.createTypeReferenceNode(`"${field.name}"`)
    ),
    ...createBooleanProperties([
      'isId',
      'isList',
      'isUnique',
      'isReadOnly',
      'isRequired',
      'hasDefaultValue',
    ]),
  ]
}

function generateFieldColumnSchemaInterface(
  field: DMMF.Field,
  enums: readonly DMMF.DatamodelEnum[]
) {
  let properties: ts.PropertySignature[]
  if (field.kind !== 'enum') {
    properties = [
      factory.createPropertySignature(
        undefined,
        'dataType',
        undefined,
        factory.createTypeReferenceNode(`typeof DataType.${field.type.toUpperCase()}`)
      ),
    ]
  } else {
    const enumValues =
      enums
        .find((e) => e.name === field.type)
        ?.values.map((v) => factory.createStringLiteral(v.name)) ?? []

    properties = [
      factory.createPropertySignature(
        undefined,
        'dataType',
        undefined,
        factory.createTypeReferenceNode(`typeof DataType.STRING`)
      ),
      factory.createPropertySignature(
        undefined,
        'enumValues',
        undefined,
        factory.createTupleTypeNode(enumValues.map((value) => factory.createLiteralTypeNode(value)))
      ),
    ]
  }

  return factory.createPropertySignature(
    undefined,
    field.name,
    undefined,
    factory.createTypeLiteralNode([...generateFieldBaseSchemaProperties(field), ...properties])
  )
}

function generateFieldRelationSchemaInterface(
  field: DMMF.Field,
  model: DMMF.Model,
  datamodel: DMMF.Datamodel
) {
  const referencedModel = datamodel.models.find((relation) => relation.name === field.type)
  if (!referencedModel) {
    throw new Error(`Referenced model ${field.type} not found in datamodel`)
  }
  const referencedModelPrimaryFields = getAllPrimaryFields(referencedModel)

  const relationDataTypes = referencedModelPrimaryFields.flatMap((f) => {
    const found = model.fields.find((field) => field.name === f.name)
    if (!found) return []
    return factory.createTypeReferenceNode(`typeof DataType.${found.type.toUpperCase()}`)
  })

  return factory.createPropertySignature(
    undefined,
    field.name,
    undefined,
    factory.createTypeLiteralNode([
      ...generateFieldBaseSchemaProperties(field),
      factory.createPropertySignature(
        undefined,
        'relationName',
        undefined,
        factory.createTypeReferenceNode(`"${field.relationName!}"`)
      ),
      factory.createPropertySignature(
        undefined,
        'referencedModel',
        undefined,
        factory.createTypeReferenceNode(`${field.type}Model`)
      ),
      factory.createPropertySignature(
        undefined,
        'relationToFields',
        undefined,
        factory.createTupleTypeNode(
          field.relationToFields?.map((f) =>
            factory.createLiteralTypeNode(factory.createStringLiteral(f))
          ) ?? []
        )
      ),
      factory.createPropertySignature(
        undefined,
        'relationFromFields',
        undefined,
        factory.createTupleTypeNode(
          field.relationToFields?.map((f) =>
            factory.createLiteralTypeNode(factory.createStringLiteral(f))
          ) ?? []
        )
      ),
      factory.createPropertySignature(
        undefined,
        'relationDataTypes',
        undefined,
        factory.createTupleTypeNode(relationDataTypes)
      ),
    ])
  )
}

function generateModelInterface(model: DMMF.Model, datamodel: DMMF.Datamodel) {
  const baseName = `${model.name}Model`

  const primaryFields = getAllPrimaryFields(model)
  const primaryFieldNames = primaryFields.map((field) => field.name)

  const singleUniqueFieldNames = model.fields
    .filter((field) => field.isUnique)
    .map((field) => [field.name])

  const allUniqueFields = [primaryFieldNames, ...singleUniqueFieldNames, ...model.uniqueFields]

  const modelShapeInterface = factory.createInterfaceDeclaration(
    [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    `${baseName}Shape`,
    undefined,
    undefined,
    [
      factory.createPropertySignature(
        undefined,
        'columns',
        undefined,
        factory.createTypeLiteralNode(
          model.fields
            .filter((f) => !f.relationName)
            .map((field) => generateFieldColumnSchemaInterface(field, datamodel.enums))
        )
      ),
      factory.createPropertySignature(
        undefined,
        'relations',
        undefined,
        factory.createTypeLiteralNode(
          model.fields
            .filter((f) => f.relationName)
            .map((field) => generateFieldRelationSchemaInterface(field, model, datamodel))
        )
      ),
      factory.createPropertySignature(
        undefined,
        'primaryFields',
        undefined,
        factory.createTupleTypeNode(
          primaryFieldNames.map((field) =>
            factory.createLiteralTypeNode(factory.createStringLiteral(field))
          )
        )
      ),
      factory.createPropertySignature(
        undefined,
        'uniqueFields',
        undefined,
        factory.createTupleTypeNode(
          allUniqueFields.map((field) =>
            factory.createTupleTypeNode(
              field.map((f) => factory.createLiteralTypeNode(factory.createStringLiteral(f)))
            )
          )
        )
      ),
    ]
  )

  const modelConfigInterface = factory.createInterfaceDeclaration(
    [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    `${baseName}Config`,
    undefined,
    undefined,
    [
      factory.createPropertySignature(
        undefined,
        'name',
        undefined,
        factory.createTypeReferenceNode(`"${baseName}"`)
      ),
      factory.createPropertySignature(
        undefined,
        'dbModelName',
        undefined,
        factory.createTypeReferenceNode(`"${model.dbName ?? model.name}"`)
      ),
      factory.createPropertySignature(
        undefined,
        'prismaModelName',
        undefined,
        factory.createTypeReferenceNode(`"${toCamelCase(model.name)}"`)
      ),
    ]
  )

  const modelSchema = factory.createInterfaceDeclaration(
    [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    baseName,
    undefined,
    undefined,
    [
      factory.createPropertySignature(
        undefined,
        'shape',
        undefined,
        factory.createTypeReferenceNode(`${baseName}Shape`)
      ),
      factory.createPropertySignature(
        undefined,
        'config',
        undefined,
        factory.createTypeReferenceNode(`${baseName}Config`)
      ),
    ]
  )

  return [modelConfigInterface, modelShapeInterface, modelSchema] as const
}

export function generateUnsanitizedCode(datamodel: DMMF.Document['datamodel']) {
  // Import statements
  const imports = [
    factory.createImportDeclaration(
      undefined,
      factory.createImportClause(
        false,
        undefined,
        factory.createNamedImports([
          factory.createImportSpecifier(
            false,
            undefined,
            factory.createIdentifier('type DataType')
          ),
          factory.createImportSpecifier(
            false,
            undefined,
            factory.createIdentifier('type SchemaType')
          ),
          factory.createImportSpecifier(
            false,
            undefined,
            factory.createIdentifier('unsanitizedModelSchemas')
          ),
        ])
      ),
      factory.createStringLiteral('@genseki/react')
    ),
    factory.createImportDeclaration(
      undefined,
      factory.createImportClause(
        false,
        undefined,
        factory.createNamedImports([
          factory.createImportSpecifier(
            false,
            undefined,
            factory.createIdentifier('SanitizedFullModelSchemas')
          ),
        ])
      ),
      factory.createStringLiteral('./sanitized')
    ),
  ]

  const modelInterfaces = datamodel.models.flatMap((model) => {
    return generateModelInterface(model, datamodel)
  })

  const modelSchemasType = factory.createTypeAliasDeclaration(
    [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    `FullModelSchemas`,
    undefined,
    factory.createIntersectionTypeNode([
      factory.createTypeLiteralNode(
        datamodel.models.map((model) => {
          return factory.createPropertySignature(
            undefined,
            toCamelCase(model.name),
            undefined,
            factory.createTypeReferenceNode(`${model.name}Model`)
          )
        })
      ),
      factory.createTypeLiteralNode([]),
    ])
  )

  const modelSchemasVariable = factory.createVariableStatement(
    [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier('FullModelSchemas'),
          undefined,
          undefined,
          factory.createCallExpression(
            factory.createIdentifier('unsanitizedModelSchemas'),
            [factory.createTypeReferenceNode('FullModelSchemas', undefined)],
            [factory.createIdentifier('SanitizedFullModelSchemas')]
          )
        ),
      ],
      ts.NodeFlags.Const
    )
  )

  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed })
  const sourceFile = ts.createSourceFile(
    'dummy.ts',
    '',
    ts.ScriptTarget.Latest,
    false,
    ts.ScriptKind.TS
  )

  const declarartions = [...imports, ...modelInterfaces, modelSchemasType, modelSchemasVariable]

  return declarartions
    .map((node) => printer.printNode(ts.EmitHint.Unspecified, node, sourceFile))
    .join('\n\n')
}
