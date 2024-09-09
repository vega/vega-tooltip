import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import typescriptParser from '@typescript-eslint/parser';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import prettierPlugin from 'eslint-plugin-prettier';
import jestPlugin from 'eslint-plugin-jest';
import prettierConfig from 'eslint-config-prettier';

const compat = new FlatCompat();

export default [
  js.configs.recommended,
  jestPlugin.configs.recommended,
  jestPlugin.configs.style,
  typescriptPlugin.configs.recommended,
  prettierConfig,
  {
    files: ['*.ts'],
    ignores: [
      '.eslintrc.js',
      'babel.config.js',
      'prettier.config.js',
      'jest.config.js',
      'rollup.config.js',
      'build',
      'build-es5',
      'dist',
      'coverage',
      'types'
    ],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: 'tsconfig.json',
        ecmaVersion: 2020,
        sourceType: 'module'
      }
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      prettier: prettierPlugin,
      jest: jestPlugin
    },
    rules: {
      'prettier/prettier': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/ban-types': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/prefer-for-of': 'error',
      '@typescript-eslint/no-for-in-array': 'error',
      '@typescript-eslint/no-require-imports': 'error',
      '@typescript-eslint/no-parameter-properties': 'off',
      '@typescript-eslint/explicit-member-accessibility': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: true
        }
      ],
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/no-object-literal-type-assertion': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-namespace': 'error',
      'jest/no-conditional-expect': 'off',
      'linebreak-style': ['error', 'unix'],
      'no-irregular-whitespace': ['error', { skipComments: true }],
      'no-alert': 'error',
      'prefer-const': 'error',
      'no-return-assign': 'error',
      'no-useless-call': 'error',
      'no-useless-concat': 'error',
      'prefer-template': 'error',
      'no-undef': 'off',
      'no-unreachable': 'off'
    }
  }
];
