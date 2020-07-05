let id = 0
export class Dep {
    constructor() {
        this.id = id++
        this.subs = []
    }

    addSub(watcher) {
        this.subs.push(watcher)
    }
    depend() {
        if (Dep.target) {
            Dep.target.addDep(this)
        }
    }
    notify() {
        this.subs.forEach(watcher => watcher.update())
    }
}
let stack = []
// 用来保存当前的watcher
export function pushTarget(watcher) {
    Dep.target = watcher
    stack.push(watcher)
}

export function popTarget() {
    stack.pop()
    Dep.target = stack[stack.length - 1]
}

export default Dep