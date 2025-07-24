import type { DMMF } from '@prisma/generator-helper'
import ts, { factory } from 'typescript'

import { toCamelCase } from './utils'

function generateFieldBaseSchemaDefinition(field: DMMF.Field) {
  function createBooleanProperties(fieldKeys: (keyof typeof field)[]) {
    return fieldKeys.map((key) => {
      return factory.createPropertyAssignment(
        key,
        field[key] ? factory.createTrue() : factory.createFalse()
      )
    })
  }

  const isRelation = !!field.relationName

  return [
    factory.createPropertyAssignment(
      'schema',
      factory.createPropertyAccessExpression(
        factory.createIdentifier('SchemaType'),
        factory.createIdentifier(isRelation ? 'RELATION' : 'COLUMN')
      )
    ),
    factory.createPropertyAssignment('name', factory.createStringLiteral(field.name)),
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

function generateFieldColumnSchemaDefinition(
  field: DMMF.Field,
  enums: readonly DMMF.DatamodelEnum[]
) {
  let properties: ts.PropertyAssignment[]
  if (field.kind !== 'enum') {
    properties = [
      factory.createPropertyAssignment(
        'dataType',
        factory.createPropertyAccessExpression(
          factory.createIdentifier('DataType'),
          factory.createIdentifier(field.type.toUpperCase())
        )
      ),
    ]
  } else {
    const enumValues =
      enums
        .find((e) => e.name === field.type)
        ?.values.map((v) => factory.createStringLiteral(v.name)) ?? []
    properties = [
      factory.createPropertyAssignment(
        'dataType',
        factory.createPropertyAccessExpression(
          factory.createIdentifier('DataType'),
          factory.createIdentifier('STRING')
        )
      ),
      factory.createPropertyAssignment(
        'enumValues',
        factory.createArrayLiteralExpression(enumValues, true)
      ),
    ]
  }

  return factory.createPropertyAssignment(
    field.name,
    factory.createObjectLiteralExpression(
      [...generateFieldBaseSchemaDefinition(field), ...properties],
      true
    )
  )
}

function generateFieldRelationSchemaDefinition(field: DMMF.Field, fields: readonly DMMF.Field[]) {
  return factory.createPropertyAssignment(
    field.name,
    factory.createObjectLiteralExpression(
      [
        ...generateFieldBaseSchemaDefinition(field),
        ...(field.relationName
          ? [
              factory.createPropertyAssignment(
                'relationName',
                factory.createStringLiteral(field.relationName)
              ),
            ]
          : []),
        factory.createPropertyAssignment(
          'referencedModel',
          factory.createStringLiteral(field.type)
        ),
        factory.createPropertyAssignment(
          'relationToFields',
          factory.createArrayLiteralExpression(
            field.relationToFields?.map((f) => factory.createStringLiteral(f)) ?? []
          )
        ),
        factory.createPropertyAssignment(
          'relationFromFields',
          factory.createArrayLiteralExpression(
            field.relationFromFields?.map((f) => factory.createStringLiteral(f)) ?? []
          )
        ),
        factory.createPropertyAssignment(
          'relationDataTypes',
          factory.createArrayLiteralExpression(
            field.relationFromFields?.flatMap((f) => {
              const found = fields.find((field) => field.name === f)
              if (!found) return []
              return factory.createPropertyAccessExpression(
                factory.createIdentifier('DataType'),
                factory.createIdentifier(found.type.toUpperCase())
              )
            }) ?? []
          )
        ),
      ],
      true
    )
  )
}

function generateModelShapeDefinition(model: DMMF.Model, enums: readonly DMMF.DatamodelEnum[]) {
  const primaryFieldNames = model.fields.filter((field) => field.isId).map((field) => field.name)
  const allPriamryFieldNames = [
    ...primaryFieldNames,
    ...(model.primaryKey?.fields.map((f) => f) ?? []),
  ]

  const singleUniqueFieldNames = model.fields
    .filter((field) => field.isUnique)
    .map((field) => [field.name])
  const allUniqueFields = [allPriamryFieldNames, ...singleUniqueFieldNames, ...model.uniqueFields]

  const columns = model.fields
    .filter((field) => !field.relationName)
    .map((field) => generateFieldColumnSchemaDefinition(field, enums))

  const relations = model.fields
    .filter((field) => field.relationName)
    .map((field) => generateFieldRelationSchemaDefinition(field, model.fields))

  return factory.createObjectLiteralExpression(
    [
      factory.createPropertyAssignment(
        'columns',
        factory.createObjectLiteralExpression(columns, true)
      ),
      factory.createPropertyAssignment(
        'relations',
        factory.createObjectLiteralExpression(relations, true)
      ),
      factory.createPropertyAssignment(
        'primaryFields',
        factory.createArrayLiteralExpression(
          allPriamryFieldNames.map((field) => factory.createStringLiteral(field))
        )
      ),
      factory.createPropertyAssignment(
        'uniqueFields',
        factory.createArrayLiteralExpression(
          allUniqueFields.map((field) =>
            factory.createArrayLiteralExpression(field.map((f) => factory.createStringLiteral(f)))
          )
        )
      ),
    ],
    true
  )
}

function generateModelSchemaDefinition(model: DMMF.Model, enums: readonly DMMF.DatamodelEnum[]) {
  const shapeArgs = generateModelShapeDefinition(model, enums)

  const configArgs = factory.createObjectLiteralExpression(
    [
      factory.createPropertyAssignment('name', factory.createStringLiteral(`${model.name}Model`)),
      factory.createPropertyAssignment(
        'dbModelName',
        factory.createStringLiteral(model.dbName ?? model.name)
      ),
      factory.createPropertyAssignment(
        'prismaModelName',
        factory.createStringLiteral(toCamelCase(model.name))
      ),
    ],
    true
  )

  const modelSchema = factory.createVariableStatement(
    [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          `${model.name}Model`,
          undefined,
          undefined,
          factory.createCallExpression(factory.createIdentifier('model'), undefined, [
            shapeArgs,
            configArgs,
          ])
        ),
      ],
      ts.NodeFlags.Const
    )
  )

  const modelType = factory.createTypeAliasDeclaration(
    [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    `${model.name}Model`,
    undefined,
    factory.createTypeReferenceNode('Simplify', [
      factory.createTypeQueryNode(factory.createIdentifier(`${model.name}Model`)),
    ])
  )

  return [modelSchema, modelType] as const
}

function generateModelFunction() {
  const factory = ts.factory

  const jsDoc = factory.createJSDocComment(
    'Creates a sanitized model with the given shape and config.',
    [
      factory.createJSDocParameterTag(
        undefined,
        factory.createIdentifier('shape'),
        false,
        factory.createJSDocTypeExpression(factory.createTypeReferenceNode('TShape')),
        undefined,
        'The shape of the model'
      ),
      factory.createJSDocParameterTag(
        undefined,
        factory.createIdentifier('config'),
        false,
        factory.createJSDocTypeExpression(factory.createTypeReferenceNode('TConfig')),
        undefined,
        'The configuration of the model'
      ),
      factory.createJSDocReturnTag(
        undefined,
        factory.createJSDocTypeExpression(
          factory.createTypeReferenceNode('SanitizedModel', [
            factory.createTypeReferenceNode('TShape'),
          ])
        ),
        'A sanitized model containing the shape and config'
      ),
    ]
  )

  const func = factory.createFunctionDeclaration(
    undefined,
    undefined,
    'model',
    [
      factory.createTypeParameterDeclaration(
        [factory.createModifier(ts.SyntaxKind.ConstKeyword)],
        'TShape',
        factory.createTypeReferenceNode('SanitizedModelShape')
      ),
      factory.createTypeParameterDeclaration(
        [factory.createModifier(ts.SyntaxKind.ConstKeyword)],
        'TConfig',
        factory.createTypeReferenceNode('ModelConfig')
      ),
    ],
    [
      factory.createParameterDeclaration(
        undefined,
        undefined,
        'shape',
        undefined,
        factory.createTypeReferenceNode('TShape')
      ),
      factory.createParameterDeclaration(
        undefined,
        undefined,
        'config',
        undefined,
        factory.createTypeReferenceNode('TConfig')
      ),
    ],
    factory.createTypeReferenceNode('SanitizedModelSchema', [
      factory.createTypeReferenceNode('TShape'),
      factory.createTypeReferenceNode('TConfig'),
    ]),
    factory.createBlock(
      [
        factory.createReturnStatement(
          factory.createObjectLiteralExpression([
            factory.createShorthandPropertyAssignment('config'),
            factory.createShorthandPropertyAssignment('shape'),
          ])
        ),
      ],
      true
    )
  )

  // Attach the JSDoc
  ts.addSyntheticLeadingComment(
    func,
    ts.SyntaxKind.MultiLineCommentTrivia,
    ts
      .createPrinter()
      .printNode(
        ts.EmitHint.Unspecified,
        jsDoc,
        ts.createSourceFile('', '', ts.ScriptTarget.Latest)
      )
      .replace(/\/\*/g, '')
      .replace(/\*\//g, ''),
    true
  )

  return func
}

export function generateSanitizedCode(datamodel: DMMF.Document['datamodel']) {
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
            factory.createIdentifier('type Simplify')
          ),
          factory.createImportSpecifier(
            false,
            undefined,
            factory.createIdentifier('type SanitizedModelShape')
          ),
          factory.createImportSpecifier(
            false,
            undefined,
            factory.createIdentifier('type ModelConfig')
          ),
          factory.createImportSpecifier(
            false,
            undefined,
            factory.createIdentifier('type SanitizedModelSchema')
          ),
          factory.createImportSpecifier(false, undefined, factory.createIdentifier('DataType')),
          factory.createImportSpecifier(false, undefined, factory.createIdentifier('SchemaType')),
        ])
      ),
      factory.createStringLiteral('@genseki/react')
    ),
  ]

  const modelFunction = generateModelFunction()
  const sanitizedModels = datamodel.models.flatMap((model) => {
    return generateModelSchemaDefinition(model, datamodel.enums)
  })

  const modelSchemasVariable = factory.createVariableStatement(
    [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          `SanitizedFullModelSchemas`,
          undefined,
          undefined,
          factory.createObjectLiteralExpression(
            datamodel.models.map((model) =>
              factory.createPropertyAssignment(
                factory.createStringLiteral(`${toCamelCase(model.name)}`),
                factory.createIdentifier(`${model.name}Model`)
              )
            ),
            true
          )
        ),
      ],
      ts.NodeFlags.Const
    )
  )

  const modelSchemasType = factory.createTypeAliasDeclaration(
    [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    `SanitizedFullModelSchemas`,
    undefined,
    factory.createTypeReferenceNode('Simplify', [
      factory.createTypeQueryNode(factory.createIdentifier(`SanitizedFullModelSchemas`)),
    ])
  )

  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed })
  const sourceFile = ts.createSourceFile(
    'dummy.ts',
    '',
    ts.ScriptTarget.Latest,
    false,
    ts.ScriptKind.TS
  )

  const declarartions = [
    ...imports,
    modelFunction,
    ...sanitizedModels,
    modelSchemasVariable,
    modelSchemasType,
  ]

  return declarartions
    .map((node) => printer.printNode(ts.EmitHint.Unspecified, node, sourceFile))
    .join('\n\n')
}
