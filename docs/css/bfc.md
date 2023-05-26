#  `BFC`

## 一、防止父元素高度坍塌最典型的四种方案

### 问题重现：

* 父元素的高度，都是由内部未浮动子元素的高度撑起来的
* 如果**子元素浮动**起来，就**不占用普通文档流**的位置。**父元素高度**就会**失去支撑**，也称为**高度坍塌**。
  

### 四种解决方法：

> 可以給父元素设置固定高度，不建议这样做，因为一般情况下是无法知道父元素的具体高度，也不利于后期维护



#### 1. 方案一：給父元素设置 `overflow: hidden` 属性

* 原理：`CSS` 中的 `overflow:hidden` 属性会 `强制要求父元素必须包裹住所有内部浮动的元素，以及所有元素的 margin 范围`。
* 缺点：如果父元素下某一个子元素需要超出父元素范围显示，这样就有问题了。例如：顶部菜单栏，鼠标放上去需要经下拉显示子菜单这种情况。

#### 2. 方案二：在 `父元素内的结尾追加一个空子元素（块级元素）` ，并设置 `空子元素清除浮动` 影响（clear: both）

* 原理：利用 `clear:both` 属性和父元素必须包含非浮动的元素两个原理
* 缺点：无端多出一个无意义的看不见的空元素，影响选择器和查找元素

#### 3. 方案三：设置**父元素也浮动**

* 原理：**浮动属性也会（与 `overflow: hidden 相似`）强制父元素包含所有浮动的内部元素**
* 缺点：会**产生新的浮动影响**。比如，父元素浮动，导致父元素之后平级的页脚div上移，被父元素挡住了
* 解决：设置父元素之后的平级元素清除浮动（clear: both）

#### 4. 方案四：为**父元素末尾伪元素设置clear: both**

* 完美解决方法：

  ```css
  .parent::after {
      content: '';
      display: block;
      height: 0;
      clear: both;
  }
  ```

  

* 优点：既不会影响显示隐藏，又不会影响查找元素，又不会产生新的浮动问题



## 二、什么是 BFC

> 为什么 `1.1` 里四种解决方案里的`overflow: hidden` 和給父元素设置 `float` 都会 *强制父元素包裹所有内部元素呢* ？

* BFC(Block formatting context)

* 直译为 ”块级格式化上下文“

* 它是网页中一个 **独立的渲染区域** （也称为 `formatting context`）

* 这个渲染区域 **只有块级（Block）元素才能参与**

* 它 **规定** 了 **内部的块级元素如何布局**

* BFC渲染区域内部如何布局，**与区域外部毫不想干**

* **外部** 元素 **也不会影响** BFC渲染 **区域内的元素**

  > 简单来说，BFC 就是：
  >
  > 1. 独立渲染区域
  > 2. 内部不影响外部
  > 3. 外部不影响内部

## 三、两种渲染区域 （Formatting Context）

其实，CSS中有2种渲染区域：块级元素渲染区域和行级元素渲染区域

* 块级元素渲染区域：BFC (block fomatting context)
* 行级元素渲染区域：IFC (inline formatting context)

## 四、BFC的布局规则【重要】 :heavy_exclamation_mark:

* 默认，内部的块元素会在垂直方向，一个接一个地放置。每个块元素独占一行
* 块元素垂直方向的总距离由边框内大小 + `margin` 共同决定
* 属于同一个BFC的两个相邻块元素在垂直方向上的 `margin` 会发生重叠/合并。但水平方向的 `margin` 不会
* 计算父元素BFC渲染区域的高度时，内部浮动元素的高度，都必须算在内

## 五、四种情况会形成BFC渲染区域【重要】 :heavy_exclamation_mark:

* `float` 的值不是 `none`

* `position` 的值不是 `static` 或者 `relative`

* `display` 的值是 `inline-block` 、`table-cell` 、`flex`、`table-caption` 或者 `inline-flex`

* `overflow` 的值不是 `visible` 、`clip` 的块元素

  > `overflow` 的 `hidden` 和 `clip` 属性区别：
  >
  > 1. 都以元素的边距（padding）盒进行裁剪，并且禁止内容滚动，但是 `hidden` 可以以编程形式进行滚动（`scrollLeft``scrollTo()`），所以 `hidden` 形成还是一个股东容器，但 `clip` 不是滚动容器
  > 2. `hidden` 会形成 `BFC`，而 `clip` 不会

更多创建块格式化上下文参见：[块格式化上下文](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Block_formatting_context)

## 六、BFC 可以解决哪些问题

### 1. 避免垂直方向 margin 合并

解决方法：

1. 用一个外围块元素包裹上方或下方元素
2. 給外围元素设置 `overflow: hidden` 使其形成 `BFC`

原理：

1. 新外层元素，变成一个BFC
