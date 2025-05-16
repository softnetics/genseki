// plugins
import tseslint from 'typescript-eslint'

import base from './base.mjs'

/**
 * @type {import('typescript-eslint').ConfigArray}
 */
const config = tseslint.config(...base)

export default config
