#!/usr/bin/env node
import fs from 'node:fs'

import { generatorHandler } from '@prisma/generator-helper'
import path from 'path'

import { generateSanitizedCode } from './generators/sanitized'
import { generateEnums } from './generators/shared'
import { generateUnsanitizedCode } from './generators/unsanitized'
import { defaultPath, generatorName } from './globals'

import { version } from '../package.json'

function writeFile(folderOutput: string, fileName: string, content: string) {
  const schemaFile = path.join(folderOutput, fileName)
  fs.mkdirSync(path.dirname(schemaFile), { recursive: true })
  fs.writeFileSync(schemaFile, content)
}

export const handler = generatorHandler({
  onManifest: () => {
    return {
      version,
      defaultOutput: defaultPath,
      prettyName: generatorName,
    }
  },
  onGenerate: async (options) => {
    const { dmmf, generator } = options

    // Call the generate function with the necessary parameters
    const folderOutput = path.resolve(
      generator.output?.value ??
        (options.generator.output?.fromEnvVar
          ? (process.env[options.generator.output.fromEnvVar!] ?? defaultPath)
          : defaultPath)
    )

    const sharedCode = generateEnums(dmmf.datamodel)
    writeFile(folderOutput, 'shared.ts', sharedCode)

    const sanitizedCode = generateSanitizedCode(dmmf.datamodel)
    writeFile(folderOutput, 'sanitized.ts', sanitizedCode)

    const unsanitizedCode = generateUnsanitizedCode(dmmf.datamodel)
    writeFile(folderOutput, 'unsanitized.ts', unsanitizedCode)
  },
})

export default handler

export * from './types'
