import {pushTarget, popTarget} from './dep'
import {util} from '../util'
let id = 0
export class Watcher {
    /**
     * 
     * @param {*} vm 
     * @param {*} exprOrFn // 可能是一个表达式或者一个函数
     * @param {*} cb // 回调
     * @param {*} opts // 其他参数
     */
    constructor(vm, exprOrFn, cb=()=> {}, opts={}) {
        this.vm = vm
        this.exprOrFn = exprOrFn
        if (typeof exprOrFn === 'function') {
            this.getter = exprOrFn
        } else {
            this.getter = function () {
                return util.getValue(vm, exprOrFn)
            }
        }
        if (opts.user) {
            this.user = true
        }
        this.lazy = opts.lazy
        this.dirty = this.lazy
        this.cb = cb
        this.deps = []
        this.depsId = new Set()
        this.opts = opts
        this.id = id++
        this.immediate = opts.immediate
        // 如果当前是计算属性的话，不进行计算
        this.value = this.lazy ? undefined : this.get()
        if (this.immediate) {
            this.cb(this.value)
        }
    }

    get() {
        pushTarget(this)
        let value = this.getter.call(this.vm)
        popTarget()
        return value
    }
    evaluate() {
        this.value = this.get()
        this.dirty = null
    }
    addDep(dep) {
        let id = dep.id
        if (!this.depsId.has(id)) {
            this.depsId.add(id)
            this.deps.push(dep)
            dep.addSub(this)
        }
    }
    depend() {
        let i = this.deps.length
        while(i--) {
            this.deps[i].depend()
        }
    }
    update() {
        if (this.lazy) {
            this.dirty = true // 计算你属性依赖发生变化
        } else {
            queueWatcher(this)
        }
        // this.getter()
    }
    run() {
        let value = this.get()
        if (this.value !== value) {
            this.cb(value, this.value)
        }
        this.value = value
    }
}
let has = {}
let queue = []
function flushQueue() {
    queue.forEach(watcher => watcher.run())
    has = {}
    queue = []
}
function queueWatcher(watcher) {
    let id = watcher.id
    if (!has[id]) {
        has[id] = true
        queue.push(watcher)
        nextTick(flushQueue, 0) // 异步方法会等同步方法执行完成后执行
    }
}


let callbacks = []
function flushCallbacks() {
    callbacks.forEach(cb => cb())
}

function nextTick(cb) {
    callbacks.push(cb)
    let timerFunc = () => {
        flushQueue()
    }
    if (Promise) {
        Promise.resolve().then(timerFunc)
    } else if (MutationObserver) {
        let observer = new MutationObserver(timerFunc)
        let textNode = document.createTextNode(1)
        observer.observe(textNode, {characterData: true})
        textNode.textContent = 2 // 文本变了会执行timerFun
    } else if(setImmediate) {
        setImmediate(timerFunc)
    } else {
        setTimeout(timerFunc, 0)
    }

}