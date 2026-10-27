import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'dist-email', 'email-preview']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      'react-refresh/only-export-components': ['error', { allowConstantExport: true, allowExportNames: ['useCart', 'useNotifications'] }],
    },
  },
  {
    files: ['src/email/**/*.{ts,tsx}', 'src/component/email/**/*.{ts,tsx}'],
    languageOptions: { globals: globals.node },
    rules: {
      // Email bodies intentionally export subject builders and PreviewProps with their components.
      'react-refresh/only-export-components': 'off',
    },
  },
])
