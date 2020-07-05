import {observe} from './index'
import { arrayMethods, observerArray, dependArray} from './arrary'
import Dep from './dep'
export function defineReactive(data, key, value) {
    // 如果value是一个对象，需要深度观察
    let childOb = observe(value)
    let dep = new Dep()
    Object.defineProperty(data, key, {
        get() {
            // console.log(Dep.target)
            if (Dep.target) {
                dep.depend(Dep.target)
                if(childOb) {
                    childOb.dep.depend()
                    dependArray(value)
                }
            }
            
            return value
        },
        set(newValue) { 
            if (newValue === value) return
            observe(newValue)
            // console.log('你设置数据了')
            value = newValue
            dep.notify()
        }
    })

}
class Observer {
    constructor(data) {
        this.dep = new Dep()
        Object.defineProperty(data, '__ob__', {
            get: () => this
        })
        if (Array.isArray(data)) {
            data.__proto__ = arrayMethods
            // 要观测数组里的每一项
            observerArray(data)
        } else {
            this.walk(data)
        }
    }
    walk(data) {
        let keys = Object.keys(data)
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i]
            let value = data[key]
            defineReactive(data, key, value)
        }
    }
}

export default Observer