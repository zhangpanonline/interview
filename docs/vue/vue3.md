1.  `vue2` 和 `vue3`的区别

   1. 数据响应式实现原理的不同

      * `vue3` 中使用了 `ES6` 的 `Proxy` `API` 对数据代理，监测的是整个对象，而不再是某个属性
      * `vue3` 可以监测到对象属性的删除和添加，可以监听数组的变化
      * `vue2` 需要将响应式数据定义在 `data` 里，而 `vue3` 则需要使用 `ref`、`reactive()` 定义响应式数据

   2. `vue3` 支持碎片化（Fragments）

      * `Vue2` 在组件中只有一个根节点
      * `vue3` 在组件中可以拥有多个根节点
      * 减少内存占用，减少`dom`层级嵌套

   3. `API`模式不同

      `vue2` 只支持选项式 `API`，而 `vue3` 除了兼容 `vue2` 的大部分写法，还支持 组合式 `API`

   4. 生命周期钩子不同

      * `setup()`：开始创建组件之前，在 `beforeCreate` 和`created`之前执行。创建的是 `data` 和 `method`
      * `onBeforeMount()`：组件挂载到节点上之前执行的函数
      * `onMounted()`：组件挂载完成后执行的函数
      * `onBeforeUpdate()`：组件更新之前执行的函数
      * `onUpdated()`组件更新完成之后执行的函数
      * `onBeforeUnmount()`组件卸载之前执行的函数
      * `onUnmounted()`组件卸载完成后执行的函数

      若组件被 `<keep-alive>` 包含，则多出下面两个钩子函数：

      * `onActivated()`：被激活时执行
      * `onDeactivated()`比如从 `A` 组件切换到 `B` 组件，`A`组件消失时执行

   5. 除此之外，还存其他的不同，例如 `父子传参不同`，子组件通过 `defineProps()` 进行接收，通过`defineEmits()` 向父组件派发事件等

   **总结：`vue3` 性能更高，体积更小，更利于复用，代码维护更方便**

2. `defineProperty` 和 `proxy` 的区别

   `vue` 在实例初始化时遍历 `data` 中的所有属性，并使用 `Object.defineProperty` 把这些属性全部转为`getter/setter`，并劫持各个属性的 `getter` 和 `setter`，在数据变化时发布消息给订阅者，触发相应的监听回调，而这之间存在几个问题

   1. 初始化时需要遍历对象所有 key，如果对象层次较深，性能不好

   2. 通知更新过程需要维护大量 `dep` 实例和 `watcher` 实例，额外占用内存较多

   3. `Object.defineProperty` 无法监听到数组元素的变化，只能通过劫持重写数组方法

   4. 动态新增、删除对象属性无法拦截，只能用特定 `set/delete` `API` 代替

   5. 不支持 `Map`、`Set` 等数据结构

   `vue3` 使用 `Proxy` 来监控数据的变化。**Proxy** 对象用于创建一个对象的代理，从而实现基本操作的拦截和自定义（如属性查找、赋值、枚举、函数调用等）。相对`Object.defineProperty()` ，其有以下特点：

   1. `Proxy`直接代理整个对象而非对象属性，这样只需做一层代理就可以监听同级结构下的所有属性变化，包括新增属性和删除属性
   2. 它的处理方式是在`getter`中去递归响应式，这样的好处是真正访问到的内部属性才会变成响应式，简单的可以说是按需实现响应式，减少性能消耗
   3. `Proxy`可以监听数组的变化

3. Vue3 Diff 算法和 Vue2 的区别

   我们知道在数据变更触发页面重新渲染，会生成虚拟DOM并进行patch过程，这一过程在vue3 中的优化有如下

   **编译阶段的优化：**

   * 事件缓存：将事件缓存（如：@click），可以理解为变成静态的了
   * 静态提升：第一次创建静态节点时保存，后续直接复用
   * 添加静态标记：给节点添加静态标记，以优化Diff过程

   由于编译阶段的优化，除了能更快的生成虚拟DOM以外，还使得Diff时可以跳过“永远不会变化的节点”

   **Diff优化如下：**

   * Vue 是全量 Diff，Vue3 是静态标记 + 非全量 Diff
   * 使用最长递增子序列优化了对比流程

   根据vue作者公布的数据，Vue3 性能提升了 1.3 ~ 2 倍

4. composition API 与 options API 的区别

   * optionsAPI

     优点：易于学习和使用，每个代码有着明确的位置

     缺点：相似的逻辑，不容易复用，在大项目中尤为明显，虽然  optionsAPI 可以通过 mixins 提取相同的逻辑，但是也并不是特别好维护

   * compositionAPI

     * 基于逻辑功能组织代码的，一个功能api相关放到一起
     * 即使项目大了，功能多了，也能快速定位功能相关的api
     * 大大的提升了代码可读性和可维护性

   * vue3 推荐使用compositionAPI，也兼容了 optionsAPI 的写法

5.  

6. setup 函数

   setup() 函数是 vue3 中，专门为组件提供的新属性。它为我们使用的 vue3 的 Composition API 新特性提供了统一入口，setup 函数会在 beforeCreate、created 之前执行，vue3 也是取消了这两个钩子，统一用 setup 代替，改函数相当于一个生命周期函数，vue中过去的data、methods、watch 等都用新的api写在 setup() 函数中。

   setup() 函数接收两个参数 props 和 context。它里面不能使用this，而是用context 对象代替当前执行上下文绑定的对象，context 对象有四个属性：arrts、emits、slots、expose

   setup() 里面通过 ref 和 reactive 代替以前的 data 语法，return 出去的变量和方法可以在模板中使用。

   ```vue
   <template>
     <div class="container">
       <h1 @click="say()">{{msg}}</h1>
     </div>
   </template>
   
   <script>
   export default {
     setup (props,context) {
       console.log('setup执行了')
       console.log(this)  // undefined
       // 定义数据和函数
       const msg = 'hi vue3'
       const say = () => {
         console.log(msg)
       }
       // Attribute (非响应式对象，等同于 $attrs)
       context.attrs
       // 插槽 (非响应式对象，等同于 $slots)
       context.slots
       // 触发事件 (方法，等同于 $emit)
       context.emit
       // 暴露公共 property (函数)
       context.expose
   
       return { msg , say}
     },
     beforeCreate() {
       console.log('beforeCreate执行了')
       console.log(this)  
     }
   }
   </script>
   ```

7. setup 语法糖（script setup 语法）

   script setup 是在单文件组件（SFC）中使用组合式 API 的编译时语法糖，相比于普通的 script 语法更加简洁，可以直接调用：defineProps、defineEmits、definedExpose、useSlost、useAttrs。

8. reactive、shallowReactive 函数

   reactive() 函数接收一个普通对象，返回一个响应式的数据对象，响应式转换是“深层”的，它影响所有嵌套属性，基于proxy来实现。

   shallowReactive() 创建一个响应式代理，它跟踪其自身属性的响应性生成非递归响应数据，只监听第一层数据的变化，但不执行嵌套对象的深层响应式转化（暴露原始值）

9. ref、shallowRef、isRef、toRefs 函数

   

