module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'prettier',
    'prettier/vue',
    'plugin:prettier/recommended',
    'plugin:wdio/recommended',
    'plugin:nuxt/recommended',
  ],
  plugins: ['prettier', 'wdio'],
  // add your custom rules here
  rules: {
    'no-console': 0,
    'spaced-comment': 0,
    'prettier/prettier': [
      'error',
      { usePrettierrc: true, endOfLine: 'auto', semi: true },
    ],
  },
};
