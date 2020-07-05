// 1. Promise 是一个类， 类中需要传入一个executor执行器，默认会立即执行

// 2. promise 内部会提供两个方法，可以更改promise的状态 3个状态: 等待 成功 失败
// resolve 触发成功（返回成功的内容），reject（失败的原因）
// 如果一旦promise成功就不会失败，失败的情况reject、抛出异常

// promise是为了解决异步问题的回调地狱， 并触发异步处理
// 每个promise实例都有一个then方法
const PENDING = 'PENDING'
const RESOLVED = 'RESOLVED'
const REJECTED = 'REJECTED'
class Promise {
    constructor(executor) {
        this.status = PENDING
        this.value = undefined
        this.reason = undefined
        // 成功的回调
        this.onResolvedCallbacks = []
        // 失败的回调
        this.onRejectedCallbacks = []
        // 保证只有状态是等待态的时候才能更改状态
        let resolve = (value) => {
            if (this.status === PENDING) {
                this.value = value
                this.status = RESOLVED
                this.onResolvedCallbacks.forEach(fn => fn())
            }
        }
        let reject = (reason) => {
            if (this.status === PENDING) {
                this.reason = reason
                this.status = REJECTED
                this.onRejectedCallbacks.forEach(fn => fn())
            }
        }
        try {
            executor(resolve, reject)
        } catch (e) {
            reject(e)
        }
    }
    // 发布订阅模式 支持一个promise调用多次
    then(onfulfilled, onrejected) {
        let promise2 = new Promise((resolve, reject) => {
            if (this.status === RESOLVED) {
                setTimeout(() => {
                    try {
                        let result = onfulfilled(this.value)
                        resolvePromise(promise2, result, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                }, 0)
               
            }
            if (this.status === REJECTED) {
                setTimeout(() => {
                    try {
                        let result = onrejected(this.reason)
                        resolvePromise(promise2, result, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                })
            }
            if (this.status === PENDING) {
                // 这是后 executor是肯定有异步逻辑
                this.onResolvedCallbacks.push(() => {
                    let result = onfulfilled(this.value)
                    resolvePromise(promise2, result, resolve, reject)
                })
                this.onRejectedCallbacks.push(() => {
                    try {
                        let result = onrejected(this.reason)
                        resolvePromise(promise2, result, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                })
            }
        })
        return promise2
    }
    finally(onFinally) {
        return this.then(value => Promise.resolve(onFinally(value)), reason => Promise.resolve(onFinally(reason)))
    }
    catch(onfulfilled) {
        return this.then(null, onfulfilled)
    }
    static resolve(value) {
        return new Promise((resolve, reject) => {
            resolve(value)
        })
    }
    static reject(reason) {
        return new Promise((resolve, reject) => {
            reject(reason)
        })
    }

    static defer() {
        let dfd = {}
        dfd.promise = new Promise(function (resolve, reject) {
          dfd.resolve = resolve;
          dfd.reject = reject;
        });
        return dfd;
      }

    static all(promises) {
        return new Promise((resolve, reject) => {
            let arr = []
            let idx = 0
            let processData = (value, index) => {
                idx ++
                if (idx === promises.length) {
                    resolve(arr);
                }
            }
            for ( let i = 0; i < promises.length; i++) {
                let curentValue = promises[i]
                if (curentValue && curentValue.then && typeof curentValue.value === 'function') {
                    curentValue.then(res => {
                        processData(res, i)
                    }, reject)
                } else {
                    processData(curentValue, i)
                }
                
            }
        })
    }
}

function resolvePromise(promise2, x, resolve, reject) {
    // 不能引用同一个对象，可能会造成死循环
    if (promise2 === x) {
        reject(new TypeError('循环引用'))
    }

    // 判断 x 类型
    if (typeof x === 'object' && x !== null || typeof x === 'function') {
        // 可能是promise promise要有then方法
        try {
            let then = x.then
            if (typeof then === 'function') {
                then.call(this, (y) => {
                    resolve(y)
                }, (r) => {
                    reject(r)
                })
            } else {
                resolve(x)
            }
        } catch (e) {
            reject(e)
        }
        
    } else {
        resolve(x)
    }
}

module.exports = Promise