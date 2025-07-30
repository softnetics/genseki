// plugins
import reactPlugin from 'eslint-plugin-react'
import hooksPlugin from 'eslint-plugin-react-hooks'
import tseslint from 'typescript-eslint'

import base from './base.mjs'

/**
 * @type {import('typescript-eslint').ConfigArray}
 */
const config = tseslint.config(
  ...base,
  hooksPlugin.configs['recommended-latest'],
  reactPlugin.configs.flat['recommended'],
  {
    rules: {
      'react/react-in-jsx-scope': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  }
)

export default config
