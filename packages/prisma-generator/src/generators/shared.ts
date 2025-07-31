import type { DMMF } from '@prisma/generator-helper'
import ts, { factory } from 'typescript'

function generateEnumConst(_enum: DMMF.DatamodelEnum) {
  const asConst = factory.createAsExpression(
    factory.createObjectLiteralExpression(
      _enum.values.map((value) => {
        return factory.createPropertyAssignment(
          factory.createIdentifier(value.name),
          factory.createStringLiteral(value.name)
        )
      }),
      true
    ),
    factory.createTypeReferenceNode(factory.createIdentifier('const'), undefined)
  )

  const variables = factory.createVariableStatement(
    [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier(_enum.name),
          undefined,
          undefined,
          asConst
        ),
      ],
      ts.NodeFlags.Const
    )
  )

  const types = factory.createTypeAliasDeclaration(
    [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    factory.createIdentifier(_enum.name),
    undefined,
    factory.createIndexedAccessTypeNode(
      factory.createTypeQueryNode(factory.createIdentifier(_enum.name)),
      factory.createTypeOperatorNode(
        ts.SyntaxKind.KeyOfKeyword,
        factory.createTypeQueryNode(factory.createIdentifier(_enum.name))
      )
    )
  )

  return [variables, types]
}

export function generateEnums(datamodel: DMMF.Document['datamodel']) {
  const enums = datamodel.enums.flatMap((_enum) => {
    return generateEnumConst(_enum)
  })

  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed })
  const sourceFile = ts.createSourceFile(
    'dummy.ts',
    '',
    ts.ScriptTarget.Latest,
    false,
    ts.ScriptKind.TS
  )

  const declarartions = [...enums]

  return declarartions
    .map((node) => printer.printNode(ts.EmitHint.Unspecified, node, sourceFile))
    .join('\n\n')
}
