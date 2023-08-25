/* eslint-disable no-extend-native */
/* eslint-disable no-constant-condition */
/* eslint-disable no-unused-vars */

// 1. Object.create() 静态方法以一个现有对象作为原型，创建一个新对象
function create(obj) {
  function F() { }
  F.prototype = obj
  return new F()
}

// 2. instanceof 运算符用于检测构造函数的 prototype 属性是否出现在某个实例对象的原型链上
function myInstanceof(left, right) {
  let proto = Object.getPrototypeOf(left)
  const prototype = right.prototype
  while (true) {
    if (!proto) return false
    if (proto === prototype) return true
    proto = Object.getPrototypeOf(proto)
  }
}

// 3. new 运算符创建一个用户定义的对象类型的实例或具有构造函数的内置对象的实例
//  1. 创建一个空的简单 JavaScript 对象（即 {}）
//  2. 为步骤 1 新创建的对象添加属性 __proto__，将该属性链接至构造函数的原型对象
//  3. 将步骤 1 新创建的对象作为 this 的上下文
//  4. 如果该函数没有返回对象，则返回 this
function myNew(fn, ...args) {
  const obj = Object.create(fn.prototype)
  const result = fn.apply(obj, args)
  return result instanceof Object ? result : obj
}

// 4.1 一个 Promise 是一个代理，它代表一个在创建 promise 时不一定已知的值
class MyPromise {
  constructor(fn) {
    this.queues = []
    const resolve = value => {
      if (this.queues.length) {
        const cb = this.queues.shift()
        cb(value)
      }
    }
    fn(resolve)
  }
  then(onFulfilledCb) {
    return new MyPromise(resolve => {
      this.queues.push(value => {
        const res = onFulfilledCb(value)
        if (res instanceof MyPromise) {
          res.then(resolve)
        } else {
          resolve(res)
        }
      })
    })
  }
}
// 4.2 Promise.all
MyPromise.all = function(promisesList) {
  return new MyPromise((resolve, reject) => {
    if (!promisesList.length) return resolve([])
    const arr = []; let count = 0
    for (let i = 0, len = promisesList.length; i < len; i++) {
      const promise = promisesList[i]
      Promise.resolve(promise).then(result => {
        count++
        arr[i] = result
        if (count === len) resolve(arr)
      }).catch(err => reject(err))
    }
  })
}
// 4.3 Promise.race
MyPromise.race = function(promisesList) {
  return new MyPromise((resolve, reject) => {
    for (const promise of promisesList) {
      promise.then(resolve, reject)
    }
  })
}

// 5. 防抖和节流
// 防抖
function debounce(fn, time) {
  let timer
  return function(...arg) {
    timer && clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, arg)
    }, time)
  }
}
// 节流
function throttle(fn, time) {
  let timer = Date.now()
  return function(...arg) {
    const newTimer = Date.now()
    if (newTimer - timer >= time) {
      fn.apply(this, arg)
      timer = Date.now()
    }
  }
}
// 6. call() 方法使用一个指定的 this 值和单独给出的一个或多个参数来调用一个函数
Function.prototype.myCall = function(ctx, ...args) {
  if (typeof this !== 'function') {
    throw new Error('type error')
  }
  ctx = ctx || window
  ctx.__fn = this
  const result = ctx.__fn(...args) || undefined
  delete ctx.__fn
  return result
}

// 7. apply() 方法调用一个具有给定 this 值的函数，以及以一个数组（或一个类数组对象）的形式提供的参数。
Function.prototype.myApply = function(ctx, args) {
  if (typeof this !== 'function') {
    throw new Error('type error')
  }
  ctx = ctx || window
  ctx.__fn = this
  if (args) {
    const result = ctx.__fn(...args)
    delete ctx.__fn
    return result
  } else {
    const result = ctx.__fn()
    delete ctx.__fn
    return result
  }
}

// 8. bind() 方法创建一个新的函数，在 bind() 被调用时，这个新函数的 this 被指定为 bind() 的第一个参数，而其余参数将作为新函数的参数，供调用时使用。
Function.prototype.myBind = function(ctx, ...args) {
  if (typeof this !== 'function') {
    throw new Error('type error')
  }
  return function() {
    return this.apply(ctx, ...args)
  }
}

// 9. 函数柯里化指的是一种将使用多个参数的一个函数转换成一系列使用一个参数的函数的技术
function curry(fn, ...rest) {
  // return fn.length <= rest.length ? fn(...rest) : curry.bind(null, fn, ...rest)
  if (fn.length <= rest.length) {
    console.log(rest)
    return fn(...rest)
  } else {
    console.log(...rest)
    return curry.bind(null, fn, ...rest)
  }
}

// 10. 手写AJAX请求
const xhr = new XMLHttpRequest()
xhr.open('GET', 'http://10.10.22.232:8888/1/2/?u=u&a=a', true)
xhr.onreadystatechange = function () {
  if (this.readyState !== 4) return
  if (this.status === 200) {
    console.log(this.response)
  } else {
    console.error(this.statusText)
  }
}
xhr.onerror = function () {
  console.error(this.statusText)
}
xhr.responseType = 'json'
xhr.setRequestHeader('Accept', 'application/json')
xhr.send(null)

// 11. 使用Promise封装AJAX请求
function getJson(url) {
  return new Promise(function (resolve, reject) {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.onreadystatechange = function () {
      if (this.readyState !== 4) return
      if (this.status === 200) {
        resolve(this.response)
      } else {
        reject(new Error(this.statusText))
      }
    }
    xhr.onerror = function () {
      reject(new Error(this.statusText))
    }
    xhr.responseType = 'json'
    xhr.setRequestHeader('Accept', 'application/json')
    xhr.send(null)
  })
}

// 12. 手写深拷贝
function deepCopy(obj) {
  if (!(obj instanceof Object)) return obj
  if (Array.isArray(obj)) {
    return obj.map(item => deepCopy(item))
  } else {
    const result = {}
    for (let k in obj) {
      result[k] = deepCopy(obj[k])
    }
    return result
  }
}

// 13. 手写打乱数组顺序的方法
function randomArr() {
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  for (let i = 0; i < arr.length; i++) {
    let randomInd = Math.round(Math.random() * (arr.length - 1 - i)) + i;
    [arr[i], arr[randomInd]] = [arr[randomInd], arr[i]]
  }
  console.log(arr)
}

// 14. 实现数组扁平化

