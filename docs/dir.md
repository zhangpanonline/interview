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

