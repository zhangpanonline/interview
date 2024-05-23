# 一、JavaScript中的 eval 方法是啥？一般什么场景下使用？

`eval` 是 `JavaScript` 中的一个全局函数，它将指定的字符串计算为 `JavaScript` 代码并执行它。

在现代 `JavaScript` 编程中，我们应该尽量避免使用 `eval`，之前所有使用 `eval` 的地方都有更好的方式来进行代替，所以在现代 `JavaScript` 编程中，`eval`没有什么使用场景存在，也就是说，并不存在某些场景必须要使用`eval`才能实现的。

`window.Function` 可以当做 `eval` 的替代方法。它创建一个新的 `Function` 对象。直接调用此构造函数可以动态创建函数，但会遇到和 `eval` 类似的安全问题和相对较小的性能问题。然而，与`eval`不同的是，`Function`构造函数创建的函数只能在全局作用域中运行。

\- EOF -