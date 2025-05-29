import prettierPlugin from 'eslint-plugin-prettier'
import vuePlugin from 'eslint-plugin-vue'
import tsParser from '@typescript-eslint/parser'
import vueParser from 'vue-eslint-parser'
import js from '@eslint/js'
import ts from 'typescript-eslint'
import globals from 'globals'

export default ts.config([
  {
    ignores: ['.vitepress/cache/**', '.vitepress/dist/**'],
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  ...vuePlugin.configs['flat/recommended'],
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
  // Correct parser for .vue files
  {
    files: ['*.vue', '**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: {
          // Script parser for `<script>`
          js: 'espree',

          // Script parser for `<script lang="ts">`
          ts: tsParser,

          // Script parser for vue directives (e.g. `v-if=` or `:attribute=`)
          // and vue interpolations (e.g. `{{variable}}`).
          // If not specified, the parser determined by `<script lang ="...">` is used.
          '<template>': 'espree',
        },
      },
    },
    rules: {
      'vue/max-attributes-per-line': 'off',
    },
  },
  // JS/TS files
  {
    files: ['**/*.{js,ts}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          semi: false,
          trailingComma: 'all',
        },
        {
          usePrettierrc: false,
        },
      ],
    },
  },
  // TypeScript declaration files
  {
    files: ['**/*.d.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {},
  },
])
