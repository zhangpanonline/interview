### 1. 什么是vuex，谈谈你对它的理解

#### 1. Vuex是一个专为vue.js应用程序开发的状态管理模式。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。用来解决各组件之间传值的复杂和混乱的问题。

#### 2. 将我们在多个组件中需要共享的数据放到state中

#### 3. 要获取或格式化数据需要使用getters

#### 4. 改变state中的数据，可以使用mutation，但是只能包含同步的操作，在具体组件里面调用的方式 `this.$store.commit()`

#### 5. Action也是改变state中的数据，不过是提交的mutation，并且可以包含异步操作，在组件中的调用方式`this.$store.dispatch()`

### 2. vuex各模块在核心流程中的主要功能

#### Vue Components

Vue组件。HTML页面上，负责接受用户操作等交互行为，执行dispatch方法触发对应action进行回应。

#### dispatch

操作行为触发方法，是唯一能执行actoin的方法。

#### actions

操作行为处理模块。负责处理组件接收到的所有交互行为。包含同步/异步操作，支持多个同名方法，按照注册的顺序依次触发。向后台API请求的操作就是在这个模块中进行，包括触发其他action以及提交mutation的操作。该模块提供了Promise的封装，以支持action的链式触发。

#### commit

状态改变提交操作方法。对mutation进行提交，是唯一能执行mutation的方法

#### mutations

状态改变操作方法。是Vuex修改state的唯一推荐方法，其他修改方式在严格模式下将会报错。该方法只能进行同步操作，并且方法名只能全局唯一。

#### state

页面状态管理容器对象。集中存储Vue组件中data对象的零散数据，全局唯一，以进行统一的状态管理。页面显示所需的数据从该对象中进行读取，利用vue的细粒度数据响应机制来进行高效的状态更新。

#### getters

state对象读取方法。组件通过该方法读取全局state对象。

### 3. 简述vuex的数据传输流程

当组件进行数据修改的时候我们需要调用dispatch来触发actions里面的方法。actions里面的每个方法中都会有一个commit方法，当方法执行的时候会通过commit来触发mutations里面的方法进行数据的修改。mutations里面的每个函数都会有一个state参数，这样就可以在mutations里面进行state的数据修改，当数据修改完毕后，会传导给页面。页面的数据也会无法改变。

### 4. vuex中有几个核心属性（5个），分别是什么

#### 1. state 唯一数据源

#### 2. getters 类似于计算属性，它的返回值会根据它的依赖进行缓存

#### 3. mutation 更改store中状态唯一方法，通过store.commit触发

#### 4. action 可以包含异步造作，触发mutation改变state

#### 5. module

由于使用单一状态树，应用的所有状态会集中到一个比较大的对象。当应用变得非常复杂时，store对象就有可能变得相当臃肿。为了解决以上问题，vuex允许将store分割成模块。

```javascript
const moduleA = {
    state: () => ({...}),
    mutations: {...},
    actions: {...},
    getters: {...}
}
const moduleB = {
    state: () => ({...}),
    mutations: {...},
    actions: {...},
    getters: {...}
}
const store = new Vuex.Store({
    modules: {
        a: moduleA,
        b: moduleB
    }
})
store.state.a // moduleA的状态
store.state.b // moduleB的状态
```

### 5. action和mutation的区别

#### mutation 专注于修改State，理论上是修改State的唯一途径；action用来处理业务代码、异步请求。

#### mutation 必须同步执行；action 可以异步，但不能直接操作State。

#### mutation 的参数是state，它包含store中的数据；action 的参数是context，他是stater父级，包含state、getters。

### 6. vuex 和 localStorage 的区别

#### 1. 最重要的区别

* vuex存储在内存中，比从localStorage读取速度要快。
* localStorage则以文件的方式存储在本地，只能存储字符串类型的数据，存储对象需要JSON的stringfy和parse方法进行处理。

#### 2. 应用场景

* vuex昰一个专为vue应用程序开发的状态管理模式。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。vuex用于组件之间的传值。
* localstorage 是本地存储，是将数据存储到浏览器的方法，一般是在跨页面传递数据时使用。
* vuex能做到数据的响应式，localstorage不能

#### 3. 永久性

刷新页面时vuex存储的值会丢失，localstorage不会。

### 7. vuex页面刷新时数据丢失解决

用sessionstorage或者localstorage存储数据

### 8. vuex和单纯的全局对象有什么区别

#### 1. vuex的状态存储是响应式的

当vue组件从store中读取状态的时候，若store中的状态发生变化，那么相应的组件也会相应地得到高效更新。

#### 2. 不能直接改变store中的状态。

改变store中的状态唯一途径就是显示地提交mutation。这样可以方便地跟踪每一个状态的变化，从而能够实现一些工具帮助更好地了解我们的应用。

### 9. Redux和Vuex有什么区别，他们的共同思想

#### 1. 区别

* vuex改进了redux中的Action和Reducer函数，以mutations变化函数取代Reducer，只需在对应的mutatoin函数里改变state值即可。
* vuex由于vue自动重新渲染的特性，无需订阅重新渲染函数，只要生成新的state即可

通俗点理解是：vuex弱化dispatch，通过commit进行store状态的一次变更；取消了action概念，不必传入特定的action形式进行指定更改，弱化reducer，基于commit参数直接寻数据进行转变，使得框架更加简易。

#### 2. 共同思想

* 单一的数据源
* 变化可以预测

本质上：redux与vuex都是对mvvm思想的服务，将数据从视图中抽离进行全局共享的一种方案；

形式上：vuex借鉴了redux，将store作为全局的数据 中，进行模块化管理。

### 10. 为什么要用vuex或者redux

由于传参的方法对于多层嵌套的组件将会非常繁琐，并且对于兄弟组件间的状态传递无能为力。我们经常会采用父子组件直接引用或者通过事件来变更和同步状态的多份拷贝。以上的这些模式非常脆弱，通常会导致代码无法维护。

所以需要把组件的共享状态抽取出来，以一个全局单例模式管理。在这种模式下，组件树构成了一个巨大的“视图”，不管在树的哪个位置，任何组件都能获取状态或者触发行为。

另外，通过定义和隔离状态管理中的各种概念并强制遵守一定的规则，代码将会变得更结构化且易维护。

### 11. 为什么vuex的mutation中不能做异步操作

* vuex中所有的状态更新的唯一途径都是mutation，异步操作通过Action来提交mutation实现，这样可以方便地跟踪每一个状态的变化，从而能够实现一些工具帮助我们更好地了解的应用。
* 每个mutation执行完成后都会对应到一个新的状态变更，这样devtools就可以打个快照存下来，然后就可以实现time-travel了。如果mutation支持异步操作，就没有办法知道状态是何时更新的，无法很好的进行状态的追踪，给调试带来困难。

## 12. vuex的严格模式是什么，有什么作用，如何开启

在严格模式下，无论何时发生了状态变更且不是由mutation函数引起的，将会抛出错误。这能保证所有的状态变更都被调试工具追踪到。

在Vuex.Store构造器选项中开启，如下：

```js
const store = new Vuex.Store({
    strict: true
})
```

### 13. 如何在组件中批量使用vuex的getter属性

使用mapGetters：

````js
import { mapGetters } from 'vuex'
export default{
    computed: {
        ...mapGetters(['total', 'discountTotal'])
    }
}
````

### 14. 如何在组件中重复使用vuex的mutation

使用mapMutations：

```js
import { mapMutations } from 'vuex'
methods: {
    ...mapMutations({
        setNumber: 'SET_NUMBER'
    })
}
```

然后调用this.setNumber(10)，相当于调用this.$store.commit('SET_NUMBER', 10)

### 15. vuex的辅助函数怎么用

### mapState

```js
import { mapState } from 'vuex'
 
export default {
  // ...
  computed:{
     ...mapState({
         // 箭头函数可使代码更简练
         count: state => state.count,
         // 传字符串参数 'count' 等同于 `state => state.count`
         countAlias: 'count',
 
         // 为了能够使用 `this` 获取局部状态，必须使用常规函数
         countPlusLocalState (state) {
             return state.count + this.localCount
         }
  	})
  }
}
```

定义的属性名与state中的名称相同时，可以传入一个数组

```js
//定义state
const state={
    count:1,
}
 
//在组件中使用辅助函数
computed:{
    ...mapState(['count'])
}
```

### mapGetters

```js
computed:{
    ...mapGetters({
      // 把 `this.doneCount` 映射为 `this.$store.getters.doneTodosCount`
      doneCount: 'doneTodosCount'
    })
}
```

### mapMutations

```js
methods:{
    ...mapMutations({
        add: 'increment' // 将 `this.add()` 映射为 `this.$store.commit('increment')`
    })
}
```

当属性名与mapMutatios中定义的相同时，可以传入一个数组

```js
methods:{
    ...mapMutations([
        'increment', // 将 `this.increment()` 映射为 `this.$store.commit('increment')`
 
        // `mapMutations` 也支持载荷：
        'incrementBy' // 将 `this.incrementBy(amount)` 映射为 `this.$store.commit('incrementBy', amount)`
    ]),
}
```

### mapActions

```js
mathods:{
    ...mapActions({
        add: 'increment' // 将 `this.add()` 映射为 `this.$store.dispatch('increment')`
    })
}
```

当属性名与mapActios中定义的相同时，可以传入一个数组

```js
methods:{
    ...mapActions([
        'increment', // 将 `this.increment()` 映射为 `this.$store.dispatch('increment')`	
        // `mapActions` 也支持载荷：
        'incrementBy' // 将 `this.incrementBy(amount)` 映射为 `this.$store.dispatch('incrementBy', amount)`
    ]),
}
```

