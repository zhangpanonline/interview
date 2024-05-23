# 一、浏览器缓存

- 什么是浏览器缓存
- 按照缓存位置分类
  - Service Worker
  - Memory Cache
  - Disk Cacahe
  - Push Cache
- 按照缓存类型分类
  - 强制缓存
  - 协商缓存
- 缓存读取规则
- 浏览器行为
- 实操案例
- 缓存的最佳实践

## 1. 什么是浏览器缓存

_web_ 应用的流程：

![image-20211203143550954](https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-12-03-063551.png)

上图展示了一个 _web_ 应用最最简单的结构。客户端向服务器端发送 _HTTP_ 请求，服务器从数据库获取数据，然后进行计算处理，之后向客户端返回 _HTTP_ 响应。

那么上面整个流程中，哪些地方比较耗费时间呢？总结起来有以下两个方面：

- 发送请求的时候：

  这里所说的请求，不仅仅是 _HTTP_ 请求，也包括服务器向数据库发起查询数据的请求。

- 涉及到大量计算的时候：

  一般涉及到大量计算，主要是在服务器端和数据库端，服务器端要进行计算这个很好理解，数据库要根据服务器发送过来的查询命令查询到对应的数据，这也是比较耗时的一项工作。

因此，单论缓存的话，我们其实在很多地方都可以做缓存。例如：

- 数据库缓存
- _CDN_ 缓存
- 代理服务器缓存
- 浏览器缓存
- 应用层缓存

针对各个地方做出适当的缓存，都能够很大程度的优化整个 _Web_ 应用的性能。这里只说和前端相关的浏览器缓存。

整个浏览器的缓存过程如下：

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-12-03-063613.png" alt="image-20211203143612695" style="zoom:50%;" />

从上图我们可以看到，整个浏览器的缓存其实没有想象的那么复杂。其最基本的原理就是：

- 浏览器每次发起请求，都会先在浏览器缓存中查找该请求的结果以及缓存标识
- 浏览器每次拿到返回的请求结果都会将该结果和缓存标识存入浏览器缓存中

以上两点结论就是浏览器缓存机制的关键，它确保了每个请求的缓存存入与读取，只要我们再理解浏览器缓存的使用规则，那么所有的问题就迎刃而解了。

## 2. 按照缓存位置分类

从缓存位置来说分为四种，并且各自有优先级，当依次查找缓存且都没有命中的时候，才会去请求网络。

- _Service Worker_
- _Memory Cache_
- _Disk Cache_
- _Push Cache_

### Service Worker

`Servcie Worker` 一个服务器与浏览器之间的中间人角色，如果网站中注册了`Service Worker`那么它可以拦截当前网站所有的请求，进行判断（需要编写相应的判断程序），如果需要向服务器发起请求的就转给服务器，如果可以直接使用缓存的就直接返回缓存不再转给服务器。从而大大提高浏览体验。

使用 `Service Worker` 的话，传输协议必须为 _HTTPS_。因为 `Service Worker` 中涉及到请求拦截，所以必须使用 `HTTP` 协议来保障安全。

`Service Worker` 的缓存与浏览器其他内建的缓存机制不同，它可以让我们自由控制缓存哪些文件、如何匹配缓存、如何读取缓存，并且缓存是持续性的。

`Service Worker` 实现缓存功能一般分为三个步骤：

1. 首先需要先注册 `Service Worker`

   ```js
   /* 判断当前浏览器是否支持serviceWorker */
       if ('serviceWorker' in navigator) {
           /* 当页面加载完成就创建一个serviceWorker */
           window.addEventListener('load', function () {
               /* 创建并指定对应的执行内容 */
               /* scope 参数是可选的，可以用来指定你想让 service worker 控制的内容的子目录。 在这个例子里，我们指定了 '/'，表示 根网域下的所有内容。这也是默认值。 */
               navigator.serviceWorker.register('./serviceWorker.js', {scope: './'})
                   .then(function (registration) {
                       console.log('ServiceWorker registration successful with scope: ', registration.scope);
                   	document.querySelector("#status").textContent = "succeeded";
                   })
                   .catch(function (err) {
                       console.log('ServiceWorker registration failed: ', err);
                   	document.querySelector("#status").textContent = error;
                   });
           });
       }
   	// 当状态为activated 时， ServiceWorkerContainer 接口的只读属性 controller 返回一个 ServiceWorker 对象（与 ServiceWorkerRegistration.active 返回的对象是同一个）
   	//当页面强制刷新 (Shift + refresh) 或不存在 active worder 时，该属性返回 null 。
       if (navigator.serviceWorker.controller) {
           console.log(
             "This page is currently controlled by:",
             navigator.serviceWorker.controller,
           );
       }

         // Then, register a handler to detect when a new or
         // updated service worker takes control.
         navigator.serviceWorker.oncontrollerchange = () => {
           console.log("This page is now controlled by",navigator.serviceWorker.controller);
         };
       } else {
         console.log("Service workers are not supported.");
       }
   ```

2. 然后监听到 `install` 事件以后就可以缓存需要的文件

   ```js
   /* ./serviceWorker.js */
   /* 监听安装事件，install 事件一般是被用来设置你的浏览器的离线缓存逻辑 */
   this.addEventListener("install", function (event) {
     /* 通过这个方法可以防止缓存未完成，就关闭serviceWorker */
     event.waitUntil(
       /* 创建一个名叫V1的缓存版本 */
       caches.open("v1").then(function (cache) {
         /* 指定要缓存的内容，地址为相对于跟域名的访问路径 */
         return cache.addAll(["./index.html"]);
       })
     );
   });
   ```

3. 那么在下次用户访问的时候就可以通过拦截请求的方式查询是否存在缓存，存在缓存的话就可以直接读取缓存文件，否则就去数据。

   ```js
   /* ./serviceWorker.js */
   /* 注册fetch事件，拦截全站的请求 */
   this.addEventListener("fetch", function (event) {
     event.respondWith(
       // magic goes here
       /* 在缓存中匹配对应请求资源直接返回 */
       caches.match(event.request)
     );
   });
   ```

当`Service Worker` 没有命中缓存的时候，我们需要去调用 _fetch_ 函数获取数据。也就是说，如果我们没有在 `Service Worker` 命中缓存的话，会根据查找优先级去查找数据。

![image-20211203143635717](https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-12-03-063636.png)

但是不管我们是从 `Memory Cache` 中还是从网络请求中获取的数据，浏览器都会显示我们是从 Service Worker 中获取的内容。

### Memory Cache

`Memory Cache` 也就是内存中的缓存，主要包含的是当前页面中已经抓取到的资源，例如页面上已经下载的样式、脚本、图片等。

读取内存中的数据肯定比磁盘快，内存缓存虽然读取高效，可是缓存持续性很短，会随着进程的释放而释放。一旦我们关闭 `Tab` 页面，内存中的缓存也就被释放了。

那么既然内存缓存这么高效，我们是不是能让数据都存放在内存中呢？

这是不可能的。计算机中的内存一定比硬盘容量小的多，操作系统需要精打细算内存的使用，所以能让我们使用的内存必然不多。

当我们访问过页面以后，再次刷新页面，可以发现很多数据都来自于内存缓存。

![image-20211203143700033](https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-12-03-063700.png)

`Memory Cache` 机制保证了一个页面中如果有两个相同的请求。

例如两个 `src` 相同的 `<img>`，两个`href`相同的`<link>`，都实际只会被请求最多一次，避免浪费。

### Disk Cache

`Disk Cache` 也就是存储在硬盘中的缓存，读取速度慢点，但是什么都能存储到磁盘中，比之 `Memory Cache` 胜在容量和存储时效性上。

在所有浏览器缓存中，`Disk Cache` 覆盖面基本是最大的。它会根据 `HTTP Herder` 中的字段判断哪些资源需要缓存，哪些资源可以不请求直接使用，哪些资源已经过期需要重新请求。

并且即时在跨站点的情况下，相同地址的资源一旦被硬盘缓存下来，就不会再去请求数据，绝大部分的缓存都来自 `Disk Cache`。

凡是持久性存储都会面临容量增长的问题，`Disk Cache` 也不例外。

在浏览器自动清理时，会有特殊的算法去把“最老的”或者“最有可能过时”的资源删除，因此是一个一个删除的。不过每个浏览器识别要删除哪些资源的算法不同，这也可以看做是各个浏览器差异性的体现。

### Push Cache

`Push Cache` 翻译成中文叫做“推送缓存”，是属于 `HTTP/2` 中新增的内容。

当以上三种缓存都没有命中时，它才会被使用，它只在会话（`Session`）中存在，一旦会话结束就被释放，并且缓存时间也很短暂，在`Chrome`浏览器中只有`5`分钟左右，同时它也并非严格执行`HTTP/2`头中的缓存指令。

这里推荐阅读 _Jake Archibald_ 的 [_HTTP/2 push is tougher than I thought_](*https://jakearchibald.com/2017/h2-push-tougher-than-i-thought/*) 这篇文章。

文章中的几个结论：

- 所有的资源都能被推送，并且能够被缓存，但是 `Edge` 和 `Safari` 浏览器支持相对比较差
- 可以推送 `no-cache` 和 `no-store` 的资源
- 一旦连接被关闭，`Push Cache` 就被释放
- 多个页面可以使用同一个 _HTTP/2_ 的连接，也就可以使用同一个 `Push Cache`，这主要还是依赖浏览器的实现而定，对于性能的考虑，有的浏览器会对相同域名但不同的 `tab` 标签使用同一个 `HTTP` 连接。
- `Push Cache` 中的缓存只能被使用一次
- 浏览器可以拒绝接受已经存在的资源推送
- 你可以给其他域名推送资源

---

如果一个请求在上述几个位置都没有找到缓存，那么浏览器会正式发送网络请求去获取内容。为了提升之后请求的缓存命中率，自然要把这个资源添加到缓存中去。

具体来说：

- 根据`Service Worker`中的`handler`决定是否存入`Cache Storage`（额外的缓存位置）。`Service Worker` 是由开发者编写的额外的脚本，且缓存位置独立，出现也较晚，使用还不算太广泛。
- `Memory Cache` 保存一份资源的引用，以备下次使用。`Memory Cache` 是浏览器为了加快读取缓存速度而进行的自身的优化行为，不受开发者控制，也不受`HTTP`协议头的约束，算是一个黑盒。
- 根据`HTTP`头部的相关字段（`Cache-control、Prama`等）决定是否存入`Disk Cache`。`Disk Cache`也是平时我们最熟悉的一种缓存机制，也叫`HTTP Cache`（因为不像`Memory Cache`，它遵守`HTTP`协议头中的字段）。平时所说的强制缓存，协商缓存，以及`Cache-Control`等，也都归于此类。

## 3. 按照缓存类型分类

按照缓存类型来进行分类，可以分为**强制缓存**和**协商缓存**。需要注意的是，无论是强制缓存还是协商缓存，都是属于`Disk Cache`或者叫做`HTTP Cache`里面的一种。

### 强制缓存

强制缓存的含义是，当客户端请求后，会先访问缓存数据库看缓存是否存在。如果存在则直接返回；不存在则请求服务器，响应后再写入缓存数据库。

强制缓存直接减少请求数，是提升最大的缓存策略。如果考虑使用缓存来优化网页性能的话，强制缓存应该是首先被考虑的。

可以造成强制缓存的字段是`Cache-Control`和`Expires`。

#### Expires

这是`HTTP 1.0` 的字段，表示缓存到期时间，是一个绝对的时间（当前时间 + 缓存时间），如：

```http
Expires: Thu, 10 Nov 2017 08:45:11 GMT
```

在响应消息头中，设置这个字段之后，就可以告诉浏览器，在未过期之前不需要再次请求。

但是，这个字段设置时有两个缺点：

- 由于是绝对时间，用户可能会将客户端本地的时间进行修改，而导致浏览器判断缓存失效，重新请求该资源。此外，即时不考虑自行修改的因素，时差或者误差等因素也可能造成客户端与服务端的时间不一致，致使缓存失效。
- 写法太复杂了。表示时间的字符串多个空格，少个字母，都会导致变为非法属性从而设置失效。

#### Cache-control

已知`Expires`的缺点之后，在`HTTP/1.1`中，增加了一个字段`Cache-control`，该字段表示资源缓存的最大有效时间，在该时间内，客户端不需要向服务器发送请求。

这两者的区别就是前者是绝对时间，而后者是相对时间。如下：

```http
Cache-control: max-age=2592000
```

下面列举一些`Cache-control`字段常用的值：

- `max-age`：即最大有效时间，在上面的例子中我们可以看到；
- `must-revalidate`：如果超过了`max-age`的时间，浏览器必须向服务器发送请求，验证资源是否还有效；
- `no-cache`：虽然字面意思是“不要缓存”，但实际上还是要求客户端缓存内容的，只是是否使用这个内容由后续的协商缓存来决定；
- `no-store`：真正意义上的“不要缓存”。所有内容都不走缓存，包括强制缓存和协商缓存。
- `public`：所有的内容都可以被缓存（包括客户端和代理服务器，如`CDN`）；
- `private`：所有内容只有客户端才可以缓存，代理服务器不能缓存。**默认值**；

这些值可以混合使用，例如：`Cache-control:public, max-age=2592000`。在混合使用时，他们的优先级如下图：

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-12-03-063734.png" alt="image-20211203143733448" style="zoom:50%;" />

> `max-age=0`和`no-cache`等价吗？
>
> 从规范的字面意思来说，`max-age`到期是应该重新验证，而`no-cache`是必须重新验证。但实际情况以浏览器实现为准，大部分情况他们俩的行为还是一致的。如果是`max-age=0, must-revalidate`就和`no-cache`等价了。

总结一下，自从`HTTP/1.1`开始，`Expires`逐渐被`Cache-control`取代。

`Cache-control`是一个相对时间，即使客户端时间发生改变，相对时间也不会随之改变，这样可以保持服务器和客户端的时间一致性。而且`Cache-control`的可配置型比较强大。`Cache-control`的优先级高于`Expires`。

为了兼容`HTTP/1.0`和`HTTP/1.1`，实际项目中两个字段我们都会设置。

### 协商缓存

当强制缓存失效时，就需要使用协商缓存，由服务器决定缓存内容是否失效。

流程上说，浏览器先请求缓存数据库，返回一个缓存标识。之后浏览器拿这个标识和服务器通讯。如果缓存未失效，则返回`HTTP`状态码`304`标识继续使用，于是客户端继续使用缓存；

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-12-03-063801.png" alt="image-20211203143800447" style="zoom:50%;" />

如果失效，则返回新的数据和缓存规则，浏览器响应数据后，再把规则写入到缓存数据库。

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-12-03-063821.png" alt="image-20211203143820739" style="zoom:50%;" />

协商缓存在请求数上和没有缓存是一致的，但如果是`304`的话，返回的仅仅是一个状态码而已，并没有实际的文件内容。

它的优化主要体现在“响应”上面通过减少响应体体积，来缩短网络传输时间。所以和强制缓存相比提升幅度较小，但总比没有缓存好。

协商缓存是可以和强制缓存一起使用的，作为在强制缓存失效后的一种后备方案。实际项目中他们也的确经常一同出现。

协商缓存有`2`组字段：

- `Last-Modified & If-Modified-Since`
- `Etag & If-None-Match`

#### Last-Modified & If-Modified-Since

1. 服务器通过`Last-Modified`字段告知客户端，资源最后一次被修改的时间，例如：

   ```http
   Last-Modified：Mon, 10 Nov 2018 08:10:11 GMT
   ```

2. 浏览器将这个值和内容一起记录在缓存数据库中；

3. 下一次请求相同资源时，浏览器从自己的缓存中找出“不确定是否过期的”缓存。因此在请求头中将上次的`Last-Modified`的值写入到请求头的`If-Modified-Since`字段；

4. 服务器会将`If-Modified-Since`的值与`Last-Modified`字段进行对比。如果相等，则表示未修改，响应`304`；反之，则表示修改了，响应`200`状态码，并返回数据。

但是他还是有一定缺陷的：

- 如果资源更新的速度是秒以下单位，那么该缓存是不能被使用的，因为它的时间单位最低是秒；
- 如果文件是通过服务器动态生成的，那么该方法的更新时间永远是生成的时间，尽管文件可能没有变化，所以起不到缓存的作用。

因此在`HTTP/1.1`出现了`ETag`和`If-None-Match`。

#### Etag & If-None-Match

为了解决上述问题，出现了一组新人字段`Etag`和`If-None-Match`。

`Etag`存储的是文件的特殊标识（一般都是一个`Hash`值），服务器存储着文件的`Etag`字段。

之后的流程和`Last-Modified`一致，只是`Last-Modified`字段和它所表示的更新时间改变成了`Etag`字段和它所表示的文件`hash`，把`If-Modified-Since`变成了`If-None-Match`。

浏览器在下一次加载资源向服务器发送请求时，会将上一次返回的 Etag 值放到请求头里的 _If-None-Match_ 里，服务器只需要比较客户端传来的 _If-None-Match_ 跟自己服务器上该资源的 _ETag_ 是否一致，就能很好地判断资源相对客户端而言是否被修改过了。

如果服务器发现 _ETag_ 匹配不上，那么直接以常规 _GET 200_ 回包形式将新的资源（当然也包括了新的 _ETag_）发给客户端；如果 _ETag_ 是一致的，则直接返回 _304_ 告诉客户端直接使用本地缓存即可。

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-12-03-063851.png" alt="image-20211203143850009" style="zoom:50%;" />

两者之间的简单对比：

- 首先在精确度上，_Etag_ 要优于 _Last-Modified_。

  _Last-Modified_ 的时间单位是秒，如果某个文件在 _1_ 秒内改变了多次，那么 _Last-Modified_ 其实并没有体现出来修改，但是 _Etag_ 是一个 _Hash_ 值，每次都会改变从而确保了精度。

- 第二在性能上，_Etag_ 要逊于 _Last-Modified_，毕竟 _Last-Modified_ 只需要记录时间，而 _Etag_ 需要服务器通过算法来计算出一个 _Hash_ 值。

- 第三在优先级上，服务器校验优先考虑 _Etag_，也就是说 _Etag_ 的优先级高于 _Last-Modified_。

## 4. 缓存读取规则总结

接下来我们来对上面所讲的缓存做一个总结。

当浏览器要请求资源时：

1. 从`Servie Workder`中获取内容（如果设置了`Service Worker`）
2. 查看`Memory Cache`
3. 查看`Disk Cache`。这里又细分：
   - 如果有强制缓存且未失效，则使用强制缓存，不请求服务器。这时的状态码全是`200`
   - 如果强制缓存失效，使用协商缓存，比较后确定`304`还是`200`
4. 发送网络请求，等待网络响应
5. 把响应内容存入`Disk Cache`（如果`HTTP`响应头信息有相应配置的话）
6. 把响应内容的引用存入`Memory Cache`（无视`HTTP`头信息的配置）
7. 把响应内容存入`Service Worker`的`Cache Storage`（如果设置了`Service Worker`）

其中针对第`3`步，具体的流程图如下：

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-12-03-063919.png" alt="image-20211203143918845" style="zoom:50%;" />

## 5. 浏览器行为

在了解了整个缓存策略或者说缓存读取流程后，我们还需要了解一个东西，那就是用户对浏览器的不同操作，会触发不同的缓存读取策略。

对应主要有`3`种不同的浏览器行为：

- 打开网页，地址栏输入地址：查找 _Disk Cache_ 中是否有匹配。如有则使用；如没有则发送网络请求。

- 普通刷新 (F5)：因为 TAB 并没有关闭，因此 _Memory Cache_ 是可用的，会被优先使用(如果匹配的话)。其次才是 _Disk Cache_。

- 强制刷新 ( _Ctrl + F5_ )：浏览器不使用缓存，因此发送的请求头部均带有 _Cache-control: no-cache_（为了兼容，还带了 _Pragma: no-cache_ ）。服务器直接返回 _200_ 和最新内容。

## 6. 实操案例

实践才是检验真理的唯一标准。上面已经将理论部分讲解完毕了，接下来我们就来用实际代码验证一下上面所讲的验证规则。

下面是使用`Node.js`搭建的服务器：

```js
const http = require("http");
const path = require("path");
const fs = require("fs");

var hashStr = "A hash string.";
var hash = require("crypto").createHash("sha1").update(hashStr).digest("base64");

http
  .createServer(function (req, res) {
    const url = req.url; // 获取到请求的路径
    let fullPath; // 用于拼接完整的路径
    if (req.headers["if-none-match"] == hash) {
      res.writeHead(304);
      res.end();
      return;
    }
    if (url === "/") {
      // 代表请求的是主页
      fullPath = path.join(__dirname, "static/html") + "/index.html";
    } else {
      fullPath = path.join(__dirname, "static", url);
      res.writeHead(200, {
        "Cache-Control": "max-age=5",
        Etag: hash,
      });
    }
    // 根据完整的路径 使用fs模块来进行文件内容的读取 读取内容后将内容返回
    fs.readFile(fullPath, function (err, data) {
      if (err) {
        res.end(err.message);
      } else {
        // 读取文件成功，返回读取的内容，让浏览器进行解析
        res.end(data);
      }
    });
  })
  .listen(3000, function () {
    console.log("服务器已启动，监听 3000 端口...");
  });
```

在上面的代码中，我们使用 _Node.js_ 创建了一个服务器，根据请求头的 _if-none-match_ 字段接收从客户端传递过来的 _Etag_ 值，如果和当前的 _Hash_ 值相同，则返回 _304_ 的状态码。

在资源方面，我们除了主页没有设置缓存，其他静态资源我们设置了 _5_ 秒的缓存，并且设置了 _Etag_ 值。

> 注：上面的代码只是服务器部分代码，完整代码请参阅本章节所对应的代码。

效果如下：

![2021-12-03 14.02.26](https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-12-03-063950.gif)

可以看到，第一次请求时因为没有缓存，所以全部都是从服务器上面获取资源，之后我们刷新页面，是从 _memory cache_ 中获取的资源，但是由于我们的强缓存只设置了 _5_ 秒，所以之后再次刷新页面，走的就是协商缓存，返回 _304_ 状态码。

但是在这个示例中，如果我们修改了服务器的静态资源，客户端是没办法实时的更新的，因为静态资源是直接返回的文件，只要静态资源的文件名没变，即使该资源的内容已经发生了变化，服务器也会认为资源没有变化。

那怎么解决呢？

解决办法也就是我们在做静态资源构建时，在打包完成的静态资源文件名上根据它内容 _Hash_ 值添加上一串 _Hash_ 码，这样在 _CSS_ 或者 _JS_ 文件内容没有变化时，生成的文件名也就没有变化，反映到页面上的话就是 _url_ 没有变化。

如果你的文件内容有变化，那么对应生成的文件名后面的 _Hash_ 值也会发生变化，那么嵌入到页面的文件 _url_ 也就会发生变化，从而可以达到一个更新缓存的目的。这也是为什么在使用 _webpack_ 等一些打包工具时，打包后的文件名后面会添加上一串 _Hash_ 码的原因。

目前来讲，这在前端开发中比较常见的一个静态资源缓存方案。

## 7. 缓存的最佳实践

### 频繁变动的资源

```http
Cache-Control: no-cache
```

频繁变动的资源，首先需要使用 _Cache-Control: no-cache_ 使浏览器每次都请求服务器，然后配合 _ETag_ 或者 _Last-Modified_ 来验证资源是否有效。

这样的做法虽然不能节省请求数量，但是能显著减少响应数据大小。

**### 不常变化的资源**

```http
Cache-Control: max-age=31536000
```

通常在处理这类资源时，给它们的 _Cache-Control_ 配置一个很大的 _max-age=31536000_ (一年)，这样浏览器之后请求相同的 _URL_ 会命中强制缓存。

而为了解决更新的问题，就需要在文件名（或者路径）中添加 _Hash_， 版本号等动态字符，之后更改动态字符，从而达到更改引用 _URL_ 的目的，让之前的强制缓存失效 (其实并未立即失效，只是不再使用了而已)。

在线提供的类库（如 _jquery-3.3.1.min.js、lodash.min.js_ 等）均采用这个模式。

-_EOF_-

# 二、WebSocket

## INTERVIEW

1. webSocket 协议是什么，能简述一下吗？

   > websocket 协议 HTML5 带来的新协议，相对于 http，它是一个持久连接的协议，它利用 http 协议完成握手，然后通过 TCP 连接通道发送消息，使用 websocket 协议可以实现服务器主动推送消息。
   >
   > 首先，客户端若要发起 websocket 连接，必须向服务器发送 http 请求以完成握手，请求行中的 path 需要使用 `ws:` 开头的地址，请求头中要分别加入 `upgrade、connection、Sec-WebSocket-Key、Sec-WebSocket-Version` 标记；
   >
   > 然后，服务器收到请求后，发现这是一个 websocket 协议的握手请求，于是响应行中包含 `101 Switching Protocols`，表示同意更换后续协议，同时响应头中包含`upgrade、connection、Sec-WebSocket-Accept`标记；
   >
   > 最后，当客户端收到响应后即可完成握手，随后使用建立的 TCP 连接直接发送和接收消息。

2. webSocket 与传统的 http 有什么优势

   > 当页面中需要观察实时数据的变化（比如聊天、k 线图）时，过去我们往往使用两种方式完成：
   >
   > 第一种是短轮询，即客户端每隔一段时间就向服务器发送消息，询问有没有新的数据；
   >
   > 第二种是长轮询，发起一次请求询问服务器，服务器可以将该请求挂起，等到有新消息时再进行响应。响应后，客户端立即又发起一次请求，重复整个流程。
   >
   > 无论是哪一种方式，都暴露了 http 协议的弱点，即响应必须在请求之后发生，服务器是被动的，无法主动推送消息。而让客户端不断的发起请求又白白的占用了资源。
   >
   > websocket 的出现就是为了解决这个问题，它利用 http 协议完成握手之后，就可以与服务器建立持久的连接，服务器可以在任何需要的时候，主动推送消息给客户端，这样占用的资源最少，同时实时性也最高。

3. 前端如何实现即时通讯？

   > 1. 短轮询。即客户端每隔一段时间就向服务器发送消息，询问有没有新的数据；
   >
   > 2. 长轮询，发起一次请求询问服务器，服务器可以将该请求挂起，等到有新消息时再进行响应。响应后，客户端立即又发起一次请求，重复整个流程；
   > 3. websocket，握手完毕后会建立持久性的连接通道，随后服务器可以在任何时候推送新消息给客户端。

[WebSocket协议（rfc6455）原文地址](https://datatracker.ietf.org/doc/html/rfc6455)

WebSocket 协议在 2008 年诞生，2011 年成为国际标准。所有浏览器都已经支持了。

它的最大特点就是，服务器可以主动向客户端推送信息，客户端也可以主动向服务器发送信息，是真正的双向平等对话，属于服务器推送技术的一种。

## 1. 原理

伴随着HTML5出现的WebSocket，从***\*协议\****上赋予了服务器主动推送消息的能力

<img src="http://mdrs.yuanjin.tech/img/20211028171840.png" alt="image-20211028171840145" style="zoom:50%;" align="left" />

从上图可以看出：

- WebSocket 也是建立在 TCP 协议之上的，利用的是 TCP 全双工通信的能力
- 使用 WebSocket，会经历两个阶段：握手阶段、通信阶段

虽然优于轮询方案，但 WebSocket 仍然是有缺点的：

- 兼容性

  WebSocket 是 HTML5 新增的内容，因此古董版本的浏览器并不支持

- 维持 TCP 连接需要耗费资源

  对于那些消息量少的场景，维持TCP连接确实会造成资源的浪费

  > 为了充分利用TCP连接的资源，在使用了 WebSocket 的页面，可以放弃 ajax，都用 WebSocket 进行通信，当然这会带来程序设计上的一些问题，需要权衡

### 握手

> WebSocket 协议是一个高扩展性的协议，详细内容会比较复杂，这里仅讲解面试中会问到的握手协议

当客户端需要和服务器使用 WebSocket 进行通信时，首先会使用 **HTTP协议** 完成一次特殊的请求-响应，这一次请求-响应就是**WebSocket**握手。

在握手阶段，首先由客户端向服务器发送一个请求，请求地址格式如下：

```shell
# 使用HTTP
ws://mysite.com/path
# 使用HTTPS
wss://mysite.com/path
```

请求头如下：

```css
Connection: Upgrade /* 嘿，后续咱们别用HTTP了，升级吧 */
Upgrade: websocket /* 我们把后续的协议升级为websocket */
Sec-WebSocket-Version: 13 /* websocket协议版本就用13好吗？ */
Sec-WebSocket-Key: YWJzZmFkZmFzZmRhYw== /* 暗号：天王盖地虎 */
```

服务器如果同意，就应该响应下面的信息：

```css
HTTP/1.1 101 Switching Protocols /* 换，马上换协议 */
Connection: Upgrade /* 协议升级了 */
Upgrade: websocket /* 升级到websocket */
Sec-WebSocket-Accept: ZzIzMzQ1Z2V3NDUyMzIzNGVy /* 暗号：小鸡炖蘑菇 */
```

**握手完成，后续消息收发不再使用HTTP，任何一方都可以主动发消息给对方

## 2. API

```javascript
const ws = new WebSocket('ws://localhost:9527')
ws.onopen = function() {
  console.log('连接到服务器了')
}
ws.onmessage = function(e) {
  console.log(`接收到服务器消息：${e.data}`)
}
ws.onclose = function() {
  console.log("连接关闭")
}
// 发送消息
ws.send('hehe')
// 关闭连接
ws.close()
// 连接状态：0-正在连接中  1-已连接  2-正在关闭  3-已关闭
ws.readyState
```



## 3. 应用

### 1. 跨标签页通信

```javascript
// server.js
// 首先获取到一个 WebSocketServer 类
var WebSocketServer = require('ws').Server

// 创建 WebSocket 服务器
var wss = new WebSocketServer({
  port: 3000
})

// 该数组用于保存所有的客户端连接实例
var clients = []

// 当客户端连接上 WebSocket 服务器的时候
// 就会触发 connection 事件，该客户端的实例就会传入此回调函数
wss.on('connection', function (client) {
  // 将当前客户端连接实例保存到数组里面
  clients.push(client)
  console.log(`当前有${clients.length}个客户端在线...`)

  // 给传入进来的客户端连接实例绑定一个 message 事件
  client.on('message', function (msg) {
    console.log('收到的消息为：' + msg)
    // 接下来需要将接收到的消息推送给其他所有的客户端
    for (var c of clients) {
      if (c !== client) {
        c.send(msg.toString())
      }
    }
  })

  client.on('close', function () {
    var ind = clients.indexOf(this)
    clients.splice(ind, 1)
    console.log(`当前有${clients.length}个客户端在线...`)
  })
})

console.log('Web Socket 服务已启动...')
```

```html
// page1.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page1</title>
</head>
<body>
  <input type="text" name="" id="msg">
  <button id="send">page1发送</button>
  <script>
    // 建立 websocket 连接
    var ws = new WebSocket('ws://localhost:3000')

    var send = document.querySelector('#send')
    var msg = document.querySelector('#msg')
    send.onclick = function() {
      if (msg.value.trim() !== '') {
        ws.send(msg.value.trim())
      }
    }

    var count = 1; // 用于计数
    ws.onopen = function() {
      ws.onmessage = function(e) {
        var oP = document.createElement('p')
        oP.innerHTML = `第${count}次接收到消息：${e.data}`
        document.body.appendChild(oP)
        count++
      }
    }
    window.onbeforeunload = function() {
      ws.onclose()
    }
  </script>
</body>
</html>
```

```html
// page2.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page1</title>
</head>
<body>
  <input type="text" name="" id="msg">
  <button id="send">page1发送</button>
  <script>
    // 建立 websocket 连接
    var ws = new WebSocket('ws://localhost:3000')

    var send = document.querySelector('#send')
    var msg = document.querySelector('#msg')
    send.onclick = function() {
      if (msg.value.trim() !== '') {
        ws.send(msg.value.trim())
      }
    }

    var count = 1; // 用于计数
    ws.onopen = function() {
      ws.onmessage = function(e) {
        var oP = document.createElement('p')
        oP.innerHTML = `第${count}次接收到消息：${e.data}`
        document.body.appendChild(oP)
        count++
      }
    }
    window.onbeforeunload = function() {
      ws.onclose()
    }
  </script>
</body>
</html>
```

