import {h, render, patch} from './vdom'

let oldVnode = h('div', {id: 'container', class: 'container'},
    h('li', { style: {backgroundColor: 'red'}, key: 'a'}, 'a'),
    h('li', { style: {backgroundColor: 'blue'}, key: 'b'}, 'b'),
    h('li', { style: {backgroundColor: 'grey'}, key: 'c'}, 'c'),
    h('li', { style: {backgroundColor: 'grey'}, key: 'd'}, 'd'),
)

// patchVnode 用新的虚拟节点 和老的虚拟节点做对比， 更新真实的dom元素

let newVnode =  h('div', {id: 'aa', class: 'aa'},
h('li', { style: {backgroundColor: 'red'}, key: 'f'}, 'f'),
h('li', { style: {backgroundColor: 'blue'}, key: 'b'}, 'b'),
h('li', { style: {backgroundColor: 'grey'}, key: 'c'}, 'c'),
h('li', { style: {backgroundColor: 'grey'}, key: 'd'}, 'd'),


)

let container = document.querySelector('#app')
render(oldVnode, container)


setTimeout(()=> {
    patch(oldVnode, newVnode)
}, 3000)