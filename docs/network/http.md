# 1. GET 和 POST 的求的区别

- 应用场景
- 是否缓存
- 传参方式不同
- 安全性
- 请求长度
- 参数类型

# 2. POST 和 PUT 请求的区别

POST 请求为什么会发送两次
第一次为 options 预检请求,状态码为 204

- 询问服务器是否支持修改的请求头,如果服务器支持,则在第二次中发送真正的请求
- 检测服务器是否为同源请求,是否支持跨域
  第二次为真正的请求

# 3. 常见的 HTTP 请求头和响应头

## HTTP Request Header

- Accept:浏览器能够处理的内容类型

- Accept-Charset:浏览器能够处理的字符集

- Accept-Encoding:浏览器能够处理的压缩编码

- Accept-Language:浏览器当前设置的语言

- Connection:浏览器与服务器之间连接的类型

- Cookie:当前页面设置的任何 Cookie

- Host:发出请求的页面所在的域

- Referer:发出请求的页面的 URL

- User-Agent:浏览器的用户代理字符串

## HTTP Responses Header

- Date:表示消息发送的时间,时间的描述格式由 rfc822 定义

- server:服务器名称

- Connection:浏览器与服务器之间连接的类型

- Cache-Control:控制 HTTP 缓存

- content-type:表示后面的文档属于什么 MIME 类型
  - `application/x-www-form-urlencoded` 浏览器的原生 form 表单,如果不设置 enctype 属性,那么最终就会以 application/x-www-form-urlencoded 方式提交数据.
  - `multipart/form-data` 表单上传文件的方式
  - `application/json` 服务器消息主体是序列化后的 JSON 字符串
  - `text/xml` 用来提交 XML 格式和数据

# 4. HTTP 状态码 304 是多好还是少好

# 5. 常见的 HTTP 请求方法

- GET：向服务器获取数据
- POST：发送数据给服务器，通常会造成服务器资源的新增修改
- PUT：用于全量修改目标资源
- PATCH：用于对资源进行部分修改
- DELETE：用于删除指定的资源
- HEAD：获取报文首部，与 GET 相比，不返回报文主体部分；使用场景是比如下载一个大文件前，先获取其大小再决定是否要下载，以此可以节约宽带资源
- OPTIONS：（浏览器自动执行）询问支持的请求方法，用来跨域请求、预检请求、判断目标是否安全
- CONNECT：要求在与代理服务器通信时建立管道，使用管道进行 TCP 通信（把服务器作为跳板，让服务器代替用户去访问其他网页，之后把数据原原本本的返回给用户）
- TRACE：该方法会让服务器原样返回任意客户端请求的信息内容，主要用于测试或诊断

# 6. Ajax 组成部分

Ajax：全称`Asynchronous Javascript And XML(异步的js与xml)`

- A：异步
- J：Javascript
- A：And
- X：XML 与 XMLHttpRequest

2. XMLHttpRequest 对象

   Ajax 的核心是 XMLHTTPRequest，他是一种支持异步请求的技术。

   1. 实例化 ajax 对象

   2. open()：创建 HTTP 请求，第一个参数是指定提交方式，第二个参数是指定要提交的地址，第三个参数是指定是异步还是同步（true 异步，false 同步），第四和第五参数在 HTTP 认证的时候会用到，是可选的

   3. 设置请求头

      setRequestHeader(Stringheader，Stringvalue) 使用 post 方式 才会使用到，get 方法并不需要

   4. 发送请求

      send(content)：发送请求给服务器，如果是 get 方式不············需要填写，如果是 post 方式要把提交的参数写上去

   5. 注册回调函数

   ```javascript
   const xhr = new XMLHttpRequest()
   xhr.abort()  // 取消请求
   xhr.open('post', 'http://www.baidu.com')
   xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
   xhr.send('username=admin&pwd=123')
   xhr.onreadstatechange = function() {
       0：请求建立（创建了xhr对象，但是还没调用open）
       1：服务器连接已建立
       2：请求已接收（send之后，服务器已经接收了请求）
       3：请求处理中
       4：请求已完成，且响应已就绪（4状态码等同于onload事件）
       if (xhr.readyState === 4) {
           console.log(xhr)
       }
   }
   ```

# 7. OPTIONS 请求方法及使用场景

OPTIONS 方法请求给定的 URL 或服务器的允许通信选项。客户端可以用这个方法指定一个 URL，或者用星号（\*）来指代整个服务器。

通过这个方法，客户端可以**在采取具体资源请求之前，决定对该资源采取何种必要措施，或者了解服务器性能。**该请求方法的响应不能缓存。

主要用途有两个：

1.  [检测服务器所支持的请求方法](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods/OPTIONS#检测服务器所支持的请求方法)：

    ```bash
    curl -X OPTIONS https://example.org -i
    ```

    ```http
    HTTP/1.1 204 No Content
    Allow: OPTIONS, GET, HEAD, POST
    Cache-Control: max-age=604800
    Date: Thu, 13 Oct 2016 11:45:00 GMT
    Server: EOS (lax004/2813)
    ```

2.  预检请求，检测是否支持跨域等：

    ```http
    OPTIONS /resources/post-here/ HTTP/1.1
    Host: bar.example
    Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
    Accept-Language: en-us,en;q=0.5
    Accept-Encoding: gzip,deflate
    Connection: keep-alive
    Origin: https://foo.example
    Access-Control-Request-Method: POST
    Access-Control-Request-Headers: X-PINGOTHER, Content-Type
    ```

    以上为这些参数进行了请求权限：

    - Access-Control-Request-Method 标头告知服务器实际请求所使用的 HTTP 方法，在这里将实际使用 POST 请求方法
    - Access-Control-Request-Headers 标头告知服务器请求所携带的自定义标头，在这里使用 X-PINGOHTER 和 Content-Type 标头

    服务器响应如下：

    ```http
    HTTP/1.1 200 OK
    Date: Mon, 01 Dec 2008 01:15:39 GMT
    Server: Apache/2.0.61 (Unix)
    Access-Control-Allow-Origin: https://foo.example
    Access-Control-Allow-Methods: POST, GET, OPTIONS
    Access-Control-Allow-Headers: X-PINGOTHER, Content-Type
    Access-Control-Max-Age: 86400
    Vary: Accept-Encoding, Origin
    Keep-Alive: timeout=2, max=100
    Connection: Keep-Alive
    ```

    - Access-Control-Allow-Origin

      https://foo.example 源被允许通过以下方式请求 `bar.example/resources/post-here/` URL：

    - [`Access-Control-Allow-Methods`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Access-Control-Allow-Methods)

      [`POST`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods/POST)、[`GET`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods/GET) 和 `OPTIONS` 是该 URL 允许的方法

    - [`Access-Control-Allow-Headers`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Access-Control-Allow-Headers)

      `X-PINGOTHER` 和 `Content-Type` 是该 URL 允许的请求标头。

    - [`Access-Control-Max-Age`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Access-Control-Max-Age)

      以上权限可以缓存 86400 秒（1 天）。

# 8. HTTP1.0 和 HTTP1.1 之间有哪些区别？

- **连接方面**：http1.0 默认使用非持久连接，而 http1.1 默认使用持久连接。http1.1 通过使用持久连接来使多个 http 请求复用同一个 TCP 连接，来减少非持久连接每次需要重新建立连接的时延。
- **资源请求方面**：在 http1.0 中，存在一些浪费带宽的现象。http1.1 在请求头引入了 range 头域，它允许只请求资源的某个部分，即返回码是 206，这样就方便了开发者自由的选择以便充分利用带宽和连接，并且还是支持断点续传功能
- **缓存方面**：在 http1.0 中主要使用 header 里的 If-Modified-Since、Expires 来作为缓存判断的标准，http1.1 则引入了更多的缓存控制策略，例如 Etag、If-Unmodified-Since、If-Match、If-None-Match 等更多可供选择的缓存头来控制缓存策略。
- **http1.1 中新增了 host 字段**：用来指定服务器的域名。http1.0 中认为每台服务器都绑定一个唯一的 IP 地址，因此，请求消息中的 URL 并没有传递主机名。但随着虚拟主机技术的发展，在一台物理服务器上可以存在多个虚拟主机，并且他们共享一个 IP 地址。因此 有个 host 字段，这样就可以将请求发往到同一台服务器上的不同网站
- http1.1 比 1.0 新增了**请求方法**，如 PUT、HEAD、OPTIONS 等。

# 9. HTTP1.1 和 HTTP2.0 的区别

- **二进制协议**：HTTP/2 是一个二进制协议。在 HTTP/1.1 中，报文的头信息必须是文本（ASCII 编码），数据体可以是文本，也可以二进制。HTTP/2 则是一个彻底的二进制协议，头信息和数据体都是二进制，并且统称为”帧“，可以分为头信息帧和数据帧。帧的概念是它实现多路复用的基础。
- **多路复用**：HTTP/2 实现了多路复用，HTTP/2 仍然复用 TCP 连接，但是在一个连接里，客户端和服务器都可以同时发送多个请求和回应，而且不用按照顺序一 一发送，这样就避免了”队头堵塞“的问题。
- **数据流**：HTTP/2 使用了数据流的概念，因为 HTTP/2 的数据包是不按顺序发送的，同一个连接里面连续的数据包，可能属于不同的请求。因此，必须要对数据包做标记，指出它属于哪个请求。HTTP/2 将每个请求或回应的所有数据包，称为一个数据流。每个数据流都有一个独一无二的编号。数据包发送时，都必须标记数据流 ID，用来区分它属于哪个数据流。
- **头信息压缩**：HTTP/2 实现了头信息压缩，由于 HTTP1.1 协议不带状态，每次请求都必须附上所有信息。所以，请求的很多字段都是重复的，比如 Cookie 和 User Agent，一模一样的内容，每次请求都必须附带，这会浪费很多带宽，也影响速度。HTTP/2 对这一点做了优化，引入了头信息压缩机制。一方面，头信息使用 gzip 或 compress 压缩后再发送；另一方面，客户端和服务器同时维护一张头信息表，所有字段都会存入这个表，生成一个索引号，以后就不发送字段了，只发送索引号，这样就能提高速度了。
- **服务器推送**：HTTP/2 允许服务器未经请求，主动向客户端发送资源，这叫做服务器推送。使用服务器推送提前给客户端推送必要的资源，这样就可以相对减少一些延迟时间。这里需要注意的是 HTTP/2 下服务器主动推送的是静态资源，和 WebSocket 以及使用 SSE 等方式向客户端发送即时数据的推送是不同的。

| 特性/版本     | HTTP/1.0         | HTTP/1.1                          | HTTP/2                              | HTTP/3                              |
| ------------- | ---------------- | --------------------------------- | ----------------------------------- | ----------------------------------- |
| 📆 发布年份   | 1996             | 1999                              | 2015                                | 2022（标准）                        |
| 🧵 连接复用   | ❌ 不支持        | ⚠️ 支持 Keep-Alive 但仍是串行请求 | ✅ 真正支持多路复用（并发请求）     | ✅ 多路复用（基于 QUIC 实现）       |
| 🔗 多路复用   | ❌               | ❌（一个请求占用一个 TCP 连接）   | ✅ 多请求复用一个连接，流级别管理   | ✅ 多请求复用一个连接，且无队头阻塞 |
| 📦 头部压缩   | ❌ 无            | ❌ 无                             | ✅ 使用 HPACK 压缩                  | ✅ 使用 QPACK 压缩（适配 UDP 特性） |
| 🔒 加密要求   | ❌ 可明文        | ❌ 可明文                         | ⚠️ 可选加密（但主流都用 HTTPS）     | ✅ 强制加密（基于 QUIC + TLS 1.3）  |
| 🧱 队头阻塞   | ✅ 严重          | ✅ 有（TCP 层）                   | ⚠️ HTTP 层无，但仍受 TCP 队头阻塞   | ❌ 无队头阻塞（基于 UDP + QUIC）    |
| 🌐 传输协议   | TCP              | TCP                               | TCP                                 | UDP（基于 QUIC）                    |
| 🧠 服务端推送 | ❌               | ❌                                | ✅ 支持 server push（已不推荐使用） | ❌ 支持被弃用，性能收益不大         |
| 🧰 典型特性   | 简单实现、易部署 | Host 字段、多连接复用、缓存控制   | 多路复用、头压缩、优先级、推送      | 低延迟、抗丢包、无队头阻塞、0-RTT   |
| 🚀 性能表现   | ⛔️ 慢，阻塞严重 | ⚠️ 有限提升                       | ✅ 大幅提升延迟与带宽利用率         | ✅ 极佳表现，适合移动端/弱网环境    |
| 📱 应用场景   | 早期网站         | 静态网站、小项目                  | 主流网站、大型 Web 应用             | 移动端、流媒体、实时系统（如微信）  |

# 10. 什么是队头堵塞

队头堵塞是由 HTTP 基本的“请求 - 应答”模型所导致的。HTTP 规定报文必须是“一发一收”，这就形成了一个先进先出的“串行”队列。队列里的请求是没有优先级的，只有入队的先后顺序，排在最前面的请求会被最优先处理。如果队首的请求因为处理的太慢耽误了时间，那么队列后面的所有请求也不得不跟着一起等待，结果就是其他的请求承担了不应有的时间成本，造成了队头堵塞的现象

## 解决方案

1. 并发连接：对于一个域名允许分配多个长连接，那么相当于增加了任务队列，不至于一个队伍的任务阻塞其他所有任务
2. 域名分片：将域名分出很多二级域名，他们都指向同样的一台服务器，能够并发的长连接数变多

# 11. HTTP 和 HTTPS 协议的区别

- HTTPS 协议需要 CA 证书，费用较高；而 HTTP 协议不需要
- HTTP 协议是超文本传输协议，信息是明文传输的，HTTPS 则是具有安全性的 SSL 加密传输协议
- 使用不同的连接方式，端口也不同，HTTP 协议端口是 80，HTTPS 协议端口是 443
- HTTP 协议连接很简单，是无状态的；HTTPS 协议是有 SSL 和 HTTP 协议构建的可进行加密传输、身份认证的网络协议，比 HTTP 更安全

# 12. GET 方法 URL 长度限制的原因

实际上 HTTP 协议规范并没有对 get 方法请求的 url 长度进行限制，这个限制是特定的浏览器及服务器对它的限制。IE 对 URL 长度的限制是 2083 字节（2K + 35）。由于 IE 浏览器对 URL 长度的允许值是最小的，所以开发过程中，只要 URL 不超过 2083 字节，那么在所有浏览器中工作都不会有问题

```sql
GET的长度值 = URL(2083) - (你的Domain + Path) - 2(2是get请求中?=两个字符的长度)
```

# 13. 一个页面从输入 URL 到页面加载显示完成，这个过程中都发生了什么

1. **解析 URL：首先会对 URL 进行解析，分析所需要使用的传输协议和请求的资源路径。**如果输入的 URL 中的协议或者主机名不合法，将会把地址栏中输入的内容传递给搜索引擎。如果没有问题，浏览器会检查 URL 中是否出现了非法字符，如果存在非法字符，则会对非法字符进行转义后再进行下一过程
2. **缓存判断：浏览器会判断所请求的资源是否在缓存里，**如果请求的资源在缓存里并且没有失效，那么就直接使用，否则向服务器发起新的请求
3. **DNS 解析：**下一步首先需要获取的是输入的 URL 中的域名的 IP 地址，首先会**判断本地昰否有该域名的 IP 地址的缓存**，如果有则使用，**如果没有则向本地 DNS 服务器发起请求。本地 DNS 服务器也会先检查是否存在缓存，如果没有就会先向根域名服务器发起请求，**获得负责的顶级域名服务器的地址后，**再向顶级域名服务器请求，**然后获得负责的权威域名服务器的地址后，**再向权威域名服务器发起请求，最终获得域名的 IP 地址后，本地 DNS 服务器再将这个 IP 地址返回给请求的用户。**
4. **TCP 三次握手：确认客户端与服务器的接收与发送能力。**
   1. 首先客户端向服务器发送一个 SYN 报文段，请求建立连接
      > 客户端将 TCP 报文标志位 SYN 置为 1，随机产生一个序号值 seq=J，保存在 TCP 首部的序列号(Sequence Number)字段里，指明客户端打算连接的服务器的端口，并将该数据包发送给服务器端，发送完毕后，客户端进入 SYN_SENT 状态，等待服务器端确认。
   2. 服务器向客户端发送 SYN 请求连接的确认应答,并也请求建立连接
      > 服务器端收到数据包后由标志位 SYN=1 知道客户端请求建立连接，服务器端将 TCP 报文标志位 SYN 和 ACK 都置为 1，ack=J+1，随机产生一个序号值 seq=K，并将该数据包发送给客户端以确认连接请求，服务器端进入 SYN_RCVD 状态。
   3. 客户端像服务器的请求连接的确认应答,连接建立
      > 客户端收到确认后，检查 ack 是否为 J+1，ACK 是否为 1，如果正确则将标志位 ACK 置为 1，ack=K+1，并将该数据包发送给服务器端，服务器端检查 ack 是否为 K+1，ACK 是否为 1，如果正确则连接建立成功，客户端和服务器端进入 ESTABLISHED 状态，完成三次握手，随后客户端与服务器端之间可以开始传输数据了。
5. **发送 HTTP 请求，服务器处理请求，返回 HTTP 报文**
6. **页面渲染：**首先浏览器会根据 html 文件构建 DOM 树，根据解析到的 css 文件构建 CSSOM 树。如果遇到 script 标签，则判断是否含有 defer 或者 async 属性，要不然 script 的加载和执行会造成页面渲染的阻塞。当 DOM 树和 CSSOM 树建立好后，根据他们来构建渲染树，构建好后，会根据渲染树来进行布局。布局完成后，最后使用浏览器的 UI 接口对页面进行绘制。这个时候整个页面就显示出来了。
7. **TCP 四次挥手：最后一步是 TCP 断开连接的四次挥手过程。**
   1. 客户端请求断开连接
      若客户端认为数据发送完成，则它需要向服务端发送连接释放请求。服务端收到连接释放请求后，会告诉应用层要释放 TCP 链接。然后会发送 ACK 包，并进入 CLOSE_WAIT 状态，此时表明客户端的连接已经释放，不再接收客户端发送的数据了
   2. 客户端确认应答
      但是因为 TCP 连接是双向的，所以服务端仍旧可以发送数据给客户端
   3. 服务端请求断开连接
      服务端如果此时还有没发完的数据会继续发送，完毕后会向客户端发送连接释放请求，然后服务端便进入 LAST-ACK 状态。
   4. 服务端收到确认应答后，也便进入 CLOSED 状态
      客户端收到释放请求后，向服务端发送确认应答，此时客户端进入 TIME-WAIT 状态，在该状态时间段呢，若没有服务端的重发请求的话，就进入 CLOSED 状态。

# 14. 页面有多张图片，HTTP 是怎样的加载表现

在 HTTP1 下，浏览器对一个域名下最大 TCP 连接数为 6，所以会请求多次。可以用多域名部署解决。这样可以提高同时请求的数目，加快页面图片的获取速度。

在 HTTP2 下，可以一瞬间加载出来很多资源，因为，HTTP2 支持多路复用，可以在一个 TCP 连接中发送多个 HTTP 请求。

# 15. HTTP2 的头部压缩算法是怎么样的

HTTP2 的头部压缩是 HPACK 算法。在客户端和服务器两端建立“字典”，用索引号表示重复的字符串，采用哈夫曼编码来压缩整数和字符串，可以达到 50%~90%的高压缩率。

具体来说：

- 在客户端和服务器端使用“首部表”来跟踪和存储之前发送的键值对，对于相同的数据，不再通过每次请求和响应发送；
- 首部表在 HTTP/2 的连接存续期内始终存在，由客户端和服务器共同渐进地更新；
- 每个新的首部键值对要么被追加到当前表的末尾，要么替换表中之前的值。

# 16. HTTP 的请求报文是什么样的

由 4 部分组成：

- 请求行

  包括请求方法、URL、HTTP 协议版本。他们用空格分隔，例如：`GET /index.html HTTP/1.1`

- 请求头

  由关键字/值对组成，每行一对，关键字和值用英文冒号：分隔

  - User-Agent:浏览器类型
  - Accept:客户端可以识别的内容类型列表
  - Host:请求的主机名，允许多个域名同处一个 IP 地址，即虚拟主机

- 空行

- 请求体

  post、put 等请求携带的数据

# 17. HTTP 的响应报文是什么样的

- 响应行：由网络协议版本，状态码和状态码含义组成，例如：`HTTP/1.1 200 OK`
- 响应头：响应首部组成
- 空行
- 响应体：服务器响应的数据

# 18. HTTP 协议的优点和缺点

HTTP 是超文本传输协议，它定义了客户端和服务器之间交换报文的格式和方式，默认使用 80 端口，它使用 TCP 作为传输层协议，保证了数据传输的可靠性。

优点：

- 支持客户端/服务器模式
- 简单快速：客户向服务器请求服务时，只需传送请求方法和路径。由于 HTTP 协议简单，使得 HTTP 服务器的程序规模小，因而通信速度很快。
- 无连接：无连接就是限制每次连接只处理一个请求。服务器处理完客户的请求，并收到客户的应答后，即断开连接，采用这种方式可以节省传输时间。
- 无状态：HTTP 协议是无状态协议，这里的状态是指通信过程的上下文信息。缺少状态意味着如果后续处理需要前面的信息，则它必须重传，这样可能会导致每次连接传送的数据量增大。另一方面，在服务器不需要先前信息时它的应答就比较快
- 灵活：HTTP 允许传输任意类型的数据对象。正在传输的类型由 Content-Type 加以标记

缺点：

- 无状态：HTTP 是一个无状态的协议，HTTP 服务器不会保存关于客户的任何信息
- 明文传输：协议中的报文使用的是文本形式，这就直接暴露给外界，不安全。
- 不安全：
  1. 通信使用明文，内容可能会被窃听；
  2. 不验证通信方的身份，因此有可能遭遇伪装；
  3. 无法证明报文的完整性，所以有可能已遭篡改。

# 19. HTTP3.0

HTTP3.0 的核心协议是由 Google 在 2015 年提出的，传统的 HTTP 协议是基于传输层 TCP 的协议，而 HTTP3 协议是基于传输层 UDP 上的协议，可以看成是：HTTP3.0 基于 UDP 的安全可靠的 HTTP2.0 协议。

# 20. HTTP 的两种连接模式

HTTP 协议是基于 TCP/IP，并且使用了请求-应答的通信模式。

HTTP 协议有两种连接模式，一种是非持续连接，一种持续连接。（1）非持续连接指的是服务器必须为每一个请求的对象建立和维护一个全新的连接；（2）持续连接下，TCP 连接默认不关闭，可以被多个请求复用。采用持续连接的好处是可以避免每次建立 TCP 连接三次握手时所花费的时间。

# 21. URL 有哪些组成部分

以下面的 URL 为例www.aspxfans.com:8080/news/index?ID=246188#name：

- **协议部分：**该 URL 的协议部分为"http:"，这代表网页使用的是 HTTP 协议。在 Internet 中可以使用多种协议，如：HTTP，FTP 等。在 HTTP 后面的//为分隔符；
- **域名部分：**该 URL 的域名部分为www.aspxfans.com。一个URL中，也可以使用IP地址作为域名使用；
- **端口部分：**跟在域名后面的是端口，域名和端口之间使用：作为分隔符。端口不是一个 URL 必须的部分，如果省略端口部分，将采用默认端口（HTTP 默认是 80，HTTPS 是 443）；
- **虚拟目录部分：**从域名后的第一个 / 开始到 / 为止，是虚拟目录部分。虚拟目录也不是一个 URL 必须的部分。本例中的虚拟目录是”/news/“；
- **文件名部分：**从域名后的最后一个 / 开始到 ? 为止，是文件名部分，如果没有 ? ，则是从域名后的最后一个 / 开始到 # 为止，是文件部分，如果没有 ？和 #，那么从域名后的最后一个 / 开始到结束，都是文件名部分。本例中的文件名是 index.asp。文件名部分也不是一个 URL 必须的部分，如果省略该部分，则使用默认的文件名；
- **锚部分：**从 # 开始到最后，都是锚部分。本例中的锚部分是 name。锚部分也不是一个 URL 必须的部分；
- **参数部分：**从 ？开始到 # 为止之间的部分为参数部分，又称搜索部分、查询部分。本例中的参数部分为“boardID=5&ID=24618&PAGE=1"。参数可以允许有多个参数，参数与参数之间用&作为分隔符。

# 22. [缓存](/docs/browser/index.md)

# 23. HTTP 的 keep-alive 有什么作用？

http1.0 默认关闭，需要手动开启；http1.1 后默认开启。

作用：使客户端到服务器端的连接持续有效（长连接），当出现对服务器的后续请求时，keep-Alive 功能避免了建立或者重新建立连接。

使用方法：在请求头中加上 Connection: keep-alive。

优点：

- 较少的 CPU 和内存的占用（因为要打开的连接数变少了，复用了连接）
- 减少了后续请求的延迟（无需再进行握手）

缺点：本来可以释放的资源仍旧被占用。有的请求已经结束了，但是还一直连接着。

解决方法：服务器设置过期时间和请求次数，超过这个时间或者次数就断掉连接。

# 24. OSI 的七层模型是什么

OSI 在功能上可以划分为两组：

网络群组：物理层、数据链路层、网络层

使用者群组：传输层、会话层、表示层、应用层

| #   | OSI 七层网络模型 | TCP/IP 四层概念模型 | 对应网络协议                                                                                                                                        |
| --- | ---------------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| 7   | 应用层           | 应用层              | HTTP、RTSP、TFTP（简单文本传输协议）、FTP、NFS（数域筛法，数据加密）、WAIS（广域信息查询系统）                                                      |
| 6   | 表示层           | 应用层              | Telnet（internet 远程登录服务的标准协议）、Rlogin、SNMP（网络管理协议）、Gopher                                                                     |
| 5   | 会话层           | 应用层              | SMTP（简单邮件传输协议）、DNS（域名系统）                                                                                                           |
| 4   | 传输层           | 传输层              | TCP（传输控制协议）、UDP（用户数据报协议）                                                                                                          |
| 3   | 网络层           | 网际层              | ARP（地域解析协议）、RARP、AKP、UUCP（Unix to Unix copy）                                                                                           |
| 2   | 数据链路层       | 数据链路层          | FDDI（光纤分布式数据接口）、Ethernet、Arpanet、PDN（公用数据网）、SLIP（串行线路网际协议）PPP（点对点协议，通过拨号或专线方建立点对点连接发送数据） |
| 1   | 物理层           | 物理层              | SMTP（简单邮件传输协议）、DNS（域名系统）                                                                                                           |

其中高层（7、6、5、4 层）定义了应用程序的功能，下面三层（3、2、1 层）主要面向通过网络的端到端的数据流。

# 25. [跨域](https://juejin.cn/post/6844903767226351623)

## 1. 什么是跨域

浏览器的同源策略是一种约定，它是浏览器最核心也最基本的安全功能，如果缺少了同源策略，浏览器很容易受到 XSS（跨站脚本）、CSRF（跨站请求伪造）等攻击。

同源是指协议、域名和端口相同，如果任意一个不相同，都算作不同域。这样他们之间互相请求资源，就会算作”跨域请求“。

但是有三个标签是允许跨域加载资源的：

- `<img src=XXX />`
- `<link href=XXX >`
- `<script src=xxx >`

### 这里有个问题，请求跨域了，那么请求到底发出去没有？

**跨域并不是请求发不出去，请求能发出去，服务端能收到请求并正常返回结果，只是结果被浏览器拦截了。**

## 2. 跨域解决方案

### 2.1 JSONP

#### 1. JSONP 原理

利用 `<script>`标签没有跨域限制的漏洞，网页可以得到从其他来源动态产生的 JSON 数据。JSONP 请求一定需要对方的服务器做支持才可以。

#### 2. JSONP 和 AJAX 对比

JSONP 和 AJAX 相同，都是客户端向服务器端发送请求，从服务器获取数据的方式。但 AJAX 属于同源策略，JSOPN 属于非同源策略（跨域请求）。

#### 3. JSONP 优缺点

- 优点：是简单兼容性好，可用于解决主流浏览器的跨域数据访问的问题。

- 缺点：是仅支持 get 方法具有局限性，不安全可能会遭受 XSS 攻击。

#### 4. JSONP 的实现流程

在开发中可能会遇到多个 JSONP 请求的回调函数名是相同的，这时候就需要自己封装一个 JSONP 函数：

```js
// index.html
function jsonp({ url, params, callback }) {
  return new Promise((resolve, reject) => {
    let script = document.createElement("script");
    window[callback] = function (data) {
      resolve(data);
      document.body.removeChild(script);
    };
    params = { ...params, callback };
    let arrs = [];
    for (let key in params) {
      arrs.push(`${key}=${params[key]}`);
    }
    script.src = `${url}?${arrs.join("&")}`;
    document.body.appendChild(script);
  });
}
jsonp({
  url: "http://localhost:3000/say",
  params: { wd: "Iloveyou" },
  callback: "show",
}).then((data) => {
  console.log(data);
});
```

上面这段代码相当于向`http://localhost:3000/say?wd=Iloveyou&callback=show`这个地址请求数据，然后后台返回`show('我不爱你')`，最后会运行 show()这个函数，打印出'我不爱你'

```js
// server.js
let express = require("express");
let app = express();
app.get("/say", function (req, res) {
  let { wd, callback } = req.query;
  console.log(wd); // Iloveyou
  console.log(callback); // show
  res.send(`${callback}('我不爱你')`);
});
app.listen(3000);
```

### 2.2 CORS

浏览器会自动进行 CORS 通信，实现 CORS 通信的关键是后端。只要后端实现了 CORS，就实现了跨域。

服务端设置`Access-Control-Allow-Origin`就可以开启 CORS。改属性表示哪些域名可以访问资源，如果设置\*则表示所有网站都可以访问资源。

### 2.3 postMessage

postMessage 是 HTML5 中的 API，且是为数不多可以跨域操作的 window 属性之一，它可用于解决以下方面的问题：

- 页面和其打开的新窗口的数据传递
- 多窗口之间消息传递
- 页面与嵌套的 iframe 消息传递
- 上面三个场景的跨域数据传递

**postMessage()方法允许来自不同源的脚本采用异步方式进行有限的通信，可以实现跨文本档、多窗口、跨域消息传递**

> `otherWindow.postMessage(message, targetOrigin, [transfer])`

- message：将要发送到其他 window 的数据。
- targetOrigin：通过窗口的 origin 属性来指定哪些窗口能接收到消息事件，其值可以是字符串"\*"（表示无限制）或者一个 URI。在发送消息的时候，如果目标窗口的协议、主机地址或端口这三者的任意一项不匹配 targetOrigin 提供的值，那么消息就不会被发送；只有三者完全匹配，消息才会被发送。
- transfer(可选)：是一串和 message 同时传递的 Transferable 对象. 这些对象的所有权将被转移给消息的接收方，而发送一方将不再保有所有权。

例子：

```html
// a.html
<iframe src="http://localhost:4000/b.html" frameborder="0" id="frame" onload="load()"></iframe>
<script>
  function load() {
    const frame = document.getElementById("frame");
    frame.contentWindow.postMessage("ILoveYou", "http://localhost:4000");
    window.onmessage = function (e) {
      console.log(e.data); // Idon'tloveyou
    };
  }
</script>
```

```js
// b.html
window.onmessage = function (e) {
  console.log(e.data); // ILoveYou
  e.source.postMessage(`Idon'tloveyou`, e.origin);
};
```

### 2.4 websocket

Websocket 是 HTML5 的一个持久化的协议，它实现了浏览器与服务器的全双工通信，同时也是跨域的一种解决方案。

WebSocket 和 HTTP 都是应用层协议，都是基于 TCP 协议。但是 WebSocket 是一种双向通信协议，在建立连接之后，WebSocket 的 server 与 client 都能主动向对方发送或接收数据。

同时，WebSocket 在建立连接时需要借助 HTTP 协议，连接建立好了之后 client 和 server 之间的双向通信就与 HTTP 无关了。

原生 WebSocket API 使用起来不太方便，我们使用`Socket.io`，它很好地封装了 webSocket 接口，提供了更简单、灵活的接口，也对不支持 webSocket 的浏览器提供了向下兼容。

我们先来看个例子：本地文件 socket.html 向`localhost:3000`发送数据和接受数据

```js
// socket.html
let socket = new WebSocket("ws://localhost:3000");
socket.onopen = function () {
  socket.send("Iloveyou");
};
socket.onmessage = function (e) {
  console.log(e.data);
};
```

```js
// server.js
let express = require("express");
let app = express();
let WebSocket = require("ws");
let wss = new WebSocket.Server({ port: 3000 });
wss.on("connection", function (ws) {
  ws.on("message", function (data) {
    console.log(data);
    ws.send(`Idon'tloveyou`);
  });
});
```

### 2.5 Node 中间件代理

实现原理：同源策略是浏览器需要遵循的标准，而如果是服务器向服务器请求就无需遵循同源策略。

代理服务器需要做以下几个步骤：

1. 接收客户端请求。
2. 将请求转发给目标服务器
3. 拿到目标服务器响应的数据
4. 将响应转发给客户端

![23](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/1/17/1685c5bed77e7788~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp)

```javascript
// index.html(http://127.0.0.1:5500)
<script src="https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js"></script>
<script>
$.ajax({
    url: 'http://localhost:3000',
    type: 'post',
    data: { name: 'xiamen', password: '123456' },
    contentType: 'application/json;charset=utf-8',
    success: function(result) {
        console.log(result) // {"title":"fontend","password":"123456"}
    },
    error: function(msg) {
        console.log(msg)
    }
})
</script>
```

```javascript
// server1.js 代理服务器http://localhost:3000
const http = require("http");
// 第一步：接受客户端请求
const server = http.createServer((request, response) => {
  // 代理服务器，直接和浏览器交互，需要设置CORS的首部字段
  response.writeHead(200, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  // 第二步：将请求转发给服务器
  const proxyRequest = http
    .request(
      {
        host: "127.0.0.1",
        port: 4000,
        url: "/",
        method: request.method,
        headers: request.headers,
      },
      (serverResponse) => {
        // 第三步：收到服务器的响应
        var body = "";
        serverResponse.on("data", (chunk) => {
          body += chunk;
        });
        serverResponse.on("end", () => {
          console.log("The data is " + body);
          // 第四步：将响应结果转发给浏览器
          response.end(body);
        });
      }
    )
    .end();
});
server.listen(3000, () => {
  console.log("The proxyServer is running at http://localhost:3000");
});
```

```javascript
// server2.js 目标服务器 http://localhost:4000
const http = require("http");
const data = { title: "fontend", password: "123456" };
const server = http.createServer((request, response) => {
  if (request.url === "/") {
    response.end(JSON.stringfy(data));
  }
});
server.listen(4000, () => {
  console.log("The server is running at http://localhost:4000");
});
```

上述代码经过两次跨域，值得注意的是浏览器向代理服务器发送请求，也遵循同源策略，最后在 index.html 文件打印出`{"title":"fontend","password":"123456"}`

### 2.6 nginx 反向代理

实现原理类似于 Node 中间件代理，需要你搭建一个中转 nginx 服务器，用于转发请求。

使用 niginx 反向代理实现跨域，是最简单的跨域方式。只需要修改 nginx 的配置即可解决跨域问题，支持所有浏览器，支持 session，不需要修改任何代码，并且不会影响服务器性能。

实现思路：通过 nginx 配置一个代理服务器（域名与 domain1 相同，端口不同）做跳板机，反向代理访问 domain2 接口，并且可以顺便修改 cookie 中 domain 信息，方便当前域 cookie 写入，实现跨域登录。

先下载[nginx](http://nginx.org/en/download.html)，然后将 nginx 目录下的 nginx.conf 修改如下:

```nginx
// proxy 服务器
server {
    listen		81;
    server_name www.domain1.com;
    location / {
        proxy_pass http://www.domain2.com:8080; # 反向代理
        proxy_cookie_domain www.domain2.com www.domain1.com; # 修改cookie里域名
        index  index.html index.htm;

        # 当用webpack-dev-server 等中间件代理接口访问nignx时，此时无浏览器参与，故没有同源显示，下面的跨域配置可不启用
        add_header Access-Control-Allow-Origin http://www.domain1.com; # 当前端只跨域不带cookie时，可为*
        add_header Access-Control-Allow-Credentials true;
    }
}
```

最后通过命令行`nginx -s reload` 启动 nginx

```javascript
// index.html
var xhr = new XMLHttpRequest();
// 前端开关：浏览器是否读写cookie
xhr.withCredentials = true;
// 访问nginx中的代理服务器
xhr.open("get", "http://www.domain1.com:81/?user=admin", true);
xhr.send();
```

```javascript
// server.js
var http = require("http");
var server = http.createServer();
var qs = require("querystring");
server.on("request", function (req, res) {
  var params = qs.parse(req.url.substring(2));
  // 向前台写cookie
  res.writeHead(200, {
    "Set-Cookie": "l=a123456;Path=/;Domain=www.domain2.com;HttpOnly", // HttpOnly:脚本无法读取
  });
  res.write(JSON.string(params));
  res.end();
});
server.listen("8080");
console.log("Server is running at port 8080...");
```

### 2.7 window.name + iframe

window.name 属性的独特之处：name 值在不同的页面（甚至不同域名）加载后依旧存在，并且可以支持非常长的 name 值（2MB）。

其中`a.html`和`b.html`是同域的，都是`http://localhost:3000`，`b.html`为中间代理页，内容为空；而`c.html`是`http://localhost:4000`。

```javascript
// c.html(http://localhost:4000/c.html)
<script>window.name = 'CORS'</script>
```

```javascript
// a.html(http://localhost:3000/b.html)
<iframe src="http://localhost:4000/c.html" frameborder="0" onload="load()" id="iframe"></iframe>
<script>
    let first = true
	// onload 事件会触发两次，第一次加载跨域页，并留存数据于window.name
	function load() {
        if (first) {
            // 第一次onload(跨域页)成功后，切换到同域代理页面
           let iframe = document.getElementById('iframe')
           iframe.src = 'http://localhost:3000/b.html'
           first = false
        } else {
            // 第二次onload(同域b.html)成功后，读取同域window.name中数据
            console.log(iframe.contentWindow.name) // CORS
        }
    }
</script>
```

### 2.8 location.hash + iframe

### 2.9 document.domain + iframe

## 3. 总结

跨域的解决方案思路两种，躲避绕过去和 CORS。

各种 iframe 方式可传递数据，但组织和控制代码逻辑太复杂，鸡肋。

jsonp 前几年使用，现在浏览器兼容性高了，以及受限于仅 get 方式，逐步淘汰了。

nginx 反向代理是绕过去的方式，是通吃的完美解决方案，缺点也是服务器压力大一点，但实际中那点压力根本不是大问题；同时反向代理更适合内部应用间访问和共享。

CORS 才是真正的称得上跨域请求解决方案，因为请求存在跨域，结果是拿到了数据，也就是说服务器和浏览器之间进行了协商通信控制后，才得以允许或拒绝。

最后说明下，跨域请求产生时，请求是发出去了，也是有响应的，仅仅是浏览器同源策略，认为不安全，拦截了结果，不将数据传递我们使用。
