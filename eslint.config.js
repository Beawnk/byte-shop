import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'
import prettier from 'eslint-config-prettier'

export default [
  { ignores: ['dist/**', 'coverage/**'] },

  js.configs.recommended,
  // "essential" = rules that catch bugs; formatting is Prettier's job (eslint-config-prettier below).
  ...pluginVue.configs['flat/essential'],

  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser },
    },
    rules: {
      // Single-word names (Header, Login, User...) are part of the existing structure.
      'vue/multi-word-component-names': 'off',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', caughtErrors: 'none' }],
    },
  },

  {
    files: ['*.config.js', '**/*.test.js'],
    languageOptions: { globals: { ...globals.node } },
  },

  prettier,
]
