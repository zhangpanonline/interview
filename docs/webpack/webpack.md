## webpack知识

### 1. 什么是webpack

静态模块打包工具

### 2. webpack作用

分析、压缩、打包代码

### 3. webpack好处

* 减少文件体积、减少文件数量
* 提高网页加载速度

### 4. webpack工作流程

#### 1. 初始化参数

从配置文件读取并合并默认参数

#### 2. 开始编译

用得到的参数初始化Compiler对象，加载所有配置的插件，开始执行编译

#### 3. 确定入口

根据配置中的entry找出所有的入口文件

#### 4. 编译模块

从入口文件出发，调用所有配置的Loader对模块进行翻译，再找出该模块依赖的模块，递归处理直到所有入口依赖的文件都经过了翻译

#### 5. 完成模块编译

在经过Loader翻译完所有模块后，得到了每个模块被翻译后的最终内容以及他们之间的依赖关系

#### 6. 输出资源

根据入口和模块之间的依赖关系，组装成一个个包含多个模块的Chunk，再把每个Chunk转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会

#### 7. 输出完成

在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统。

1. 什么是loader、什么是plugin
   * loader **直译为**“加载器”。webpack将一切文件视为模块，但是webpack原生是只能解析js文件，如果想将其他文件也打包的话，就会用到loader。所以loader的作用是让webpack拥有了加载和解析非javascript文件的能力
   * Plugin直译为“插件”。Plugin可以扩展webpack的功能，让webpack具有更多的灵活性。在webpack运行的生命周期中会广播出许多事件，Plugin可以监听这些事件，在合适的时机通过webpack提供的API改变输出结果
   * 广义来说，loader属于插件的一种
      * 插件范围很广：只要不是webpack原生的功能，都可以理解为插件
      * loader：一种特殊的插件，主要是用在webpack编译环节，帮我们编译各种文件的

2. 有哪些常见的Loader，用过哪些
   1. raw-loader：加载文件原始内容
   2. file-loader：把文件输出到一个文件夹中，在代码中通过相对URL去引用输出的文件（处理图片和字体）
   3. url-loader：与file-loader类似，区别是用户可以设置一个阈值，大于阈值会交给file-loader处理，小于阈值时返回文件base64形式编码（处理图片和字体）
   4. source-map-loader：加载额外的Source Map文件，以方便断点调试
   5. svg-inline-loader：将压缩后的SVG内容注入代码中
   6. image-loader：加载并且压缩图片文件
   7. json-loader：加载JSON文件（默认包含）
   8. babel-loader：把ES6转换成ES5
   9. ts-loader：将TypeScript转换成JavaScript
   10. awesome-typescript-loader：将TypeScript转换成JavaScript，性能优于ts-loader
   11. sass-loader：将SCSS/SASS代码转换成CSS
   12. css-loader：加载CSS，支持模块化、压缩、文件导入等特性
   13. style-loader：把css代码注入到JavaScript中，通过DOM操作去加载CSS
   14. postcss-loader：扩展CSS语法，使用下一代CSS，可以配合autoprefixer插件自动补齐CSS3前缀
   15. eslint-loader：通过ESLint检查JavaScript代码
   16. tslint-loader：通过TSLint检查TypeScript代码

3. 有哪些常见的Plugin，用过哪些
   1. define-plugin：定义环境变量（Webpack4 之后指定mode会自动配置）
   2. ignore-plugin：忽略部分文件
   3. html-webpack-plugin：简化HTML文件创建（依赖于html-loader）
   4. web-webpack-plugin：可方便地为单页应用输出HTML，比html-webpack-plugin好用
   5. webpack-parallel-uglify-plugin：多进程执行代码压缩，提升构建速度
   6. webpack-bundle-analyzer：可视化webpack输出文件的体积（业务组件、依赖第三方模块）

4. Loader 和 Plugin 的区别
   * Loader 本质就是一个函数，在该函数中对接收到的内容进行转换，返回转换后的结果。因为 Webpack 只认识 JavaScript，所以 Loader 就成了翻译官，对其他类型的资源进行转译的处理工作
   * Plugin 就是插件，在 Webpack 运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在合适的时机通过 Webpack 提供的 API 改变输出结果
   * Loader 在 module.rules 中配置，作为模块的解析规则，类型为数组。每一项都是一个 Object，内部包含了 test、loader、options 等属性
   * Plugin 在 plugins 中单独配置，类型为数组，每一项是一个 Plugin 的实例，参数通过构造函数传入

5. Webpack 的热更新原理
    Webpack 的热更新又叫热替换，缩写 HMR。这个机制可以做到不用刷新浏览器而将新变更的模块替换掉旧的模块。
    项目启动后与浏览器之间维护了个Websocket，当本地资源发生变化时，会向浏览器推进更新，并带上构建时的 hash，让客户端与上一次资源进行对比。客户端对比出差异后会向WDS发起Ajax请求来获取更改内容，这样客户端就可以再借助这些信息继续向WDS发起jsonp请求获取该chunk的增量更新。
    后续的部分（拿到增量更新之后如何处理？哪些状态该保留？哪些又需要更新？）由HotModulePlugin来完成，提供了相关API以供开发者针对自身场景进行处理

6. 代码分割的本质是什么，有什么意义
    代码分割的本质其实就是在源代码直接上线和打包成唯一脚本main.bundle.js这两种极端方案之间的一种更适合实际场景的中间状态。
    「用可接受的服务器性能压力增加来换取更好的用户体验」
    源代码直接上线：虽然过程可控，但是http请求多，性能开销大
    打包成唯一脚本：服务器压力小，但是页面空白期长，用户体验不好

7. 提高webpack打包速度
    1. 优化 Loader
       对于Loader来说，影响打包效率首当其冲必属Babel了。因为 Babel 会将代码转为字符串生成 AST，然后对 AST 继续进行转变最后再生成新的代码，项目越大，转换代码越多，效率就越低
    2. HappyPack
       受限于Node是单线程运行的，所以 Webpack 在打包的过程中也是单线程的，特别是在执行 Loader 的时候，长时间编译的任务很多，这样就会导致等待的情况。
       HappyPack 可以将 Loader 的同步执行转换为并行的，这样就能充分利用系统资源来加快打包效率了。
    3. DllPlugin
       DllPlugin 可以将特定的类库提前打包然后引入。这种方式可以极大的减少打包类库的次数，只有当类库更新版本才需要重新打包，并且也实现了将公共代码抽离成单独文件的优化方案
    4. 代码压缩
       在 Webpack3 中，一般使用 UglifyJS 来压缩代码，但是这个是单线程运行的，为了加快效率，可以使用 webpack-parallel-uglify-plugin 来并行运行 UglifyJS，从而提高效率
       而在 Webpack4 中，不需要以上这些操作了，只需要将 mode 设置为 production 就可以默认开启以上功能。代码压缩也是我们必做的性能优化方案，当然我们不止可以压缩 JS 代码，还可以压缩 HTML CSS 代码，并且在压缩 JS 代码的过程中，我们还可以通过配置实现比如删除 console.log 这类代码的功能。
8. 如何减少 Webpack 打包体积
    1. 在开发 SPA 项目的时候，项目中都会存在很多路由页面。如果将这些页面全部打包进一个 JS 文件的话，虽然将多个请求合并了，但是同样也加载了很多并不需要的代码，耗费了更长的时间。那么为了首页能更快地呈现给用户，希望首页能加载的文件体积越小越好，这时候就可以使用按需加载，将每个路由页面单独打包成为一个文件。不仅仅路由可以按需加载，对于 loadash 这种大型类库同样可以使用这个功能
    2. Scope Hoisting
       Scope Hoisting 会分析出模块之间的依赖关系，尽可能的把打包出来的模块合并到一个函数中去
    3. Tree Shaking
       Tree Shaking 可以实现删除项目中未被引用的代码。可以通过在启动 webpack 时追加参数 --optimize-minimize 来实现

9. 如何用 webpack 来优化前端性能
    用 webpack 优化前端性能是指优化 webpack 的输出结果，让打包的最终结果在浏览器运行快速高效。
    * 压缩代码：删除多余的代码、注释、简化代码的写法等等方式。可以利用 webpack 的 UglifyJsPlugin 和 ParalleUglifyPlugin 来压缩 JS 文件，利用 cssnano 来压缩 css
    * 利用 CDN 加速：在构建过程中，将引用的静态资源路径修改为 CDN 上对应的路径。可以利用 webpack 对于 output 参数和各 loader 的 publicPath 参数来修改资源路径
    * Tree Shaking：将代码中永远不会走到的片段删除掉。可以通过在启动webpack时追加参数 --optimize-minimize 来实现
    * Code Splitting：将代码按路由维度或者组件分块，这样做到按需加载，同时可以充分利用浏览器缓存
    * 提取公共第三方库：SplitChunksPlugin 插件来进行公共模块抽取，利用浏览器缓存可以长期缓存这些无需频繁变动的公共代码

10. 如何提高 webpack 的构建速度
    * 多入口情况下，使用 CommonsChunkPlugin 来提取公共代码
    * 通过 externals 配置来提取常用库
    * 利用 DllPlugin 和 DllReferencePlugin 预编译资源模块通过 DllPlugin 来对那些我们引用但是绝对不会修改的 npm 包来进行预编译，再通过 DllReferencePlugin 将预编译的模块加载进来
    * 使用 Happypack 实现多线程加速编译
    * 使用 webpack-uglify-parallel 来提升 uglifyPlugin 的压缩速度。原理上 webpack-uglify-parallel 采用了多核并行压缩来提升压缩速度
    * 使用 Tree-shaking 和 Sope Hoisting 来剔除多余代码

11. 如何提高 webpack 的构建速度
     * 多入口情况下，使用 CommonsChunkPlugin 来提取公共代码
     * 通过 externals 配置来提取常用库
     * 利用 DllPlugin 和 DllReferencePlugin 预编译资源模块通过 DllPlugin 来对那些我们引用但是绝对不会修改的 npm 包来进行预编译，再通过 DllReferencePlugin 将预编译的模块加载进来