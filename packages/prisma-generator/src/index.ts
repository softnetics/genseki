#!/usr/bin/env node
import fs from 'node:fs'

import { generatorHandler } from '@prisma/generator-helper'
import path from 'path'

import { defaultPath, generatorName } from './globals'

import { version } from '../package.json'

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
    const output = `const test = ${JSON.stringify(dmmf.datamodel.models, null, 2)}`

    // Import the main generator function

    // Call the generate function with the necessary parameters
    const folderOutput = path.resolve(
      generator.output?.value ??
        (options.generator.output?.fromEnvVar
          ? (process.env[options.generator.output.fromEnvVar!] ?? defaultPath)
          : defaultPath)
    )

    const schemaFile = folderOutput.endsWith('.ts')
      ? folderOutput
      : path.join(folderOutput, 'genseki.ts')

    fs.mkdirSync(path.dirname(schemaFile), {
      recursive: true,
    })

    fs.writeFileSync(schemaFile, output)
  },
})

export default handler
