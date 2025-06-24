import { execSync } from 'node:child_process'

import { build as tsupBuild } from 'tsup'

const dev = async () => {
  await tsupBuild({
    entry: ['src/index.ts'],
    watch: ['src/**/*.ts'],
    splitting: false,
    sourcemap: true,
    clean: true,
    onSuccess: async () => {
      execSync('cd ../../examples/demo-prisma-generator && npx prisma generate dev', {
        stdio: 'inherit',
      })
    },
    dts: true,
    format: ['cjs'],
    outExtension() {
      return {
        dts: '.d.ts',
        js: '.js',
      }
    },
  })
}

dev()
