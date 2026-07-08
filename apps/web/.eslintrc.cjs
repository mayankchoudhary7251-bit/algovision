module.exports = {
  root: true,

  env: {
    browser: true,
    es2020:  true,
  },

  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],

  ignorePatterns: [
    'dist',
    '.eslintrc.cjs',
  ],

  parser: '@typescript-eslint/parser',

  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },

  plugins: [
    '@typescript-eslint',
    'react-refresh',
  ],

  settings: {
    react: {
      version: 'detect',
    },
  },

  rules: {
    // React
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    'react/prop-types': 'off',

    // TypeScript
    '@typescript-eslint/no-unused-vars': ['error', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    }],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/consistent-type-imports': ['error', {
      prefer: 'type-imports',
    }],

    // General
    'no-console':   ['warn', { allow: ['warn', 'error'] }],
    'prefer-const': 'error',
    'no-var':       'error',
    'eqeqeq':       ['error', 'always'],
  },
}
