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
      execSync('npx prisma generate --schema=./tests/type-compatibility', { stdio: 'inherit' })
      execSync('npx prisma generate --schema=./tests/complex-relationship', { stdio: 'inherit' })
      execSync('pnpm lint:fix')
      execSync('pnpm format')
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
