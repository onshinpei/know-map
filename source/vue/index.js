import {initState} from './observe'
import { Watcher } from './observe/watcher'
import { render, patch, h} from './render/vdom'
function Vue(options) {
    this._init(options)
}

Vue.prototype._init = function (options) {
    let vm = this
    vm.$options = options

    // MVVM 初始化状态
    initState(vm)

    if (vm.$options.el) {
        vm.$mount()
    }
}

function query(el) {
    if (typeof el === 'string') {
        return document.querySelector(el)
    }

    return el
}

let defaultRE = /\{\{((?:.|\r?\n)+?)\}\}/g
const util = {
    getValue(vm, expr) {
        let keys = expr.split('.')
        return keys.reduce((memo, current) => {
            return memo[current]
        }, vm)
    },
    compilerText(node, vm) {
        if (!node.expr) {
            node.expr = node.textContent
        }
        node.textContent = node.expr.replace(defaultRE, function(...args) {
            return util.getValue(vm, args[1])
        })
    }
}

function compiler(node, vm) {
    let childNodes = node.childNodes
    Array.from(childNodes).forEach(child => {
        if (child.nodeType === 1) {
            compiler(child, vm)
        } else if (child.nodeType === 3) {
            util.compilerText(child, vm)
        }
    })
}

Vue.prototype._update = function(vnode) {
    // 用户传入的数据去更新
    // let vm = this
    // let el = vm.$el
    // let node = document.createDocumentFragment()
    // let firstChild
    // while(firstChild = el.firstChild) {
    //     // 每次拿到第一个元素就把这个元素放到文档碎片中
    //     node.appendChild(firstChild)
    // }
    // compiler(node, vm)
    // el.appendChild(node)
    let vm = this
    let el = vm.$el
    let preVnode = vm.preVnode
    if (!preVnode) {
        vm.preVnode = vnode
        vm.$el = render(vnode, el)
    } else {
        vm.$el = patch(preVnode, vnode)
    }
}
Vue.prototype._render = function() {
    let vm = this;
    let render = vm.$options.render
    let vnode = render.call(vm, h)
    return vnode
}
Vue.prototype.$mount = function() {
    let vm = this
    let el = vm.$options.el
    el = vm.$el = query(el) // 挂载的元素

    // watcher进行渲染
    // 渲染watcher
    // vue2.0 组件级更新
    let updateComponent = function () {
        vm._update(vm._render())
    }
    new Watcher(vm, updateComponent)

}

Vue.prototype.$watch = function (expr, handler, opts) {
    // 原理也是创建一个watcher
    new Watcher(this, expr, handler, Object.assign({user: true}, opts))

}

export default Vue