[HTTP](https://juejin.cn/post/7149438206419664927)
1. GET和POST的求的区别
  * 应用场景
  * 是否缓存
  * 传参方式不同
  * 安全性
  * 请求长度
  * 参数类型

2. POST和PUT请求的区别
   POST请求为什么会发送两次
    第一次为options预检请求,状态码为204

      * 询问服务器是否支持修改的请求头,如果服务器支持,则在第二次中发送真正的请求
      * 检测服务器是否为同源请求,是否支持跨域
    第二次为真正的请求

3. 常见的HTTP请求头和响应头
   HTTP Request Header
   
   * Accept:浏览器能够处理的内容类型
   * Accept-Charset:浏览器能够处理的字符集
   * Accept-Encoding:浏览器能够处理的压缩编码
   * Accept-Language:浏览器当前设置的语言
   * Connection:浏览器与服务器之间连接的类型
   * Cookie:当前页面设置的任何Cookie
   * Host:发出请求的页面所在的域
   * Referer:发出请求的页面的URL
   * User-Agent:浏览器的用户代理字符串
   HTTP Responses Header
   * Date:表示消息发送的时间,时间的描述格式由rfc822定义
   * server:服务器名称
   * Connection:浏览器与服务器之间连接的类型
   * Cache-Control:控制HTTP缓存
   * content-type:表示后面的文档属于什么MIME类型
     * `application/x-www-form-urlencoded` 浏览器的原生form表单,如果不设置enctype属性,那么最终就会以application/x-www-form-urlencoded 方式提交数据.
     * `multipart/form-data` 表单上传文件的方式
     * `application/json` 服务器消息主体是序列化后的JSON字符串
     * `text/xml` 用来提交XML格式和数据
   
4. HTTP状态码304是多好还是少好

5. 常见的HTTP请求方法

   * GET：向服务器获取数据
   * POST：发送数据给服务器，通常会造成服务器资源的新增修改
   * PUT：用于全量修改目标资源
   * PATCH：用于对资源进行部分修改
   * DELETE：用于删除指定的资源
   * HEAD：获取报文首部，与GET相比，不返回报文主体部分；使用场景是比如下载一个大文件前，先获取其大小再决定是否要下载，以此可以节约宽带资源
   * OPTIONS：（浏览器自动执行）询问支持的请求方法，用来跨域请求、预检请求、判断目标是否安全
   * CONNECT：要求在与代理服务器通信时建立管道，使用管道进行TCP通信（把服务器作为跳板，让服务器代替用户去访问其他网页，之后把数据原原本本的返回给用户）
   * TRACE：该方法会让服务器原样返回任意客户端请求的信息内容，主要用于测试或诊断

6. Ajax组成部分

   Ajax：全称`Asynchronous Javascript And XML(异步的js与xml)`

   * A：异步
   * J：Javascript
   * A：And
   * X：XML与XMLHttpRequest

7. XMLHttpRequest对象

   Ajax的核心是XMLHTTPRequest，他是一种支持异步请求的技术。

   1. 实例化ajax对象

   2. open()：创建HTTP请求，第一个参数是指定提交方式，第二个参数是指定要提交的地址，第三个参数是指定是异步还是同步（true异步，false同步），第四和第五参数在HTTP认证的时候会用到，是可选的

   3. 设置请求头

      setRequestHeader(Stringheader，Stringvalue) 使用post方式 才会使用到，get方法并不需要

   4. 发送请求

      send(content)：发送请求给服务器，如果是get方式不需要填写，如果是post方式要把提交的参数写上去

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

8. OPTIONS 请求方法及使用场景

   OPTIONS 方法请求给定的URL或服务器的允许通信选项。客户端可以用这个方法指定一个URL，或者用星号（*）来指代整个服务器。

   通过这个方法，客户端可以**在采取具体资源请求之前，决定对该资源采取何种必要措施，或者了解服务器性能。**该请求方法的响应不能缓存。

   主要用途有两个：

   1. [检测服务器所支持的请求方法](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods/OPTIONS#检测服务器所支持的请求方法)：

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

      

   2. 预检请求，检测是否支持跨域等：

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

      * Access-Control-Request-Method 标头告知服务器实际请求所使用的HTTP方法，在这里将实际使用POST请求方法
      * Access-Control-Request-Headers 标头告知服务器请求所携带的自定义标头，在这里使用 X-PINGOHTER 和 Content-Type 标头

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

      * Access-Control-Allow-Origin

        https://foo.example 源被允许通过以下方式请求 `bar.example/resources/post-here/` URL：

      * [`Access-Control-Allow-Methods`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Access-Control-Allow-Methods)

        [`POST`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods/POST)、[`GET`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods/GET) 和 `OPTIONS` 是该 URL 允许的方法

      * [`Access-Control-Allow-Headers`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Access-Control-Allow-Headers)

        `X-PINGOTHER` 和 `Content-Type` 是该 URL 允许的请求标头。

      * [`Access-Control-Max-Age`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Access-Control-Max-Age)

        以上权限可以缓存 86400 秒（1 天）。

9. HTTP1.0 和 HTTP1.1 之间有哪些区别？

   * **连接方面**：http1.0 默认使用非持久连接，而http1.1 默认使用持久连接。http1.1 通过使用持久连接来使多个http请求复用同一个TCP连接，来减少非持久连接每次需要重新建立连接的时延。
   * **资源请求方面**：在http1.0 中，存在一些浪费带宽的现象。http1.1在请求头引入了range头域，它允许只请求资源的某个部分，即返回码是206，这样就方便了开发者自由的选择以便充分利用带宽和连接，并且还是支持断点续传功能
   * **缓存方面**：在http1.0 中主要使用 header 里的 If-Modified-Since、Expires来作为缓存判断的标准，http1.1 则引入了更多的缓存控制策略，例如 Etag、If-Unmodified-Since、If-Match、If-None-Match 等更多可供选择的缓存头来控制缓存策略。
   * **http1.1 中新增了host字段**：用来指定服务器的域名。http1.0 中认为每台服务器都绑定一个唯一的IP地址，因此，请求消息中的URL并没有传递主机名。但随着虚拟主机技术的发展，在一台物理服务器上可以存在多个虚拟主机，并且他们共享一个IP地址。因此 有个host字段，这样就可以将请求发往到同一台服务器上的不同网站
   * http1.1 比 1.0 新增了**请求方法**，如 PUT、HEAD、OPTIONS等。

10. HTTP1.1 和 HTTP2.0 的区别

   * **二进制协议**：HTTP/2 是一个二进制协议。在HTTP/1.1 中，报文的头信息必须是文本（ASCII编码），数据体可以是文本，也可以二进制。HTTP/2 则是一个彻底的二进制协议，头信息和数据体都是二进制，并且统称为”帧“，可以分为头信息帧和数据帧。帧的概念是它实现多路复用的基础。
   * **多路复用**：HTTP/2 实现了多路复用，HTTP/2 仍然复用TCP连接，但是在一个连接里，客户端和服务器都可以同时发送多个请求和回应，而且不用按照顺序一 一发送，这样就避免了”队头堵塞“的问题。
   * **数据流**：HTTP/2 使用了数据流的概念，因为HTTP/2的数据包是不按顺序发送的，同一个连接里面连续的数据包，可能属于不同的请求。因此，必须要对数据包做标记，指出它属于哪个请求。HTTP/2将每个请求或回应的所有数据包，称为一个数据流。每个数据流都有一个独一无二的编号。数据包发送时，都必须标记数据流ID，用来区分它属于哪个数据流。
   * **头信息压缩**：HTTP/2实现了头信息压缩，由于HTTP1.1协议不带状态，每次请求都必须附上所有信息。所以，请求的很多字段都是重复的，比如 Cookie 和 User Agent，一模一样的内容，每次请求都必须附带，这会浪费很多带宽，也影响速度。HTTP/2对这一点做了优化，引入了头信息压缩机制。一方面，头信息使用 gzip 或 compress 压缩后再发送；另一方面，客户端和服务器同时维护一张头信息表，所有字段都会存入这个表，所有字段都会存入这个表，生成一个索引号，以后就不发送字段了，只发送索引号，这样就能提高速度了。
   * **服务器推送**：HTTP/2 允许服务器未经请求，主动向客户端发送资源，这叫做服务器推送。使用服务器推送提前给客户端推送必要的资源，这样就可以相对减少一些延迟时间。这里需要注意的是HTTP/2下服务器主动推送的是静态资源，和 WebSocket 以及使用 SSE 等方式向客户端发送即时数据的推送是不同的。

11. 什么是队头堵塞

    队头堵塞是由HTTP基本的“请求 - 应答”模型所导致的。HTTP 规定报文必须是“一发一收”，这就形成了一个先进先出的“串行”队列。队列里的请求是没有优先级的，只有入队的先后顺序，排在最前面的请求会被最优先处理。如果队首的请求因为处理的太慢耽误了时间，那么队列后面的所有请求也不得不跟着一起等待，结果就是其他的请求承担了不应有的时间成本，造成了队头堵塞的现象

12. 队头堵塞的解决方案

    1. 并发连接：对于一个域名允许分配多个长连接，那么相当于增加了任务队列，不至于一个队伍的任务阻塞其他所有任务
    2. 域名分片：将域名分出很多二级域名，他们都指向同样的一台服务器，能够并发的长连接数变多

13. HTTP 和 HTTPS 协议的区别

    * HTTPS 协议需要CA证书，费用较高；而HTTP协议不需要
    * HTTP 协议是超文本传输协议，信息是明文传输的，HTTPS 则是具有安全性的SSL加密传输协议
    * 使用不同的连接方式，端口也不同，HTTP协议端口是80，HTTPS协议端口是443
    * HTTP 协议连接很简单，是无状态的；HTTPS协议是有SSL和HTTP协议构建的可进行加密传输、身份认证的网络协议，比HTTP更安全

14. GET 方法URL 长度限制的原因

    实际上HTTP协议规范并没有对get方法请求的url长度进行限制，这个限制是特定的浏览器及服务器对它的限制。IE对URL长度的限制是2083字节（2K + 35）。由于IE浏览器对URL长度的允许值是最小的，所以开发过程中，只要URL不超过2083字节，那么在所有浏览器中工作都不会有问题

    ```sql
    GET的长度值 = URL(2083) - (你的Domain + Path) - 2(2是get请求中?=两个字符的长度)
    ```

15. 一个页面从输入URL到页面加载显示完成，这个过程中都发生了什么

    1. **解析URL：首先会对URL进行解析，分析所需要使用的传输协议和请求的资源路径。**如果输入的URL中的协议或者主机名不合法，将会把地址栏中输入的内容传递给搜索引擎。如果没有问题，浏览器会检查URL中是否出现了非法字符，如果存在非法字符，则会对非法字符进行转义后再进行下一过程
    2. **缓存判断：浏览器会判断所请求的资源是否在缓存里，**如果请求的资源在缓存里并且没有失效，那么就直接使用，否则向服务器发起新的请求
    3. **DNS解析：**下一步首先需要获取的是输入的URL中的域名的IP地址，首先会**判断本地昰否有该域名的IP地址的缓存**，如果有则使用，**如果没有则向本地DNS服务器发起请求。本地DNS服务器也会先检查是否存在缓存，如果没有就会先向根域名服务器发起请求，**获得负责的顶级域名服务器的地址后，**再向顶级域名服务器请求，**然后获得负责的权威域名服务器的地址后，**再向权威域名服务器发起请求，最终获得域名的IP地址后，本地DNS服务器再将这个IP地址返回给请求的用户。**
    4. **TCP三次握手：确认客户端与服务器的接收与发送能力。**
       1. 首先客户端向服务器发送一个SYN连接请求报文段和一个随机序号，服务端接收到请求后向服务器端发送一个 SYN ACK 报文段，确认连接请求
       2. 并且也向客户端发送一个随机序号，客户端接收服务器的确认应答后，进入连接建立的状态，
       3. 同时向服务器也发送一个ACK确认报文段，服务器端接收到确认后，也进入连接建立状态，此时双方的连接就建立起来了
    5. **发送HTTP请求，服务器处理请求，返回HTTP报文**
    6. **页面渲染：**首先浏览器会根据html文件构建DOM树，根据解析到的css文件构建CSSOM树。如果遇到script标签，则判断是否含有defer或者async属性，要不然script的加载和执行会造成页面渲染的阻塞。当DOM树和CSSOM树建立好后，根据他们来构建渲染树，构建好后，会根据渲染树来进行布局。布局完成后，最后使用浏览器的UI接口对页面进行绘制。这个时候整个页面就显示出来了。
    7. **TCP四次挥手：最后一步是TCP断开连接的四次挥手过程。**
       1. 若客户端认为数据发送完成，则它需要向服务端发送连接释放请求。服务端收到连接释放请求后，会告诉应用层要释放TCP链接。然后会发送ACK包，并进入CLOSE_WAIT状态，此时表明客户端的连接已经释放，不再接收客户端发送的数据了
       2. 但是因为TCP连接是双向的，所以服务端仍旧可以发送数据给客户端。服务端如果此时还有没发完的数据会继续发送，完毕后会向客户端发送连接释放请求，然后服务端便进入LAST-ACK状态。
       3. 客户端收到释放请求后，向服务端发送确认应答，此时客户端进入TIME-WAIT状态，在该状态时间段呢，若没有服务端的重发请求的话，就进入CLOSED状态。
       4. 当服务端收到确认应答后，也便进入CLOSED状态

16. 页面有多张图片，HTTP是怎样的加载表现

    在HTTP1下，浏览器对一个域名下最大TCP连接数为6，所以会请求多次。可以用多域名部署解决。这样可以提高同时请求的数目，加快页面图片的获取速度。

    在HTTP2下，可以一瞬间加载出来很多资源，因为，HTTP2支持多路复用，可以在一个TCP连接中发送多个HTTP请求。

17. HTTP2的头部压缩算法是怎么样的

    HTTP2的头部压缩是HPACK算法。在客户端和服务器两端建立“字典”，用索引号表示重复的字符串，采用哈夫曼编码来压缩整数和字符串，可以达到50%~90%的高压缩率。

    具体来说：

    * 在客户端和服务器端使用“首部表”来跟踪和存储之前发送的键值对，对于相同的数据，不再通过每次请求和响应发送；
    * 首部表在HTTP/2的连接存续期内始终存在，由客户端和服务器共同渐进地更新；
    * 每个新的首部键值对要么被追加到当前表的末尾，要么替换表中之前的值。

18. HTTP的请求报文是什么样的

    由4部分组成：

    * 请求行

      包括请求方法、URL、HTTP协议版本。他们用空格分隔，例如：`GET /index.html HTTP/1.1`

    * 请求头

      由关键字/值对组成，每行一对，关键字和值用英文冒号：分隔

      * User-Agent:浏览器类型
      * Accept:客户端可以识别的内容类型列表
      * Host:请求的主机名，允许多个域名同处一个IP地址，即虚拟主机

    * 空行

    * 请求体

      post、put等请求携带的数据

19. HTTP的响应报文是什么样的

    * 响应行：由网络协议版本，状态码和状态码含义组成，例如：`HTTP/1.1 200 OK`
    * 响应头：响应首部组成
    * 空行
    * 响应体：服务器响应的数据

20. HTTP协议的优点和缺点

    HTTP 是超文本传输协议，它定义了客户端和服务器之间交换报文的格式和方式，默认使用80端口，它使用TCP作为传输层协议，保证了数据传输的可靠性。

    优点：

    * 支持客户端/服务器模式
    * 简单快速：客户向服务器请求服务时，只需传送请求方法和路径。由于HTTP协议简单，使得HTTP服务器的程序规模小，因而通信速度很快。
    * 无连接：无连接就是限制每次连接只处理一个请求。服务器处理完客户的请求，并收到客户的应答后，即断开连接，采用这种方式可以节省传输时间。
    * 无状态：HTTP协议是无状态协议，这里的状态是指通信过程的上下文信息。缺少状态意味着如果后续处理需要前面的信息，则它必须重传，这样可能会导致每次连接传送的数据量增大。另一方面，在服务器不需要先前信息时它的应答就比较快
    * 灵活：HTTP允许传输任意类型的数据对象。正在传输的类型由Content-Type加以标记

    缺点：

    * 无状态：HTTP是一个无状态的协议，HTTP服务器不会保存关于客户的任何信息
    * 明文传输：协议中的报文使用的是文本形式，这就直接暴露给外界，不安全。
    * 不安全：
      1. 通信使用明文，内容可能会被窃听；
      2. 不验证通信方的身份，因此有可能遭遇伪装；
      3. 无法证明报文的完整性，所以有可能已遭篡改。

21. HTTP3.0

    HTTP3.0 的核心协议是由 Google 在 2015 年提出的，传统的 HTTP 协议是基于传输层TCP的协议，而HTTP3协议是基于传输层UDP上的协议，可以看成是：HTTP3.0基于UDP的安全可靠的HTTP2.0协议。

22. HTTP的两种连接模式

    HTTP协议是基于TCP/IP，并且使用了请求-应答的通信模式。

    HTTP协议有两种连接模式，一种是非持续连接，一种持续连接。（1）非持续连接指的是服务器必须为每一个请求的对象建立和维护一个全新的连接；（2）持续连接下，TCP连接默认不关闭，可以被多个请求复用。采用持续连接的好处是可以避免每次建立TCP连接三次握手时所花费的时间。

23. URL有哪些组成部分

    以下面的URL为例www.aspxfans.com:8080/news/index?ID=246188#name：

    * **协议部分：**该URL的协议部分为"http:"，这代表网页使用的是HTTP协议。在Internet中可以使用多种协议，如：HTTP，FTP等。在HTTP后面的//为分隔符；
    * **域名部分：**该URL的域名部分为www.aspxfans.com。一个URL中，也可以使用IP地址作为域名使用；
    * **端口部分：**跟在域名后面的是端口，域名和端口之间使用：作为分隔符。端口不是一个URL必须的部分，如果省略端口部分，将采用默认端口（HTTP默认是80，HTTPS是443）；
    * **虚拟目录部分：**从域名后的第一个 / 开始到 / 为止，是虚拟目录部分。虚拟目录也不是一个URL必须的部分。本例中的虚拟目录是”/news/“；
    * **文件名部分：**从域名后的最后一个 / 开始到 ? 为止，是文件名部分，如果没有 ? ，则是从域名后的最后一个 / 开始到 # 为止，是文件部分，如果没有 ？和 #，那么从域名后的最后一个 / 开始到结束，都是文件名部分。本例中的文件名是 index.asp。文件名部分也不是一个URL必须的部分，如果省略该部分，则使用默认的文件名；
    * **锚部分：**从 # 开始到最后，都是锚部分。本例中的锚部分是 name。锚部分也不是一个URL必须的部分；
    * **参数部分：**从 ？开始到 # 为止之间的部分为参数部分，又称搜索部分、查询部分。本例中的参数部分为“boardID=5&ID=24618&PAGE=1"。参数可以允许有多个参数，参数与参数之间用&作为分隔符。

24. 与缓存相关的HTTP请求头有哪些

    强缓存：

    * Expires
    * Cache-Control

    协商缓存：

    * Etag、If-None-Match
    * Last-Modified、If-Modified-Since

25. 强缓存和协商缓存

    1. **强缓存：**不会向服务器发送请求，直接从缓存中读取资源，在chrome控制台的Network选项中可以看到该请求返回200的状态码，并且size显示from disk cache或from memory cache两种（灰色表示缓存）。
    2. **协商缓存：**向服务器发送请求，服务器会根据这个请求的request header的一些参数来判断是否命中协商缓存，如果命中，则返回304状态码并带上新的response header通知浏览器从缓存中读取资源。

    > 共同点：都是从客户端缓存中读取资源；区别是强缓存不会发请求，协商缓存会发请求。

26. HTTP的keep-alive有什么作用？

    http1.0 默认关闭，需要手动开启；http1.1 后默认开启。

    作用：使客户端到服务器端的连接持续有效（长连接），当出现对服务器的后续请求时，keep-Alive 功能避免了建立或者重新建立连接。

    使用方法：在请求头中加上Connection: keep-alive。

    优点：

    * 较少的CPU和内存的占用（因为要打开的连接数变少了，复用了连接）
    * 减少了后续请求的延迟（无需再进行握手）

    缺点：本来可以释放的资源仍旧被占用。有的请求已经结束了，但是还一直连接着。

    解决方法：服务器设置过期时间和请求次数，超过这个时间或者次数就断掉连接。

27. OSI的七层模型是什么

    OSI在功能上可以划分为两组：

    网络群组：物理层、数据链路层、网络层

    使用者群组：传输层、会话层、表示层、应用层

    | #    | OSI 七层网络模型 | TCP/IP 四层概念模型 | 对应网络协议                                                 |
    | ---- | ---------------- | ------------------- | ------------------------------------------------------------ |
    | 7    | 应用层           | 应用层              | HTTP、RTSP、TFTP（简单文本传输协议）、FTP、NFS（数域筛法，数据加密）、WAIS（广域信息查询系统） |
    | 6    | 表示层           | 应用层              | Telnet（internet远程登录服务的标准协议）、Rlogin、SNMP（网络管理协议）、Gopher |
    | 5    | 会话层           | 应用层              | SMTP（简单邮件传输协议）、DNS（域名系统）                    |
    | 4    | 传输层           | 传输层              | TCP（传输控制协议）、UDP（用户数据报协议）                   |
    | 3    | 网络层           | 网际层              | ARP（地域解析协议）、RARP、AKP、UUCP（Unix to Unix copy）    |
    | 2    | 数据链路层       | 数据链路层          | FDDI（光纤分布式数据接口）、Ethernet、Arpanet、PDN（公用数据网）、SLIP（串行线路网际协议）PPP（点对点协议，通过拨号或专线方建立点对点连接发送数据） |
    | 1    | 物理层           | 物理层              | SMTP（简单邮件传输协议）、DNS（域名系统）                    |

    其中高层（7、6、5、4层）定义了应用程序的功能，下面三层（3、2、1层）主要面向通过网络的端到端的数据流。
