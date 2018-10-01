module.exports = {
  env: {
    jest: true,
    node: true,
  },
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  rules: {
    'no-console': 'error',
    'no-underscore-dangle': 'off',
    'import/prefer-default-export': 'warn',
  },
};
