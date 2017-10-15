module.exports = {
    extends: [
        './node_modules/gnoll/config/eslint.js'
    ],
    rules: {
      'react/jsx-filename-extension': 'off'
    },
    settings: {
      'import/resolver': 'webpack'
    }
}
