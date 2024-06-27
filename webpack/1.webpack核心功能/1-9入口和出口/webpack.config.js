const path = require('path')
module.exports = {
  mode: 'development',
  // devtool: "source-map",
  entry: {
    /**
     * 入口
     * 属性名：chunk的名称，属性值：入口模块
     */
    main: './src/index.js', // 默认配置
    a: './src/a.js',
    b: ['./src/a.js', './src/index.js'], // 启动模块有两个，将这两个模块打包到一个js文件里
  },
  /**
   * 出口
   */
  output: {
    path: path.resolve(__dirname, 'target'), // 必须配置一个绝对路径，表示资源放置的文件夹，默认是 dist
    /**
     * filename：配置的合并的js文件的规则
     * 规则：
     *    name：      chunkname
     *    hash：      总的资源hash，通常用于解决缓存问题
     *    chunkhash: 使用每个chunk自己的hash
     *    id：       使用chunkid，不推荐，因为开发环境下是chunkname，生产环境下会变成数字
     */
    // filename: 'sub/bundle.js'
    // filename: '[name]_[hash:5].js'
    filename: '[name]_[chunkhash].js'
  }
}