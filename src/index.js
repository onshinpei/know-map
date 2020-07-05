import Vue from 'vue'

// require('../source/vue/render')
let vm = new Vue({
    el: '#app',
    data() {
        return {
            msg: 3,
            school: {
                name: '一种',
                age: 30
            },
            arr: [1,2,3],
            firstname: '温',
            lastername: '新平'
        }
    },
    render(h) {
        return h('div', {id: 'ddd'}, this.msg)
    },
    watch: {
        msg: {
            handler() {
                console.log('更新')
            }
        }
    },
    computed: {
        name() {
            return this.firstname + this.lastername
        }
    }
})

window.vm = vm