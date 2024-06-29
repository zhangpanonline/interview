module.exports = {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: {
          loader: './loaders/style_loader.js'
        }
      }
    ]
  }
}