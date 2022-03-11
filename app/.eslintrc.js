module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:vue/essential'],
  rules: {
    'no-console': 'off',
    'import/no-cycle': 'off',
    quotes: [2, 'single', {
      avoidEscape: true
    }],
    'vue/multi-word-component-names': 0,
    'max-len': [
      'warn',
      100,
      2,
      {
        ignoreUrls: true,
        ignoreComments: true,
        ignoreRegExpLiterals: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      },
    ],
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@', './src', '']
        ],
        extensions: ['.vue', '.json', '.js'],
      },
    },
  },

  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 12,
    sourceType: 'module',
  },
};