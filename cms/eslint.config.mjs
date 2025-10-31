import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import prettier from 'eslint-config-prettier/flat'
import perfectionist from 'eslint-plugin-perfectionist'
import { defineConfig, globalIgnores } from 'eslint/config'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,

  // Perfectionist rules:
  {
    plugins: {
      perfectionist,
    },
    // Default/general rules: (used for everything except special files listed below)
    rules: {
      'perfectionist/sort-imports': 'error',
      'perfectionist/sort-objects': [
        'error',
        {
          order: 'asc',
          partitionByNewLine: true,
          type: 'natural',
        },
      ],
    },
  },

  // Special sorting rules for Payload Collection, Global, Block and Field configs:
  {
    files: [
      'src/collections/**/*.ts',
      'src/globals/**/*.ts',
      'src/blocks/**/*.ts',
      'src/fields/**/*.ts',
    ],
    rules: {
      'perfectionist/sort-imports': 'error',
      'perfectionist/sort-objects': [
        'error',
        {
          customGroups: {
            // For the config itself: slug, dbName at the top, fields at the bottom
            // For the fields: name and type at the top, everything else at the bottom
            bottom: ['fields'],
            top: ['slug', 'typescript', 'name', 'type'],
          },
          groups: ['top', 'unknown', 'bottom'],
          order: 'asc',
          partitionByNewLine: true,
          type: 'natural',
        },
      ],
    },
  },

  // Special sorting rules for the Payload config file:
  {
    files: ['**/src/payload.config.ts'],
    rules: {
      'perfectionist/sort-imports': 'error',
      'perfectionist/sort-objects': [
        'error',
        {
          customGroups: {
            // plugins at the bottom
            bottom: ['plugins'],
            top: [],
          },
          groups: ['top', 'unknown', 'bottom'],
          order: 'asc',
          partitionByNewLine: true,
          type: 'natural',
        },
      ],
    },
  },

  globalIgnores(['**/importMap.js']),
])

export default eslintConfig
