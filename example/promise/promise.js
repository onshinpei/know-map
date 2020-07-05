const PENDING = 'PENDINNG'
const RESOLVED = 'RESOLVED'
const REJECTED = 'REJECTED'

class Promise {
    constructor(executor) {
        this.status = PENDING

        this.value = undefined
        this.reason = undefined

        this.onResolvedCallbacks = []
        this.onRejectedCallbacks = []

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

    then(onfulfilled = data => data, onrejected = err => {throw new Error('err')}) {
        let promise2 = new Promise((resolve, reject) => {
            if (this.status === RESOLVED) {
                setTimeout(() => {
                    try {
                        let x = onfulfilled(this.value)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }

                }, 0)
                // resolve(x)
            }
            if (this.status === REJECTED) {
                setTimeout(() => {
                    try {
                        let x = onrejected(this.reason)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }

                }, 0)
            }
            if (this.status === PENDING) {
                this.onResolvedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onfulfilled(this.value)
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (e) {
                            reject(e)
                        }
    
                    }, 0)
                })

                this.onRejectedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onrejected(this.reason)
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (e) {
                            reject(e)
                        }
    
                    }, 0)
                })
            }
        })
       
        return promise2
    }

    finally(cb) {
        this.then((data) => {
            return Promise.resolve(cb()).then(() => data)
            // cb()
        }, (err) => {
            return Promise.resolve(cb()).then(() => {
                throw err
            })
        })
    }

    static resolve(value) {
        return new Promise(resolve => {
            resolve(value)
        })
    }

    static reject(reason) {
        return new Promise((resolve, reject) => {
            reject(reason);
        });
    }

    static deferred () {
        let defer = {}
        defer.promise = new Promise((resolve, reject) => {
            defer.resolve = resolve
            defer.reject = reject
        })

        return defer
    }

    static all(values) {
        return new Promise((resolve, reject) =>{
            let arr = []
            let index = 0

            function processData(key, value) {
                index++
                arr[key] = value
                if(index === values.length) {
                    resolve(arr)
                }
            }

            for(let i=0; i < values.length; i++) {
                let current = values[i]
                if (Promise.isPromise(current)) {
                    current.then(data => {
                        processData(i, data)
                    }, reject)
                } else {
                    processData(i, data)
                }
            }
        })
    }
    static race(promises) {
        return new Promise((resolve, reject) => {
            promises.forEach(promise => {
                promise.then(resolve, reject)
            })
        })
    }
    catch(onrejected) {
        return this.then(null, onrejected)
    }
    static isPromise(value) {
        if (typeof value === 'object' && value !== null || typeof value === 'function') {
            if (typeof value.then === 'function') {
                return true
            }
        }
        return false
    }
}

const resolvePromise = function (promise2, x, resolve, reject) {
    if (promise2 === x) {
        return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
    }
    if (typeof x === 'object' && typeof x !== null || typeof x === 'function') {
        let called; // 防止多次调用
        try {
            let then = x.then
            if (typeof then === 'function') {
                then.call(x, y => {
                    resolvePromise(promise2, y, resolve, reject) // 递归解析 返回值是promise
                }, z => {
                    if (called) {
                        return
                    }
                    called = true
                    reject(x)
                })
            } else {
                if (called) {
                    return
                }
                called = true
                resolve(x)
            }
        } catch (e) {
            if (called) {
                return
            }
            called = true
            reject(e)
        }

    } else {
        resolve(x)
    }
}


module.exports = Promise