module.exports = {
  mode: 'development',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.png$/,
        use: {
          loader: './loaders/img_loader.js'
        }
      }
    ]
  }
}