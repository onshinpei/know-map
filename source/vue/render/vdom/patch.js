export function render(vnode, container) {
    let el = createElm(vnode)
    container.appendChild(el)
    return el
}

// 创建真实节点
function createElm(vnode) {
    let { tag, children, key, props, text} = vnode
    if (typeof tag === 'string') {
        //元素
        vnode.el = document.createElement(tag)
        updateProperties(vnode)
        children.forEach(child => {
            render(child, vnode.el)
        })
    } else {
        // 文本
        vnode.el = document.createTextNode(text)
    }
    return vnode.el
}

function updateProperties(vnode, oldProps={}) {
    let {props} = vnode
    let el = vnode.el
    for (let key in props) {
        if (key === 'style') {
           for( let styleName in props.style) {
               el.style[styleName] = props.style[styleName]
           }
        } else {
            el.setAttribute(key, props[key])
        }
    }
}

export function patch(oldVnode, newVnode={}) {
    // 1, 先比对标签一样不一样
    if (oldVnode.tag !== newVnode.tag) {
        oldVnode.el.parentNode.replaceChild(createElm(newVnode), oldVnode.el)
    }
    if (!oldVnode.tag) {
        if (oldVnode.text !== newVnode.text) {
            oldVnode.el.textContent = newVnode.text
        }
    }

    // 标签一样复用
    let el = newVnode.el = oldVnode.el
    updateProperties(newVnode, oldVnode.props) // 做属性对比

    // 比较孩子
    let oldChildren = oldVnode.children || []
    let newChildren = newVnode.children || []

    if (oldChildren.length && newChildren.length) {
        updateChildren(el, oldChildren, newChildren)
    } else if (oldChildren.length) { // 老的有孩子， 新的没有
        el.innerHTML = ''
    } else { // 新的有
        for( let i = 0 ; i < newChildren.length; i++) {
            let child = newChildren[i]
            el.appendChild(createElm(child))
        }
    }
    return el
}
function isSameNode(oldStartVnode, newStartVnode) {
    return (oldStartVnode.tag === newStartVnode.tag) && (oldStartVnode.key === newStartVnode.key)
}
function updateChildren(parent, oldChildren, newChildren) {
    let oldStartIndex = 0
    let oldStartVnode = oldChildren[oldStartIndex]
    let oldEndIndex = oldChildren.length - 1
    let oldEndVnode = oldChildren[oldEndIndex]

    let newStartIndex = 0
    let newStartVnode = newChildren[newStartIndex]
    let newEndIndex = newChildren.length - 1
    let newEndVnode = newChildren[newEndIndex]

    function makeIndexByKey(children) {
        let map = {}
        children.forEach((item, index) => {
            map[item.key] = index
        })
        return map
    }
    let map = makeIndexByKey(oldChildren)
    while(oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
        if (!oldStartVnode) {
            oldStartVnode = oldChildren[++oldStartIndex]
        } else if (!oldEndVnode) {
            oldEndVnode = oldChildren[--oldEndIndex]
        } else if (isSameNode(oldStartVnode, newStartVnode)) {
            patch(oldStartVnode, newStartVnode)
            oldStartVnode = oldChildren[++oldStartIndex]
            newStartVnode = newChildren[++newStartIndex]
        } else if (isSameNode(oldEndVnode, newEndVnode)) {
            patch(oldEndVnode, newEndVnode)
            oldEndVnode = oldChildren[--oldEndIndex]
            newEndVnode = newChildren[--newEndIndex]
        } else if (isSameNode(oldStartVnode, newEndVnode)) {
            patch(oldStartVnode, oldStartVnode)
            parent.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling)
            oldStartVnode = oldChildren[++oldStartIndex]
            newEndVnode = newChildren[--newEndIndex]
        } else if (isSameNode(oldEndVnode, newStartVnode)) {
            patch(oldEndVnode, newStartVnode)
            parent.insertBefore(oldEndVnode.el, oldStartVnode.el)
            oldEndVnode = oldChildren[--oldEndIndex]
            newStartVnode = newChildren[++newEndIndex]
        } else {
            // 两个列表乱序
            // 会先拿新节点的第一项去和老节点中匹配，如果匹配不到直接将节点插入到开始指针前面
            // 可能老节点中还有剩余， 则直接删除老节点中剩余的属性
            let moveIndex = map[newStartVnode.key]
            if (moveIndex === undefined) {
                parent.insertBefore(createElm(newStartVnode), oldStartVnode.el)
            } else {
                let movenode = oldChildren[moveIndex]
                if (!movenode) {
                    debugger
                }
                patch(movenode, newStartVnode)
                oldChildren[moveIndex] = undefined
                parent.insertBefore(movenode.el, oldStartVnode.el)
            }
            // oldStartVnode = oldChildren[++oldStartIndex]
            newStartVnode = newChildren[++newStartIndex]
        }
    }
    if (newStartIndex <= newEndIndex) {
        for(let i = newStartIndex; i <= newEndIndex; i++) {
            // 可能是往前插入
            // insertBefor(插入元素, null) = appendChild
            let ele = newChildren[newEndIndex + 1] ? newChildren[newEndIndex + 1].el : null

            parent.insertBefore(createElm(newChildren[i]), ele)
        }
    } else if (oldStartIndex <= oldEndIndex) {
        for(let i = oldStartIndex; i <= oldEndIndex; i++) {
            let child = oldChildren[i]
            if (child) {
                parent.removeChild(child.el)
            }
        }
    }
}