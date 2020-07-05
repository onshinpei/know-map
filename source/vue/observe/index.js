import Observer from './observer'
import { Watcher } from './watcher'
import Dep from './dep'
export function initState(vm) {
    let opts = vm.$options
    if (opts.data) {
        initData(vm)
    }
    if (opts.computed) {
        initComputed(vm, opts.computed)
    }
    if (opts.watch) {
        initWatch(vm)
    }
    
}

export function observe(data) {
    if (typeof data !== 'object' || data === null) {
        return  //不走
    }
    return new Observer(data)
}
function proxy(vm, source, key) {
    Object.defineProperty(vm, key, {
        get() {
            return vm[source][key]
        },
        set(newValue) {
            vm[source][key] = newValue
        }
    })
}
function initData(vm) { // 将用户传入的数据，通过object.defineProperty重新定义
    let data = vm.$options.data
    data = vm._data = typeof data === 'function' ? data.call(vm): data || {}
    for (let key in data) {
        proxy(vm, '_data', key)
    }
    observe(vm._data)
}

function createComputedGetter(vm, key) {
    let watcher = vm._watchersComputed[key]
    return function () {
        // 如果dirty 是false的话，不需要重新执行计算属性中的方法
        if (watcher.dirty) { // 如果页面取值， 而且dirty是true 就会调用watcher的get方法
            watcher.evaluate()
            if (Dep.target) {
                watcher.depend()
            }
            return watcher.value
        }
    }
}

// 计算属性 特点 默认不执行，等用户取值的时候再执行，会缓存取值的结果
// 如果依赖的值发生变化了， 会更新dirty属性， 再次取值时， 可以重新求新值

// watch方法 不能用在模板里， 监控的逻辑都放在watch中求值
// watcher 三类 渲染watcher 用户watcher 计算属性watcher
function initComputed(vm, computed) {
    let watchers = vm._watchersComputed = Object.create(null)
    for (let key in computed) { // 
        // 此时什么都不做
        let def = computed[key]
        watchers[key] = new Watcher(vm, def, ()=> {}, {lazy: true})  // lazy 表示是计算属性watcher， 默认刚开始不会执行
        Object.defineProperty(vm, key, {
            get: createComputedGetter(vm, key)
        })
    }
}

function createWatcher(vm, key, handler, opts) {
    return vm.$watch(key, handler, opts)
}
function initWatch(vm) {
    let watch = vm.$options.watch
    for (let key in watch) {
        let userDef = watch[key]
        let handler = userDef
        if (userDef.handler) {
            handler = userDef.handler
        }
        createWatcher(vm, key, handler, {immediate: userDef.immediate})
    }
}
