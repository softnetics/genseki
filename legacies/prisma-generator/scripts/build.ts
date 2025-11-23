import fs from 'node:fs'

import { build as tsupBuild } from 'tsup'

const build = async () => {
  await tsupBuild({
    entry: ['src/index.ts'],
    splitting: false,
    sourcemap: true,
    dts: true,
    clean: true,
    format: ['cjs'],
    outExtension() {
      return {
        dts: '.d.ts',
        js: '.js',
      }
    },
  })

  fs.copyFileSync('package.json', 'dist/package.json')
}

build()
