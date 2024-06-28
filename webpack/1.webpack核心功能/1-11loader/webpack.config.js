module.exports = {
  mode: 'development',
  module: {
    rules: [
      {
        test: /index\.js$/,
        use: [
          {
            loader: './loaders/loader1'
          },
          {
            loader: './loaders/loader2'
          }
        ]
      },
      {
        test: /.js$/,
        use: ['./loaders/loader3', './loaders/loader4']
      }
    ]
  }
}