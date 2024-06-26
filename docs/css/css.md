﻿# 一、`BFC`

## 一、防止父元素高度坍塌最典型的四种方案

### 问题重现：

- 父元素的高度，都是由内部未浮动子元素的高度撑起来的
- 如果**子元素浮动**起来，就**不占用普通文档流**的位置。**父元素高度**就会**失去支撑**，也称为**高度坍塌**。

### 四种解决方法：

> 可以給父元素设置固定高度，不建议这样做，因为一般情况下是无法知道父元素的具体高度，也不利于后期维护

#### 1. 方案一：給父元素设置 `overflow: hidden` 属性

- 原理：`CSS` 中的 `overflow:hidden` 属性会 `强制要求父元素必须包裹住所有内部浮动的元素，以及所有元素的 margin 范围`。
- 缺点：如果父元素下某一个子元素需要超出父元素范围显示，这样就有问题了。例如：顶部菜单栏，鼠标放上去需要经下拉显示子菜单这种情况。

#### 2. 方案二：在 `父元素内的结尾追加一个空子元素（块级元素）` ，并设置 `空子元素清除浮动` 影响（clear: both）

- 原理：利用 `clear:both` 属性和父元素必须包含非浮动的元素两个原理
- 缺点：无端多出一个无意义的看不见的空元素，影响选择器和查找元素

#### 3. 方案三：设置**父元素也浮动**

- 原理：**浮动属性也会（与 `overflow: hidden 相似`）强制父元素包含所有浮动的内部元素**
- 缺点：会**产生新的浮动影响**。比如，父元素浮动，导致父元素之后平级的页脚 div 上移，被父元素挡住了
- 解决：设置父元素之后的平级元素清除浮动（clear: both）

#### 4. 方案四：为**父元素末尾伪元素设置 clear: both**

- 完美解决方法：

  ```css
  .parent::after {
    content: "";
    display: block;
    height: 0;
    clear: both;
  }
  ```

- 优点：既不会影响显示隐藏，又不会影响查找元素，又不会产生新的浮动问题

## 二、什么是 BFC

> 为什么 `1.1` 里四种解决方案里的`overflow: hidden` 和給父元素设置 `float` 都会 _强制父元素包裹所有内部元素呢_ ？

- BFC(Block formatting context)

- 直译为 ”块级格式化上下文“

- 它是网页中一个 **独立的渲染区域** （也称为 `formatting context`）

- 这个渲染区域 **只有块级（Block）元素才能参与**

- 它 **规定** 了 **内部的块级元素如何布局**

- BFC 渲染区域内部如何布局，**与区域外部毫不想干**

- **外部** 元素 **也不会影响** BFC 渲染 **区域内的元素**

  > 简单来说，BFC 就是：
  >
  > 1. 独立渲染区域
  > 2. 内部不影响外部
  > 3. 外部不影响内部

## 三、两种渲染区域 （Formatting Context）

其实，CSS 中有 2 种渲染区域：块级元素渲染区域和行级元素渲染区域

- 块级元素渲染区域：BFC (block fomatting context)
- 行级元素渲染区域：IFC (inline formatting context)

## 四、BFC 的布局规则【重要】 :heavy_exclamation_mark:

- 默认，内部的块元素会在垂直方向，一个接一个地放置。每个块元素独占一行
- 块元素垂直方向的总距离由边框内大小 + `margin` 共同决定
- 属于同一个 BFC 的两个相邻块元素在垂直方向上的 `margin` 会发生重叠/合并。但水平方向的 `margin` 不会
- 计算父元素 BFC 渲染区域的高度时，内部浮动元素的高度，都必须算在内

## 五、四种情况会形成 BFC 渲染区域【重要】 :heavy_exclamation_mark:

- `float` 的值不是 `none`

- `position` 的值不是 `static` 或者 `relative`

- `display` 的值是 `inline-block` 、`table-cell` 、`flex`、`table-caption` 或者 `inline-flex`

- `overflow` 的值不是 `visible` 、`clip` 的块元素

  > `overflow` 的 `hidden` 和 `clip` 属性区别：
  >
  > 1. 都以元素的边距（padding）盒进行裁剪，并且禁止内容滚动，但是 `hidden` 可以以编程形式进行滚动（` scrollLeft``scrollTo() `），所以 `hidden` 形成还是一个滚动容器，但 `clip` 不是滚动容器
  > 2. `hidden` 会形成 `BFC`，而 `clip` 不会

更多创建块格式化上下文参见：[块格式化上下文](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Block_formatting_context)

## 六、BFC 可以解决哪些问题

### 1. 避免垂直方向 margin 合并

方法一：

1. 用一个外围块元素包裹上方或下方元素
2. 給外围元素设置 `overflow: hidden` 使其形成 `BFC`

原理：

1. 新外层元素，变成一个 `BFC` 方式的渲染区域，就必须包裹内部子元素及子元素的 `margin`
1. 内部元素不能超出范围影响外部，外部元素也不能进入 `BFC` 范围内，影响内部

缺点：

 如果父元素中部分自由定位的子元素，希望即使超出父元素范围，也能显示时，就冲突了

方法二：

 給下方元素包裹一个父元素，然后給父元素设置

 `::before { content: ""; display: table }`

原理：

 display: table，在子元素之前形成平级的 bfc 渲染区域，不允许子元素的 margin 进入 ::before 范围内

优点：

1. 即不隐藏内容
2. 又不添加新元素
3. 又不影响高度

### 2. 避免垂直方向 margin 溢出

**问题重现**：子元素设置 margin-top，会超出父元素上边的范围，变成父元素的 margin-top，而实际上，子元素与父元素之间，依然是没有 margin-top 的，效果不是想要的

**五种解决方法：**

1. 设置父元素 `overflow:hidden`

   - 原理：父元素想成 BFC，就必须包裹内层子元素的 margin
   - 缺点：有的子元素，希望在溢出父元素时进行展示，就无法实现了

2. 为父元素添加上边框，颜色设置为透明

   - 原理：这里不是 bfc，而是因为边框本身可以阻隔 margin 溢出
   - 缺点：边框会增大父元素的实际大小，导致布局错乱
   - 解决：可以设置父元素 `box-sizing: border-box`

3. 用父元素的 padding-top 代替第一个子元素的 margin-top
   - 原理：这里也不是 bfc。而是因为 padding 本身可以阻隔 margin 溢出
   - 缺点：对父元素高度有影响
   - 解决：可以设置父元素 `box-sizing: border-box`
4. 在父元素内第一个子元素之前添加一个空的 `<table></table>`
   - 原理：table 的 display 属性默认相当于 table，所以形成小的 bfc 渲染区域。其他元素的 margin 不能进入 table 范围内。就阻隔了 margin 向上溢出
   - 优点：空 table 元素没有大小，不占用父元素控件
   - 缺点：增加一个看不见的空元素，干扰查找元素
5. 最好的解决：`父元素::before { content: ''; display: table; }`
   - 优点：即不隐藏内容，又不添加新元素，又不影响高度

### 3. 左定宽，右自适应布局

第一步：左边定宽元素左浮动 `.left { float: left; width: 固定宽度 }`

第二步：右边元素不用右浮动，而是： `.right { overflow: hidden; }`

原理：右边元素 `overflow: hidden` 后，形成 `BFC` 渲染区域。左边的 float 元素就不能进入右边范围了

```html
<div class="l">l</div>
<div class="r"></div>
.l { float: left; width: 200px; background-color: gray; height: 100vh; } .r { background-color: #ccc; height: 100vh; overflow: hidden; }
```

### 4. 父元素高度坍塌

# 二、渐进增强和优雅降级

## 2.1 什么是渐进增强和优雅降级？

渐进增强，英语全称 `progressive enhancement`，指的是针对低版本浏览器进行构建页面，保证最基本的功能，然后再针对高级浏览器进行效果、交互等改进和追加功能达到更好的用户体验。

优雅降级，英语全称`graceful degradation`，一开始就构建完整的功能，然后再针对低版本浏览器进行兼容。

这两个概念其实并不是一个新的概念，就是以前提到的“向上兼容”和“向下兼容”。渐进增强相当于向上兼容，优雅降级相当于向下兼容。

在确定用户群体的前提下，渐进增强：针对低版本浏览器进行页面构建，保证基本功能，再针对高级浏览器进行效果、交互等改进和追加功能，达到更好的用户体验。

优雅降级：一开始就构建完整的功能，再针对低版本浏览器进行兼容。

## 2.2 区别

优雅降级是从复杂的现状开始并视图减少用户体验的供给，而渐进增强则是从一个基础的、能够起到作用的版本开始再不断扩充，以适应未来环境的需要。

例如看下面这两段代码的书写顺序，看上去只是书写顺序的不同，实际则表示了我们开发的着重点：

```css
/* 渐进增强写法 */
.transition {
  -webkit-transition: all .5s;
     -moz-transition: all .5s;
       -o-transition: all .5s;
          transition: all .5s;
}
/*优雅降级写法*/
.transition {
          transition: all .5s;
       -o-transition: all .5s;
     -moz-transition: all .5s;
  -webkit-transition: all .5s;
}
```

前缀 *CSS3*（-webkit-、-moz-、-o-）和正常 *CSS3* 在浏览器中的支持情况是这样的：

1. **很久以前**：浏览器前缀 *CSS3* 和正常 *CSS3* 都不支持
2. **不久之前**：浏览器**只支持**前缀 *CSS3*，**不支持**正常 *CSS3*
3. **现在**：浏览器**既支持**前缀 *CSS3*，**又支持**正常 *CSS3*
4. **未来**：浏览器**不支持**前缀 *CSS3*，**仅支持**正常 *CSS3*

渐进增强的写法，优先考虑老版本浏览器的可用性，最后才考虑新版本的可用性。在时期 *3* 前缀 *CSS3* 和正常 *CSS3* 都可用的情况下，正常 *CSS3* 会覆盖前缀 *CSS3*。

优雅降级的写法，优先考虑新版本浏览器的可用性，最后才考虑老版本的可用性。在时期 *3* 前缀 *CSS3* 和正常 *CSS3* 都可用的情况下，前缀 *CSS3* 会覆盖正常的 *CSS3*。

绝大多少的大公司都是采用渐进增强的方式，因为业务优先，提升用户体验永远不会排在最前面。

\- 例如新浪微博网站这样亿级用户的网站，前端的更新绝不可能追求某个特效而不考虑低版本用户是否可用。一定是确保低版本到高版本的可访问性再渐进增强。

\- 如果开发的是一面面向青少面的软件或网站，你明确这个群体的人总是喜欢尝试新鲜事物，喜欢炫酷的特效，喜欢把软件更新至最新版本，这种情况再考虑优雅降级。

-*EOF*-

# 三、渐进式渲染

> **什么是渐进式渲染？**
>
> 渐进式渲染，英文全称 `progressive rendering`，也被称之为惰性渲染，指的是为了提高用户感知的加载速度，以尽快的速度来呈现页面的技术。但是这并不是某一项技术的特指，而是一系列技术的集合。
>
> 例如：****
>
> - 骨屏架
> - 图片懒加载
> - 图片占位符
> - 资源拆分

渐进式渲染，英文全称 `progressive rendering`，也被称之为惰性渲染，指的是为了提高用户感知的加载速度，以尽快的速度来呈现页面的技术。

在以前互联网带宽较小的时期，这种技术更为普遍。如今，移动终端的盛行，而移动网络往往不稳定，渐进式渲染在现代前端开发中仍然有用武之地。

有一点需要弄明白的是，这不是指的某一项技术，而是各种技术的一种集合。

例如：

* 骨屏架

  在加载网络数据时，为了提升用户体验，通常会使用一个转圈圈的`loading`动画，或者使用`Skeleton Screen`占位。相比`loading`动画`Skeleton Screen`的效果要更生动

  <img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-09-13-081721.png" alt="image-20210913161720022" style="zoom:50%;" />

* 图片懒加载

  所谓图片懒加载，顾名思义，就是先加载部分图片，剩余的图片等到需要的时候再加载。这在电商网站中尤其常见。

  比如一个电商网站，首屏通常会有很多的数据，清晰度较高的`banner`或轮播。页面非首屏部分会员很多商品夹杂着大量的图片。这是时候选择懒加载以保证首屏的流畅十分重要。

* 图片占位符

  在网页加载的时候，某些图片还在请求中或者还未请求，这个时候就先找一个临时代替的图像，放在最终图像的位置上，但是这只是临时替代的图形，当图片数据准备好后，会重新渲染真正的图形数据。

  ```html
  <img src="data/img/placeholder.png" data-src="data/img/SLUG.jpg" alt="NAME" />
  ```

  这些图片会在网站构建完 HTML 主体框架之后通过 JavaScript 进行加载。图片占位符被缩放到和真正的图片一样大小，所以它会占据同样的空间，在真正的图片完成加载后，也不会导致页面重绘。

  `app.js` 这个文件处理 `data-src` 属性的过程如下所示：

  ```js
  let imagesToLoad = document.querySelectorAll("img[data-src]");
  const loadImages = (image) => {
    image.setAttribute("src", image.getAttribute("data-src"));
    image.onload = () => {
      image.removeAttribute("data-src");
    };
  };
  ```

  当函数 `loadImages` 把图片地址从 `data-src` 移动到 `src` 上时，`imagesToLoad` 变量包含了所有图片的链接。当每个图片都已经加载完成时，我们会把 `data-src` 属性移除掉，因为它已经没有任何用处了。我们遍历所有的图片，然后加载它们：

  ```js
  imagesToLoad.forEach((img) => {
    loadImages(img);
  });
  ```

* [用 CSS 制造模糊效果](https://developer.mozilla.org/zh-CN/docs/Web/Progressive_web_apps/Tutorials/js13kGames/Loading#用_css_制造模糊效果)

  ```css
  article img[data-src] {
    filter: blur(0.2em);
  }
  
  article img {
    filter: blur(0em);
    transition: filter 0.5s;
  }
  ```

* 按需加载

  [交叉观察期API](https://developer.mozilla.org/zh-CN/docs/Web/API/Intersection_Observer_API)

  ```js
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((items, observer) => {
      items.forEach((item) => {
        if (item.isIntersecting) {
          loadImages(item.target);
          observer.unobserve(item.target);
        }
      });
    });
    imagesToLoad.forEach((img) => {
      observer.observe(img);
    });
  } else {
    imagesToLoad.forEach((img) => {
      loadImages(img);
    });
  }
  ```

  

* 拆分网页资源

  大部分用户不会用到一个网站的所有页面，但我们通常的做法却是把所有的功能打包进一个很大的文件里面。一个`bundle.js`文件的大小可能会有几`M`，一个打包后的`style.css`会包含网站的一切样式，从`CSS`结构定义到网站在各个版本的样式：移动端、平板、桌面、打印版等等。

  但用户并不是一开始就需要所有的资源，所以我们可以对资源进行拆分，首先加载那些关键的资源，其他的资源等到需要的时候再去加载它。

更多的关于渐进式渲染的内容，可以参阅 *MDN*：*https://developer.mozilla.org/zh-CN/docs/Web/Progressive_web_apps/Loading*

-*EOF*-

# 四、渲染性能优化

> **总结一下如何提升或者优化 `CSS` 的渲染性能？
>
> CSS 渲染性能的优化来自方方面面，这里列举一些常见的方式：
>
> 1. 使用`id`选择器非常高效，因为`id`是唯一的
>
> 2. 避免深层次的选择器嵌套
>
> 3. 尽量避免使用属性选择器，因为匹配速度慢
>
> 4. 使用渐进增强的方案
>
>    通常将浏览器前缀置于前面，将标准样式属性置于最后，类似：
>
>    ```css
>    .foo {
>      -moz-border-radius: 5px;
>      border-radius: 5px;
>    }
>    ```
>
> 5. 遵守`CSSLint`规则
>
>    ```css
>    font-faces     　　　  　　不能使用超过5个web字体
>    import     　　　　　　 　　  禁止使用*@import*
>    regex-selectors     　　　  禁止使用属性选择器中的正则表达式选择器
>    universal-selector   　 　　  禁止使用通用选择器*
>    unqualified-attributes   　　禁止使用不规范的属性选择器
>    zero-units       　 　　　0后面不要加单位
>    overqualified-elements   　　使用相邻选择器时，不要使用不必要的选择器
>    shorthand     　　　　　　　 简写样式属性
>    duplicate-background-images   相同的url在样式表中不超过一次
>    ```
>
> 6. 不要使用`@import`
>
>    使用 `@import` 引入 `CSS` 会影响浏览器的并行下载。使用 `@import` 引用的 `CSS` 文件只有在引用它的那个 `CSS` 文件被下载、解析之后，浏览器才会知道还有另外一个 `CSS` 需要下载，这时才去下载，然后下载后开始解析、构建 `Render Tree` 等一系列操作。
>
>    多个 `@import` 会导致下载顺序紊乱。在 `IE` 中，`@import` 会引发资源文件的下载顺序被打乱，即排列在 `@import` 后面的 `JS` 文件先于 `@import` 下载，并且打乱甚至破坏 `@import` 自身的并行下载。
>
> 7. 避免过分重排（`Reflow`）
>
>    所谓重排就是浏览器重新计算布局位置与大小。常见的重排元素：
>
>    ```css
>    width 
>    height 
>    padding 
>    margin 
>    display 
>    border-width 
>    border 
>    top 
>    position 
>    font-size 
>    float 
>    text-align 
>    overflow-y 
>    font-weight 
>    overflow 
>    left 
>    font-family 
>    line-height 
>    vertical-align 
>    right 
>    clear 
>    white-space 
>    bottom 
>    min-height
>    ```
>
> 8. 依赖继承
>
>    如果某些属性可以继承，那么自然没有必要在写一遍。
>
> 9. 值缩写
>
> 10. 避免耗性能的属性
>
> 11. 背景图优化合并
>
> 12. 文件压缩

参考：[20个CSS性能优化技巧，每个前端都需要知道](https://juejin.cn/post/7263110473942777911#heading-22)

## 1. 加载性能优化

1. 采取公共的CSS文件

   如果使用 `webpack` 进行项目打包，在打包阶段可以使用`mini-css-extract-plugin`提取公共CSS文件，便于缓存以及减少css请求次数。

2. 避免使用 @import

   * 使用 @import 会阻塞浏览器的并行下载，导致加载速度变慢
   * 

## 2.选择器性能优化

## 3.属性性能优化

## 4.动画性能优化
