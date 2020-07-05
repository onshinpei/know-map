// 1. Promise 是一个类， 类中需要传入一个executor执行器，默认会立即执行

// 2. promise 内部会提供两个方法，可以更改promise的状态 3个状态: 等待 成功 失败
// resolve 触发成功（返回成功的内容），reject（失败的原因）
// 如果一旦promise成功就不会失败，失败的情况reject、抛出异常

// promise是为了解决异步问题的回调地狱， 并触发异步处理

const Promise = require('./promise')


Promise.resolve().then(res=> {
    return 3
}).then(res=> {
    new Error()
}).finally(function() {
    console.log('finaly')
})