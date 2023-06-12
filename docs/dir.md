# 浏览器网络

<details>
    <summary>1. GET和POST的请求的区别</summary>
    <details>
    	<summary>应用场景</summary>
            (GET 请求是一个幂等的请求)一般 Get 请求用于对服务器资源不会产生影响的场景，比如说请求一个网页的资源。(而 Post 不是一个幂等的请求)一般用于对服务器资源会产生影响的情景，比如注册用户这一类的操作。（幂等是指一个请求方法执行多次和仅执行一次的效果完全相同）
    </details>
    <details>
    	<summary>是否缓存</summary>
            因为两者应用场景不同，浏览器一般会对 Get 请求缓存，但很少对 Post 请求缓存
    </details>
    <details>
    	<summary>传参方式不同</summary>
            Get 通过查询字符串传参，Post 通过请求体传参
    </details>
    <details>
    	<summary>安全性</summary>
             Get 请求可以将请求的参数放入 url 中向服务器发送，这样的做法相对于 Post 请求来说是不太安全的，因为请求的 url 会被保留在历史记录中
    </details>
    <details>
    	<summary>请求长度</summary>
             浏览器由于对 url 长度的限制，所以会影响 get 请求发送数据时的长度。这个限制是浏览器规定的，并不是 RFC 规定的
    </details>
    <details>
    	<summary>参数类型</summary>
             get参数只允许ASCII字符，post 的参数传递支持更多的数据类型(如文件、图片)
    </details>
</details>

<details>
    <summary>2. POST和PUT请求的区别</summary>
    <details>
    	<summary>PUT 请求：</summary>
        PUT请求是向服务器端发送数据，从而修改数据的内容，但是不会增加数据的种类等，也就是说无论进行多少次PUT操作，其结果并没有不同。（可以理解为时更新数据）
    </details>
    <details>
    	<summary>POST请求：</summary>
        POST请求是向服务器端发送数据，该请求会改变数据的种类等资源，它会创建新的内容。（可以理解为是创建数据）
    </details>
</details>

<details>
    <summary>3. 为什么post请求会发送两次请求?</summary>
    <p>
        1.第一次请求为options预检请求，状态码为:204	
    </p>	
	<p>
        作用：
    </p>
		<p>
            作用1: 询问服务器是否支持修改的请求头，如果服务器支持，则在第二次中发送真正的请求
    	</p>
		<p>
            作用2: 检测服务器是否为同源请求,是否支持跨域
    	</p>
	<p>
        2.第二次为真正的post请求
    </p>
</details>

<details>
    <summary>4. 常见的HTTP请求头和响应头</summary>
    <h5>HTTP Request Header</h5>
    <p>
        Accept：浏览器能够处理的内容类型
    </p>
    <p>
        Accept-Charset：浏览器能够显示的字符集
    </p>
    <p>
        Accept-Encoding：浏览器能够处理的压缩编码
    </p>
    <p>
        Accept-Language：浏览器当前设置的语言
    </p>
    <p>
        Connection：浏览器与服务器之间连接的类型
    </p>
    <p>
        Cookie：当前页面设置的任何 Cookie
    </p>
    <p>
        Host：发出请求的页面所在的域
    </p>
    <p>
        Referer：发出请求的页面的 URL
    </p>
    <p>
        User-Agent：浏览器的用户代理字符串
    </p>
    <h5>HTTP Responses Header</h5>
    <P>
        Date：表示消息发送的时间，时间的描述格式由rfc822定义
    </P>
    <p>
        server：服务器名称
    </p>
    <p>
        Connection：浏览器与服务器之间连接的类型
    </p>
    <p>
        Cache-Control：控制HTTP缓存
    </p>
    <p>
        content-type：表示后面的文档属于什么 MIME 类型
    </p>
    <h5>Content-Type</h5>
    <h6>常见的 Content-Type 属性值有以下四种：</h6>
    <p>
        1. application/x-www-form-urlencoded：浏览器的原生 from 表单，如果不设置 enctype 属性，那么最终就会以 application/x-www-form-urlencoded 方式提交数据。该种方式提交的数据放在 body 里面，数据按照 key1=val1&key2=val2 的方式进行编码，key 和 val 都进行了 URL 转码
    </p>
    <p>
        2. multipart/form-data：该种方式也是一个常见的 POST 提交方式，通常表单上传文件时使用该种方式
    </p>
    <p>
        3. application/json：服务器消息主体是序列化后的 JSON 字符串
    </p>
    <p>
        4. text/xml：该种方式主要用来提交 XML 格式的数据
    </p>
</details>
