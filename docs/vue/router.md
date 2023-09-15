### 1. 对前端路由的理解

在前端技术早期，一个url对应一个页面，如果要从A页面切换到B页面，那么必然伴随着页面的刷新，这个体验并不好。

后来Ajax出现了，它允许人们在不刷新页面的情况下发起请求；与之共生的，还有“不刷新页面即可更新页面内容”这种需求。在这样的背景下，出现了单页面应用。

SPA极大地提升了用户体验，它允许页面在不刷新的情况下更新页面内容，使内容的切换更加流畅。但是在SPA诞生之处，人们并没有考虑到“定位”这个问题——在内容切换前后，页面的URL都是一样的，这就带出来了两个问题：

* SPA其实并不知道当前页面“进展到了哪一步”。可能在一个站点下经过了反复的“前进”才终于唤出了某一块内容，但是此时只要刷新一个页面，一切就会被清零，必须重复之前的操作，才可以重新对内容进行定位——SPA并不会“记住”你的操作。
* 由于有且仅有一个URL给页面做映射，这对SEO也不够友好，搜索引擎无法收集全面的信息。

**为了解决这个问题，前端路由出现了**

前端路由可以帮助我们在仅有一个页面的情况下，“记住”用户当前走到了哪一步——为SPA中的各个视图匹配一个唯一标识。这意味着用户前进、后退触发的新内容，都会映射到不同的URL上。此时即便刷新页面，因为当前的URL可以标识出他所处的位置，因此内容也不会丢失。

那么如何实现呢？首先需要解决两个问题：

* 当用户刷新页面时，浏览器会默认根据当前URL对资源进行重新定位（发送请求）。这个动作对SPA是不必要的，因为我们的SPA作为单页面，无论如何也只会有一个资源与之对应。此时若走正常的请求-刷新流程，反而会使用户的前进后退操作无法被记录。
* 单页面应用对服务端来说，就是一个URL、一套资源，那么如何做到用“不同的URL”来映射不同的视图内容呢

从这两个问题看，服务端已经无法解决这个场景，只能前端解决：

* 拦截用户的刷新操作，避免服务端盲目响应、返回不符合预期的资源内容。把刷新这个动作完全放到前端逻辑里消化掉。
* 感知URL的变化。这里不是说要改造URL、凭空制造出N个URL来。而是说URL还是那个URL，只不过我们可以给它做一些微小的处理——这些处理并不会影响URL本身的性质，不会影响服务器对它的识别，只有我们前端感知的到。一旦我们感知到了，我们就根据这些变化，用JS去给它生成不同的内容。

### 2. VueRouter是什么，有哪些组件

* vue router 是官方的路由管理器。它和Vue.js的核心深度集成，路径和组件的映射关系，让构建单页面应用变得容易。
* router-link 实质上最终会渲染成a链接。
* router-view 用于显示子路由
* keep-alive 包裹缓存的组件

### 3. `$route` 和 `$router` 的区别

* $route 是“路由信息对象”，包括path、params、hash、query、fullPath、matched、name等路由信息参数
* $router 是“路由实例”对象包括了路由的跳转方法，钩子函数等

### 4. 路由开发的优缺点

优点：

* 整体不刷新页面，用户体验更好
* 数据传递容易，开发效率高

缺点：

* 开发成本高（需要学习专门知识）
* 首次加载会比较慢一点
* 不利于SEO

### 5. VueRouter的使用方式

1. 使用Vue.use() 将 VueRouter 插入
2. 创建路由规则
3. 创建路由对象
4. 将路由对象挂到Vue实例上
5. 设置RouterView展示根路由

### 6. vue-router 路由模式有几种

**hash模式、history模式、Abstract模式**

#### 6.1 前端路由原理

前端路由的核心，就在于改变视图的同时不会向后端发出请求，而是加载路由对应的组件。

vue-router就是将组件映射到路由，然后渲染出来，并实现了hash、history、abstrace三种模式。

##### hash模式

是指url后的#号和后面的字符。hash虽然出现在url中，但不会被包括在http请求中，对后端完全没有影响，因此改变hash不会被重新加载页面。

##### history模式

URL就像正常的url，不过这种模式还需要后台配置支持。因为我们的应用是个单页客户端应用，如果后台没有正确的配置，当用户在浏览器直接访问就会返回404。

##### Abstract模式

支持所有javascript运行模式。vue-router自身会对环境做校验，如果发现没有浏览器的API，路由会自动强制进入abstract模式。在移动端原生环境中也是使用abstract模式。

#### 6.2 修改路由模式

在实例化路由对象旰，传入mode选项进行修改。

#### 6.3 Hash模式

##### 原理

**基于浏览器的hashchange事件**，地址变化时，通过window.location.hash获取地址上的hash值；并通过构造Router类，配置routes对象设置hash值与对应的组件内容。

##### **优点**

1. hash值会出现在URL中，但是不会被包含在http请求中，因此hash值改变不会重新加载页面
2. hash改变会触发hashchange事件，能控制浏览器的前进后退
3. 兼容性好

##### 缺点

1. 地址栏中携带#，不美观
2. 只可修改#后面的部分，因此只能设置与当前URL同文档的URL
3. hash有体积限制，故只可添加短字符串
4. 设置的新值必须与原来不一样才会触发hashchange事件，并将记录添加到栈中
5. 每次URL的改变不属于一次http请求，所以不利于SEO优化

#### 6.4 History模式

##### 原理

**基于HTML5新增的pushState()和replaceState()两个api，以及浏览器的popstate事件**，地址变化时，通过window.location.pathname找到对应的组件。并通过构造Router类，配置routes对象设置pathname值与对应的组件内容。

##### 优点

1. 没有#，更美观
2. pushState() 设置的新URL可以是与当前URL同源的任意URL
3. pushState() 设置的新URL可以与当前URL一模一样，这样也会把记录添加到栈中
4. pushState() 通过stateObject参数可以添加任意类型的数据到记录中
5. pushState() 可额外设置title属性供后续使用
6. 浏览器的前进后退能触发浏览器的popsate事件，获取window.location.pathname来控制页面的变化

##### 缺点

1. URL的改变属于http请求，借助history.pushState实现页面的无刷新跳转，因此会重新请求服务器。所以**前端的URL必须和实际向后端发起请求的URL一致。**如果用户输入的URL回车或者浏览器刷新或者分享出去某个页面路径，用户点击后，URL与后端配置的页面请求URL不一致，则匹配不到任何静态资源，就会返回404页面。所以需要后台配置支持，覆盖所有情况的候选资源，如果URL匹配不到任何静态资源，则应该返回app依赖的页面或者应用首页。
2. **兼容性差**，特定浏览器支持

#### 6.5 为什么history模式下路由跳转会报404

1. URL的改变属于http请求，借助history.pushState实现页面的无刷新跳转，因此会重新请求服务器。
2. 所以前端的URL必须和实际向后端发起请求的URL一致。

### 7. 路由跳转有哪些方式

1. this.$router.push() 跳转到指定的url，并在history中添加记录，点击回退返回到上一个页面。
2. this.$router.replace() 跳转到指定的url，但是history中不会添加记录，点击回退到上上个页面。
3. this.$router.go(n) 向前或者后跳转n个页面，n可以是正数也可以是负数。

**编程式导航使用的方法以及常用的方法**

* 路由跳转：this.$router.push()
* 路由替换：this.$router.replace()
* 后退：this.$router.back()
* 前进：this.$router.forward()

### 8. vue-router 跳转和 location.href 有什么区别

* 使用 location.href = /url 跳转，简单方便，但是刷新了页面。
* 使用 history.pushState(/url)，无刷新页面，静态跳转。
* 引进 router，然后使用 router.push(/url) 来跳转，使用了 diff 算法，实现了按需加载，减少了 dom 消耗。其实使用router跳转和使用history.pushState() 没什么差别的，因为vue-router就是用了 history.pushState()，尤其是在history模式下。

### 9. 如何获取页面的hash变化

1. 监听$route的变化

   ```js
   watch: {
       $route: {
           deep: true,
           handler: function(val, oldVal) {
               console.log(val)
           }
       }
   }
   ```

2. window.location.hash 读取#值

   window.location.hash 的值可读可写，读取来判断状态是否改变，写入时可以在不重载网页的前提下，添加一条历史访问记录。

### 10. 路由的传参方式

#### 10.1 声明式导航传参

在router-link上的 to 属性传值：

1. /path?参数名=值

   获取：$route.query.参数名

2. /path/值/值 -> 需要路由对象提前配置 path："/path/参数名1/参数名2"

   获取：$route.params.参数名1

#### 10.2 编程式导航传参

this.$router.push() 根据传的值自动匹配是path还是name，

因为使用path会自动忽略params，所以会出现两种组合。

##### 1. name + params 方式传参

A页面传参

```js
this.$router.push({
    name: 'xxx',
    params: {
        id: id
    }
})
```

B页面获取：

```js
this.$route.params.id
```

##### 2. path + query 方式传参

A页面传参

```js
this.$router.push({
    path: '/xxx',
    query: {
        id: id
    }
})
```

B页面获取：

```js
this.$route.query.id
```

### 11. params 和 query 方式传参的区别

1. 写法上不同
2. 地址栏不同
3. 刷新方式不同

 **用法：**query要用path来引入，params要用name来引入，接收参数都是类似的，分别是`this.$route.query.name` 和 `this.$route.params.name`。

**url地址显示：**query更加类似于ajax中的get传参，params则类似于post，说的更简单一点，前者在浏览器地址栏中显示参数，后者则不显示。

**注意：**query刷新不会丢失query里面的数据，params刷新会丢失params里面的数据。

### 12. 路由配置项常用的属性及作用

* path：跳转路径
* component：路径相对应的组件
* name：命名路由
* children：子路由配置
* props：路由解耦
* redirect：重定向路由

### 13. vue-router 导航守卫有哪些

#### 13.1 全局守卫

* router.beforeEach：全局前置守卫，进入路由前触发

  ```js
  router.beforeEach((to, from, next) => {
      if (!登录) {
          if (to.path == '/login') {
              next()
          } else {
            // 跳转到登录页面  
          }
      } else {
          return next()
      }
  })
  ```

  

* router.beforeResolve：全局解析守卫，在beforeRouteEnter调用之后调用

* router.afterEach：全局后置钩子，进入路由之后

  ```js
  router.afterEach((to, from) => {
      // 跳转后滚动条回到顶部
      window.scrollTo(0, 0)
  })
  ```

#### 13.2 单个路由独享守卫

* beforeEnter

  ```js
  export default [
      {
          path: '/',
          name: 'login',
          component: login,
          beforeEnter: (to, from, next) => {
              console.log('即将进入登录页面')
              next()
          }
      }
  ]
  ```

#### 13.3 组件内的守卫

`beforeRouteEnter`、`beforeRouteUpdate`、`beforeRouteLeave`

这三个钩子都有三个参数：to、from、next

* beforeRouteEnter：进入组件前触发
* beforeRouteUpdate：当前地址改变并且该组件被复用时触发，举例来说，带有动态参数的路径 foo/：id，在 /foo/1 和 /foo/2 之间跳转的时候，由于会渲染同样的组件，这个钩子在这种情况下就会被调用。
* beforeRouteLeave：离开组件前被调用

### 14. vue-router 路由钩子在生命周期函数的体现

#### 14.1 完整的路由导航解析流程（不包括其他生命周期）

1. 触发进入其他路由
2. 调用要离开路由的组件守卫：beforeRouteLeave
3. 调用全局前置守卫：beforeEach
4. 在重用的组件里调用：beforeRouteUpdate
5. 调用路由独享守卫：beforeEnter
6. 解析异步路由组件
7. 在将要进入的路由组件中调用：beforeRouteEnter
8. 调用全局解析守卫：beforeResove
9. 导航被确认
10. 调用全局后置钩子的 afterEach 钩子
11. 触发DOM更新（mounted）
12. 执行beforeRouteEnter守卫中传给next的回调函数

#### 14.2 触发钩子的完整顺序

路由导航、keep-alive、和组件生命周期钩子结合起来的，触发顺序，假设是从a组件离开，第一次进入b组件：

1. beforeRouteLeave：离开a组件前，可以取消离开
2. beforeEach：路由全局前置守卫，可用于登录验证、全局路由loading等
3. beforeEnter：路由独享守卫
4. beforeRouteEnter：路由组件的组件进入路由前钩子
5. beforeResolve：路由全局解析守卫
6. afterEach：路由全局后置钩子
7. beforeCreate
8. created
9. beforeMount
10. deactivated
11. mounted
12. activated
13. beforeRouteEnter

#### 14.3 导航行为被触发到导航完成的整个过程

1. 导航行为被触发，此时导航未被确认
2. 在失活的组件里调用离开守卫 beforeRouteLeave
3. 调用全局的 beforeEach 守卫
4. 在重用的组件里调用 beforeRouteUpdate 守卫
5. 在路由配置里调用 beforeEnter
6. 解析异步路由组件（如果有）
7. 在被激活的组件里调用 beforeRouteEnter
8. 调用全局的 beforeResolve，表示解析阶段完成
9. 导航被确认
10. 调用全局的 afterEach 钩子
11. 非重用组件，开始组件实例的生命周期：beforeCreate&created、beforeMounted&mounted
12. 触发DOM更新
13. 用创建好的实例调用 beforeRouteEnter 守卫中传给 next 的回调函数
14. 导航完成
