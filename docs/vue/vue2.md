# 1. Vue 的基本原理

## 1.1 基本原理

当一个 Vue 实例创建时，Vue 会遍历 data 中的属性，用 Object.defineProperty（v3 使用 proxy）将他们转为 getter/setter，并且在内部追踪相关依赖，在属性被访问和修改时通知变化。每个组件实例都有相应的 watcher 程序实例，它会在组件渲染的过程中把属性记录为依赖，之后当依赖项的 setter 被调用时，会通知 watcher 重新计算，从而使它关联的组件得以更新。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2369052cf3e244d5ac21c9505da97259~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

## 1.2 Vue 的优点

### 1. 轻量级框架

只关注视图层，是一个构建数据的视图集合，大小只有几十 kb。

### 2. 简单易学

国人开发，中文文档，不存在语言障碍，易于理解和学习。

### 3. 双向数据绑定

保留了 angular 的特点，在数据操作方面更为简单。

### 4. 组件化

保留了 react 的优点，实现了 html 的封装和重用，在构建单页面应用方面有着独特的优势。

### 5. 视图、数据，结构分离

使数据的更改更为简单，不需要进行逻辑代码的修改，只需要操作数据就能完成相关操作。

### 6. 虚拟 DOM

dom 操作是非常耗费性能的，不再使用原生的 dom 操作节点，极大解放 dom 操作，但具体操作的还是 dom 不过是换了另一种方式。

### 7. 运行速度更快

相比较于 react 而言，同样是操作虚拟 dom，就性能而言，vue 存在很大的优势。

# 2. 请阐述 Vue2 响应式原理

>  vue官方阐述：https://cn.vuejs.org/v2/guide/reactivity.html

**响应式数据的最终目标**，是当对象本身或对象属性发生变化时，将会运行一些函数（例如 $watch），最常见的就是render函数。

在具体实现上，vue用到了**几个核心部件**：

1. Observer
2. Dep
3. Watcher
4. Scheduler

## Observer

Observer要实现的目标非常简单，就是把一个普通的对象转换为响应式的对象

为了实现这一点，Observer把对象的每个属性通过`Object.defineProperty`转换为带有`getter`和`setter`的属性，这样一来，当访问或设置属性时，`vue`就有机会做一些别的事情。

<img src="http://mdrs.yuanjin.tech/img/20210226153448.png" alt="image-20210226153448807" style="zoom:50%;" />

Observer是vue内部的构造器，我们可以通过Vue提供的静态方法`Vue.observable( object )`间接的使用该功能。

在组件生命周期中，这件事发生在`beforeCreate`之后，`created`之前。

具体实现上，它会递归遍历对象的所有属性，以完成深度的属性转换。

由于遍历时只能遍历到对象的当前属性，因此无法监测到将来动态增加或删除的属性，因此`vue`提供了`$set`和`$delete`两个实例方法，让开发者通过这两个实例方法对已有响应式对象添加或删除属性。

对于数组，`vue`会更改它的隐式原型，之所以这样做，是因为vue需要监听那些可能改变数组内容的方法

<img src="http://mdrs.yuanjin.tech/img/20210226154624.png" alt="image-20210226154624015" style="zoom:50%;" />

总之，Observer的目标，就是要让一个对象，它属性的读取、赋值，内部数组的变化都要能够被vue感知到。

## Dep

这里有两个问题没解决，就是读取属性时要做什么事，而属性变化时要做什么事，这个问题需要依靠Dep来解决。

Dep的含义是`Dependency`，表示依赖的意思。

`Vue`会为响应式对象中的每个属性、对象本身、数组本身创建一个`Dep`实例，每个`Dep`实例都有能力做以下两件事：

- 记录依赖：是谁在用我
- 派发更新：我变了，我要通知那些用到我的人

当读取响应式对象的某个属性时，它会进行依赖收集：有人用到了我

当改变某个属性时，它会派发更新：那些用我的人听好了，我变了

<img src="http://mdrs.yuanjin.tech/img/20210226155852.png" alt="image-20210226155852964" style="zoom:50%;" />

## Watcher

这里又出现一个问题，就是Dep如何知道是谁在用我？

要解决这个问题，需要依靠另一个东西，就是Watcher。

当某个函数执行的过程中，用到了响应式数据，响应式数据是无法知道是哪个函数在用自己的

因此，vue通过一种巧妙的办法来解决这个问题

我们不要直接执行函数，而是把函数交给一个叫做watcher的东西去执行，watcher是一个对象，每个这样的函数执行时都应该创建一个watcher，通过watcher去执行

watcher会设置一个全局变量，让全局变量记录当前负责执行的watcher等于自己，然后再去执行函数，在函数的执行过程中，如果发生了依赖记录`dep.depend()`，那么`Dep`就会把这个全局变量记录下来，表示：有一个watcher用到了我这个属性

当Dep进行派发更新时，它会通知之前记录的所有watcher：我变了

<img src="http://mdrs.yuanjin.tech/img/20210226161404.png" alt="image-20210226161404327" style="zoom:50%;" />

每一个`vue`组件实例，都至少对应一个`watcher`，该`watcher`中记录了该组件的`render`函数。

`watcher`首先会把`render`函数运行一次以收集依赖，于是那些在render中用到的响应式数据就会记录这个watcher。

当数据变化时，dep就会通知该watcher，而watcher将重新运行render函数，从而让界面重新渲染同时重新记录当前的依赖。

## Scheduler

现在还剩下最后一个问题，就是Dep通知watcher之后，如果watcher执行重运行对应的函数，就有可能导致函数频繁运行，从而导致效率低下

试想，如果一个交给watcher的函数，它里面用到了属性a、b、c、d，那么a、b、c、d属性都会记录依赖，于是下面的代码将触发4次更新：

```js
state.a = "new data";
state.b = "new data";
state.c = "new data";
state.d = "new data";
```

这样显然是不合适的，因此，watcher收到派发更新的通知后，实际上不是立即执行对应函数，而是把自己交给一个叫调度器的东西

调度器维护一个执行队列，该队列同一个watcher仅会存在一次，队列中的watcher不是立即执行，它会通过一个叫做`nextTick`的工具方法，把这些需要执行的watcher放入到事件循环的微队列中，nextTick的具体做法是通过`Promise`完成的

> nextTick 通过 `this.$nextTick` 暴露给开发者
>
> nextTick 的具体处理方式见：https://cn.vuejs.org/v2/guide/reactivity.html#%E5%BC%82%E6%AD%A5%E6%9B%B4%E6%96%B0%E9%98%9F%E5%88%97

也就是说，当响应式数据变化时，`render`函数的执行是异步的，并且在微队列中

## 总体流程

![image-20210226163936839](http://mdrs.yuanjin.tech/img/20210226163936.png)



# 3. 组件之间的通信

## 3.1 父子组件通信

### prop

### event

### style 和 class

父组件可以向子组件传递 style 和 class，他们会合并到子组件的根元素中。

### attribute

如果父组件传递了一些属性到子组件，但子组件并没有声明这些属性，则他们称之为 attribute，这些属性会直接附着在子组件的根元素上，不包括 style 和 class。

子组件可以通过 inheritAttrs：false 配置，禁止将 attribute 附着在子组件的根元素上，但不影响通过 $attrs 获取。

### native 修饰符

在注册事件时，父组件可以使用 @**.native 修饰符，将事件注册到子组件的根元素上。

### $listeners

子组件可以通过 $listeners 获取父组件传递过来的所有事件处理函数，不含 .native 修饰器。

### v-model

### sync 修饰符

**用于解决多个数据的双向绑定。**和 v-model 的作用类似，用于双向绑定，不同点在于 v-model 只能针对一个数据进行双向绑定，而 sync 修饰符没有限制。

### `$parent` 和 `$children`

在组件内部，可以通过 `$parent` 和 `$children` 属性，分别得到当前组件的父组件和子组件实例。

### `$slots` 和 `$scopedSlots`

### ref

父组件可以通过 ref 获取到子组件的实例

## 3.2 跨组件通信

### Provide 和 Inject

示例

```js
// 父组件提供 foo
var Provider = {
  provide: {
    foo: "bar",
  },
};
// 子组件注入 foo
var Child = {
  inject: ["foo"],
  created() {
    console.log(this.foo); // => 'bar'
  },
};
```

### router

### vuex

适用于大型项目的数据仓库。

### store 模式

适用于中小型项目的数据仓库。

缺陷：无法跟踪数据的变化，多个地方修改同一个数据，会导致数据变化难以理解，为了解决而却优化这些问题，最终也会变成 vuex。

### eventbus

组件通知事件总线发生了某些事，事件总线通知其他监听该事件的所有组件运行某个函数。

# 4. 请你阐述一下对 vue 虚拟 dom 的理解

## 4.1 什么是虚拟 dom ?

虚拟 dom 本质上就是一个普通的 JS 对象，用于描述视图的界面结构。

在 vue 中，每个组件都有一个 render 函数，每个 render 函数都会返回一个虚拟 dom 树，这也就意味着每个组件都对应一棵虚拟 DOM 树。

## 4.2 为什么需要虚拟 dom？

在 vue 中，渲染视图会调用 render 函数，这种渲染不仅发生在组件创建时，同时发生在视图依赖的数据更新时。如果在渲染时，直接使用真实 DOM，由于真实 DOM 的创建、更新、插入等操作会带来大量的性能损耗，从而就会极大的降低渲染效率。

因此，vue 在渲染时，使用虚拟 dom 来替代真实 dom，主要为解决渲染效率的问题。

## 4.3 虚拟 dom 是如何转换为真实 dom 的？

在一个组件实例首次被渲染时，它先生成虚拟 dom 树，然后根据虚拟 dom 树创建真实 dom，并把真实 dom 挂载到页面中合适的位置，此时，每个虚拟 dom 便会对应一个真实的 dom。

如果一个组件受响应式数据变化的影响，需要重新渲染时，它任然会重新调用 render 函数，创建出一个新的虚拟 dom 树，用新树和旧树对比，通过对比，vue 会找到最小更新量，然后更新必要的虚拟 dom 节点，最后，这些更新过的虚拟节点，会去修改他们对应的真实 dom。

这样一来，就保证了对真实 dom 达到最小的改动。

## 4.4 模板和虚拟 dom 的关系

vue 框架中有一个 compile 模块，它主要负责将模板转换为 render 函数，而 render 函数调用后将得到虚拟 dom。

编译的过程分两步：

1. 将模板字符串转换为 AST
2. 将 AST 转换为 render 函数

如果使用传统的引入方式，则编译时间发生在组件第一次加载时，这称之为运行时编译。

如果是在 vue-cli 的默认配置下，编译发生在打包时，这称之为模板预编译。

编译是一个极其耗费性能的操作，预编译可以有效的提高运行时的性能，而且，由于运行的时候已不需要编译，vue-cli 在打包时会排除掉 vue 中的 compile 模块，以减少打包体积。

模板的存在，仅仅是为了开发人员更加方便的书写界面代码。

**vue 最终运行的时候，最终需要的是 render 函数，而不是模板，因此，模板中的各种语法，在虚拟 dom 中都是不存在的，他们都会变成虚拟 dom 的配置。**

# 5. 请阐述一下 v-model 的原理

v-model 既可以作用于表单元素，又可作用于自定义组件，无论是哪一种情况，它都是一个语法糖，最终会生成一个属性和一个事件。

* **当作用于表单元素时**，vue 会根据作用的表单元素类型而生成合适的属性和事件。例如，作用于普通文本框的时候，它会生成 value 属性和 Input 事件，而当其作用于单选框或多选框时，它会生成 checked 属性和 change 事件。

* **当其作用于自定义组件时，**默认情况下，他会生成一个 value 属性和 input 事件。

  开发者可以通过组件的 model 配置来改变生成的属性和事件。

  ```js
  const Comp = {
    model: {
      prop: "number",
      event: "change",
    },
  };
  ```


# 6. 请阐述 vue 的 diff 算法

> 参考回答：
>
> 当组件创建和更新时，vue 均会执行内部的 update 函数，该函数使用render 函数生成的虚拟 dom 树，将新旧两树进行对比，找到差异点，最终更新到真实 dom。
>
> 对比差异的过程叫 diff，vue 在内部通过一个叫 patch 的函数完成该过程。
>
> 在对比时，vue 采用深度优先、同层比较的方式进行比对。
>
> 在判断两个节点是否相同时，vue 是通过虚拟节点的 key 和 tag 来进行判断的。
>
> 具体来说，首先对根节点进行对比，如果相同则将旧节点关联的真实 dom 的引用挂到新节点上，然后根据需要更新属性到真实 dom，然后再对比其子节点数组；如果不相同，则按照新节点的信息递归创建所有真实 dom，同时挂到对应虚拟节点上，然后移除掉旧的 dom。
>
> 在对比其子节点数组时，vue 对每个子节点数组使用了两个指针，分别指向头尾，然后不断向中间靠拢来进行对比，这样做的目的是尽量复用真实 dom，尽量少的销毁和创建真实 dom。如果发现相同，则进入和根节点一样的对比流程，如果发现不同，则移动真实 dom 到合适的位置。
>
> 这样一直递归的遍历下去，直到整棵树完成对比。

## 6.1 diff 的时机

当组件创建时，以及依赖的属性或数据变化时，会运行一个函数，该函数会做两件事：

* 运行 _render 生成一棵新的虚拟 dom 树（vnode tree）
* 运行 _update，传入虚拟 dom 树的根节点，对新旧两课树进行对比，最终完成对真实 dom 的更新

核心代码如下：

```js
// vue 构造函数
function Vue() {
    // ... other code
    var updateComponent = () => {
        this._update(this._render())
    }
    new Watcher(updateComponent);
    // ... 其他代码
}
```

diff 就发生在 _update 函数的运行过程中。

## 6.2 _update 函数在干什么

_update 函数接收到一个 vnode 参数，这就是新生成的虚拟 dom 树。

同时，_update 函数通过当前组件的 _vnode 属性，拿到旧的虚拟 dom 树。

_update 函数首先会给组件的 _vnode 属性重新赋值，让它指向新树。

<img src="http://mdrs.yuanjin.tech/img/20210301193804.png" alt="image-20210301193804498" style="zoom:50%;" />

然后会判断旧树是否存在：

* 不存在：说明这是第一次加载组件，于是通过内部的 `patch` 函数，直接遍历新树，为每个节点生成真实DOM，挂载每个节点的`elm`属性上

  <img src="http://mdrs.yuanjin.tech/img/20210301194237.png" alt="image-20210301194237825" style="zoom:43%;" />

* 存在：说明之前已经渲染过该组件，于是通过内部的`patch`函数，对新旧两棵树进行对比，以达到下面两个目标：

  * 完成对所有真实dom的最小化处理
  * 让新树的节点对应合适的真实dom

  <img src="http://mdrs.yuanjin.tech/img/20210301195003.png" alt="image-20210301195003696" style="zoom:50%;" />

## 6.3 `patch` 函数的对比流程

**术语解释：**

1. 「**相同**」：是指两个虚拟节点的标签类型、`key` 值均相同，但`input`元素还要看`type`属性
2. 「**新建元素**」：是指根据一个虚拟节点提供的信息，创建一个真实dom元素，同时挂载到虚拟节点的`elm`属性上
3. 「**销毁元素**」：是指：`vnode.elm.remove()`
4. 「**更新**」：是指对两个虚拟节点进行对比更新，它**仅发生**在两个虚拟节点「相同」的情况下
5. 「**对比子节点**」：是指对两个虚拟节点的子节点进行对比

**详细流程：**

1. **根节点比较**

   <img src="http://mdrs.yuanjin.tech/img/20210301203350.png" alt="image-20210301203350246" style="zoom:50%;" />

   `patch`函数首先对根节点进行比较

   如果两个节点：

   - 「相同」，进入**「更新」流程**
     1. 将旧节点的真实dom赋值到新节点：`newVnode.elm = oldVnode.elm`
     2. 对比新节点和旧节点的属性，有变化的更新到真实 dom 中
     3. 当前两个节点处理完毕，开始**「对比子节点」**
   - 不「相同」
     1. 新节点**递归**「新建元素」
     2. 旧节点「销毁元素」

2. **「对比子节点」**

   在「对比字节点」时，vue 一切的出发点，都是为了：

   * 尽量啥也别做
   * 不行的话，尽量仅改动元素属性
   * 还不行的话，尽量移动元素，而不是创建和删除元素
   * 还不行的话，删除和创建元素

# 7. `new Vue` 之后，发生了什么？数据改变后，又发生了什么？

<img src="http://mdrs.yuanjin.tech/img/20210302155735.png" alt="image-20210302155735758" style="zoom: 33%;" />

## 7.1 创建 vue 实例和创建组件的流程基本一致

1. 首先做一些初始化的操作，主要是设置一些私有属性到实例中

2. **运行生命周期钩子函数`beforeCreate`**

3. 进入注入流程：处理属性、computed、methods、data、provide、inject，最后使用代理模式将他们挂载到实例中

   ```js
   // 伪代码
   function Vue(options) {
     var data = options.data();
     observe(data); // 变成响应式数据
     var methods = options.methods;
     Object.defineProperty(this, "a", {
       get() {
         return data.a;
       },
       set(val) {
         data.a = val;
       },
     });
   
     Object.entries(methods).forEach(([methodName, fn]) => {
       this[methodName] = fn.bind(this);
     });
   
     var updateComponent = () => {
       this._update(this._render());
     };
   
     new Watcher(updateComponent);
   }
   
   new Vue(vnode.componentOptions);
   
   ```

4. **运行生命周期钩子函数`created`**

5. 生成`render`函数：如果有配置，直接使用配置的`render`，如果没有，使用运行时编译器，把模板编译为`render`

6. **运行生命周期钩子函数`beforeMount`**

7. 创建一个`Watcher`，传入一个函数`updateComponent`，该函数会运行`render`，把得到的`vnode`再传入`_update`函数执行。在执行`render`函数的过程中，会收集所有依赖，将来依赖变化时会重新运行`updateComponent`函数。

   在执行`_update`函数的过程中，触发`patch`函数，由于目前没有旧树，因此直接为当前的虚拟dom树的每一个普通节点生成elm属性，既真实dom。

   如果遇到创建一个组件的vnode，则会进入组件实例化流程，该流程和创建 vue 实例流程基本相同，最终会把创建好的组件实例挂载 vnode 的 `componentInstance` 属性中，以便复用。

8. **运行生命周期钩子函数`mounted`**

## 7.2 重渲染

1. 数据变化后，所有依赖该数据的`Watcher`均会重新运行，这里仅考虑`updateComponent`函数对应的`Watcher`

2. `Watcher`会被调度器放到`nextTick`中运行，也就是微队列中，这样是为了避免多个依赖的数据同时改变后被多次执行

3. **运行生命周期钩子函数`beforeUpdate`**

4. `updateComponent`函数重新执行

   在执行`render`函数的过程中，会去掉之前的依赖，重新收集所有依赖，将来依赖变化时会重新运行`updateComponent`函数。

   在执行`_update`函数的过程中，触发`patch`函数。

   新旧两棵树进行对比。

   普通`html`节点的对比会导致真实节点被创建、删除、移动、更新。

   组件节点的对比会导致组件被创建、删除、移动、更新。

   当新组件需要创建时，进入实例化流程。

   当旧组件需要删除时，会调用旧组件的`$destroy`方法删除组件，该方法会先触发***生命周期钩子函数`beforeDestroy`**，然后递归调用子组件的`$destroy`方法，然后触发**生命周期钩子函数`estroyed`**。

   当组件属性更新时，相当于组件的`updateComponent`函数被重新触发执行，进入重渲染流程，和本节相同。

5. **运行生命周期钩子函数`updated`**

# 8. computed 和 methods 有什么区别？

**标准而浅显的回答：**

1. 在使用时，computed 当做属性使用，而methods则当做方法调用
2. computed 可以具有 getter 和 setter，因此可以赋值，而 methods 不行
3. computed 无法接收多个参数，而 methods 可以
4. computed 具有缓存，而methods没有

**更接近底层原理的回答：**

vue 对 methods 的处理比较简单，只需要遍历 methods 配置中的每个属性，将其对应的函数使用 bind 绑定当前组件实例后复制其引用到组件实例中即可。

而 vue 对 computed 的处理会稍微复杂一些：

当组件实例触发生命周期函数 `beforeCreate` 后，它会做一系列事情，其中就包括对 computed 的处理。

它会遍历 computed 配置中的所有属性，为每一个属性创建一个 Watcher 对象，并传入一个函数，该函数的本质其实就是 computed 配置中的 getter，这样一来，getter 运行过程中就会收集依赖。

但是和渲染函数不同，为计算属性创建的 Watcher 不会立即执行，因为要考虑到该计算属性是否会被渲染函数使用，如果没有使用，就不会得到执行。因此，在创建 Watcher 的时候，它使用了lazy 配置，lazy 配置可以让 Watcher 不会立即执行。

受到`lazy`的影响，Watcher 内部会保存两个关键属性来实现缓存，一个是`value`，一个是`dirty`。

`value`属性用于保存 Watcher 运行的结果，受`lazy`的影响，该值在最开始是`undefined`。

`dirty`属性用于指示当前的 `value` 是否已经过时了，即是否为脏值，受 `lazy` 的影响，该值在最开始是 `true`。

Watcher 创建好后，vue 会使用代理模式（`Object.definePrototype`），将计算属性挂载到组件实例中。

当读取计算属性时，vue 检查其对应的 Watcher 是否为脏值，如果是，则运行函数，计算依赖，并得到对应的值，保存在 Watcher 的 value 中，然后设置 dirty 为 false，然后返回。

如果 dirty 为 false，则直接返回 watcher 的 value。

巧妙的是，在依赖收集时，被依赖的数据不仅会收集到计算属性的 Watcher ，还会收集到组件的 Watcher。

当计算属性的依赖变化时，会先触发计算属性的 Watcher 执行，因此，它只需设置 `dirty` 为 true 即可，不做任何处理。

由于依赖同时会收集到组件的 Watcher，因此组件会重新渲染，而重新渲染时又读取到了计算属性，由于计算属性目前dirty 为，因此会重新运行 getter 进行运算。

而对于计算属性的 setter，则极其简单，当设置计算属性时，直接运行 setter 即可。

# 9. 优化

## 使用 key

对于通过循环生成的列表，应给每个列表项一个稳定且唯一的key，这有利于在列表变动时，尽量少的删除、新增、改动元素。

## 使用冻结的对象

```js
var obj = {a: 1, b: 2}
Object.freeze(obj)
```

冻结的对象（通过 `Object.isFreeze` 判断）不会被响应化。

## 使用函数式组件

```vue
<template functional>
	<h1>
        NormalComp: {{ props.count }}
    </h1>
</template>
<script>
export default {
    functional: true,
    props: {
        count: Number,
    }
}
</script>
```

## 使用计算属性

如果模板中某个数据会使用多次，并且该数据是通过计算得到的，使用计算属性以缓存他们。

## 非实时绑定的表单项

当使用 v-model 绑定一个表单项时，当用户改变表单项的状态时，也会随之改变数据，从而导致 vue 发生重渲染，这会带来一些性能的开销。

特别是当用户改变表单项时，页面有一些动画正在进行中，由于JS执行线程和浏览器渲染线程是互斥的，最终会导致动画出现卡顿。

我们可以通过使用 lazy 或不使用 v-model 的方式解决该问题，但要注意，这样可能会导致在某一个时间段内数据和表单项的值是不一致的。

## 保持对象引用稳定

在绝大部分情况下，`vue` 触发 `rerender ` 的时机是其依赖的数据发生**变化**。

若数据没有发生变化，哪怕给数据重新赋相同的值了，`vue` 也是不会做出任何处理的。

下面是 `vue` 判断数据 **没有变化** 的源码：

```js
// value 为旧值，newVal 为新值
if (newVal === value || (newVal !== newVal && value !== value)) {
    return
}
```

因此，如果需要，只要能保证组件的依赖数据不发生变化，组件就不会重新渲染。

对于原始数据类型，保持其值不变即可；

对于对象类型，保持其引用不变即可。

从另一方面来说，由于可以通过保持属性引用稳定来避免子组件的渲染，那么我们应该细分组件来尽量避免多余的渲染。

## 使用 v-show 替代 v-if

对于频繁切换显示状态的元素，使用 v-show 可以保证虚拟 dom 树的稳定，避免频繁的新增和删除元素，特别是对于那些内部包含大量 dom 元素的节点，这一点极其重要。

关键字：频繁切换显示状态、内部包含大量 dom 元素。

## 使用延迟装载（defer）



首页白屏时间主要受到两个因素的影响：

- 打包体积过大

  巨型包需要消耗大量的传输时间，导致JS传输完成前页面只有一个`<div>`，没有可显示的内容。

- 需要立即渲染的内容太多

  JS传输完成后，浏览器开始执行JS构造页面。

  但可能一开始要渲染的组件太多，不仅JS执行的时间很长，而且执行完成后浏览器要渲染的元素过多，从而导致页面白屏。

打包体积过大需要自行优化打包体积，**如何优化？？？**

渲染内容太多，一个可行的办法就是**延迟装载组件**，让组件按照指定的先后顺序依次一格一格渲染出来。

> 延迟装载是一个思路，本质上就是利用 `requestAnimationFrame` 事件分批渲染内容，它的具体实现多种多样。
>
> ```js
> export default function(maxFrameCount) {
>     return {
>         data() {
>             return {
>                 frameCount: 0
>             }
>         },
>         mounted() {
>             const refreshFrameCount = () => {
>                 requestAnimationFrame(() => {
>                     this.frameCount++;
>                     if (this.frameCount < maxFrameCount) {
>                         refreshFrameCount();
>                     }
>                 })
>             }
>             refreshFrameCount();
>         },
>         methods: {
>             defer(showInFrameCount) {
>                 return this.frameCount >= showInFrameCount;
>             }
>         }
>     }
> }
> ```

# 10. 请阐述 keep-alive 组件的作用和原理（性能优化）

keep-alive 组件是 vue 的内置组件，用于缓存内部组件实例。这样做的目的在于，keep-alive 内部的组件切回时，不用重新创建组件实例，而直接使用缓存中的实例，一方面能够避免创建组件带来的开销，另一方面可以保留组件的状态。

keep-alive 具有 include 和 exclude 属性，通过它们可以控制内部哪些组件进入缓存。另外它还提供了 max 属性，通过它可以设置最大缓存数，当缓存的实例超过该数时，vue 会移除最久没有使用的组件缓存。

受 keep-alive 的影响，其内部所有嵌套的组件都具有两个生命周期钩子函数，分别是 `activated` 和 `deactivated`，它们分别在组件激活和失活时触发。第一次 `activated` 触发是在 `moutend` 之后。

在具体的实现上，keep-alive 在内部维护了一个 key 数组和一个缓存对象。

```js
// keep-alive 内部的生命周期函数
created() {
    this.cache = Object.create(null)
    this.keys = []
}
```

key 数组记录目前缓存的组件 key 值，如果组件没有指定 key 值，则会为其自动生成一个唯一的 key 值。

cache 对象以 key 值为键，vnode 为值，用于缓存组件对应的虚拟 DOM。

在 keep-alive 的渲染函数中，其基本逻辑是判断当前渲染的 vnode 是否有对应的缓存，如果有，从缓存中读取到对应的组件实例，如果没有则将其缓存。

当缓存数量超过 max 数值时，keep-alive 会移除掉 key 数组的第一个元素。

```js
render() {
    const slot  = this.$slots.default; // 获取默认插槽
    const vnode = getFirstComponentChild(slot); // 得到插槽中的第一个组件的的vnode
    const name  = getComponentName(vnode.componentOptions); // 获取组件的名字
    const { cache, keys } = this; // 获取当前的缓存对象和key数组
    const key =  ...; // 获取组件的key值，若没有，会按照规则自动生成
    if (cache[key]) {
        // 有缓存，重用组件实例
        vnode.componentInstance = cache[key].componentInstance
        remove(keys, key); // 删除key
        // 将 key 加入到数组末尾，这样是为了保证最近使用的组件在数组中靠后，反之靠前
        keys.push(key);
    } else {
        // 无缓存，进行缓存
        cache[key] = vnode
        keys.push(key)
        if (this.max && keys.length > parseInt(this.max)) {
            // 超过最大缓存数量，移除第一个 key 对应的缓存
            pruneCacheEntry(cache, keys[0], keys, this._vnode);
        }
    }
    return vnode;
}
```

# 11. vue 节点销毁

[vue 节点销毁的时候做了些什么？](https://juejin.cn/post/6844904116666236942#heading-1)

1. 劫持的 set 触发了数据 deps 内所有关联的 watcher 的更新，接着触发组件的 update 从而进行新旧节点的 patch 进行相应的 dom 更新，dom 更新过程中就会存在节点的删除

2. 依次执行ref、director、transition、的remove或者destroy钩子

3. 执行组件的 $destroy 函数

4. 触发我们自己编写的 beforeDestroy 生命周期函数

5. 清除 vnode 子节点，接着清除 watchers 所有对应的依赖

6. 针对组件递归调用销毁

7. 触发 destroyed 生命周期函数

8. 所以我们组件的销毁执行顺序为：

   > 父beforeDestroy > 子beforeDestroy > 子destroy > 父destroy

9. 再下来执行 $off 函数

10. 将 _events 置空

11. 清除相关节点的引用

# 12. 长列表优化

```vue
<template>
	<div class="recycle-scroller-container" ref="container" >
        <div class="recycle-scroller-wrapper" :style="{ height: `${totalSize}px` }">
            <div
                 class="recycle-scroller-item"
                 v-for="poolItem in pool"
                 :key="poolItem.item[keyField]"
                 :style="{ transform: `translateY(${poolItem.position}px)` }"
             >
                <slot :item="poolItem.item"></slot>
    		</div>
    	</div>
    </div>
</template>

<script>
    // 滚动过快时，由于JS来不及执行，会出现空白，所以提前画好前后十条内容
    const prev = 10, next = 10;
    export default {
        props: {
            // 数据的数组
            items: {
                type: Array,
                default: () => [],
            },
            // 每条数据的高度
            itemSize: {
                type: Number,
                default: 0,
            },
            // 给我的 items 数组中，每个对象哪个属性代表唯一且稳定的编号
            keyField: {
                type: String,
                default: 'id'
            }
        },
        data() {
            return {
                // { item: 原始数据, position: 该数据对应的偏移位置 }
                pool: [], // 渲染池，保存当前需要渲染的数据
            }
        },
        computed: {
          totalSize() {
              return this.items.length * this.itemSize; // 总高度
          }  
        },
        mounted() {
            this.setPool();
            window.vm = this;
        },
        methods: {
            setPool() {
                const scrollTop = this.$refs.container.scrollTop;
                const height = this.$refs.container.clientHeight;
                let startIndex = Math.floor(scrollTop / this.itemSize);
                let endIndex = Math.ceil((scrollTop + height) / this.itemSize);
                startIndex -= prev;
                if (startIndex < 0) {
                    startIndex = 0;
                }
                endIndex += next;
                const startPos = startIndex * this.itemSize
                this.pool = this.items.slice(startIndex, endIndex).map((it, i) => ({
                    item: it,
                    position: startPos + i * this.itemSize,
                }))
            }
        }
    }
</script>

<style>
    .recycle-scroller-container {
        /* 固定高度 */
        height: 500px;
        overflow: auto;
    }
    .recycle-scroller-wrapper {
        position: relative;
    }
    .recycle-scroller-item {
        position: absolute;
        width: 100%;
        left: 0;
        top: 0;
    }
</style>
```

