# DOM

## 1. 获取dom

1. `document.querySelector()`

   根据CSS选择器获取dom，得到第一个匹配的dom

2. `document.querySelectorAll()`

   根据CSS选择器获取dom，得到所有匹配的dom伪数组

3. `document.documentElement`

   获取html元素

4. `dom.children`

   获取dom下所有子元素

5. `dom.parentElement`

   获取dom的父元素

## 2. 创建dom

`document.createElement()`

## 3. 更改dom结构

1. `dom.remove()`
2. `dom.insertBefore()`
3. `dom.appendChild()`

## 4. dom属性

属性分两种：

* 标准属性：HTML元素本身拥有的属性，例如：
  * a元素的href、title
  * input的value
  * img 的 src
* 自定义属性：HTML元素标准中未定义的属性

**所有标准属性均可通过 `dom.属性名` 得到，其中：**

* 布尔属性会被自动转换为boolean
* 路径类的属性会被转换为绝对路径
* 标准属性始终都是存在的，不管你是否有在元素中添加该属性

**所有的自定义属性均可通过下面的方式操作：**

* `dom.setAttribute(name, value)` 设置属性键值对
* `dom.getAttribute(name)` 获取属性值



> 如果使用 `getAttribute` 获取标准属性，则元素里写的是啥获取到的就是什么，没写获取到的就是null

## 5. dom 内容
