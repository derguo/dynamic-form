module.exports = {
  presets: [
    '@vue/app'
  ],
  'env': {
    'development': {
      "plugins": ["@babel/plugin-transform-modules-commonjs"]
    }
  }
}
