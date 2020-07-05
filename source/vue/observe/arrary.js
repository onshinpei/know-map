import { observe } from "."

// push shift unshift pop reverse sort splice

let oldArrayProtoMethods = Array.prototype

export let arrayMethods = Object.create(oldArrayProtoMethods)
let methods = [
    'push',
    'pop',
    'shift',
    'unshift',
    'sort',
    'reverse',
    'splice'
]

export function observerArray(inserted) {
    for(let i = 0; i < inserted.length; i++) {
        observe(inserted[i])
    }
}

// 递归收集数组中的依赖
export function dependArray(value) {
    for (let i = 0; i < value.length; i++) {
        let currentItem = value[i]
        currentItem.__ob__ && currentItem.__ob__.dep.depend()
        if (Array.isArray(currentItem)) {
            dependArray(currentItem)
        }
    }
}

methods.forEach(method => {
    arrayMethods[method] = function (...args) {
        let r = oldArrayProtoMethods[method].apply(this, args)
        // todo
        let inserted
        switch (method) {
            case 'push':
            case 'unshift':
                inserted = args
                break;
        
            case 'splice':
                inserted = args.slice(2)
                break;
            default:
                break
        }
        if (inserted) {
            observerArray(inserted)
        }
        this.__ob__.dep.notify()
        return r
    }
})