class Compile {
    constructor(el, vm) {
        // 获取DOM节点
        this.el = this.isElementNode(el) ? el : document.querySelector(el);
        this.vm = vm

        if (this.el) {
            // 1、把这些真实的 Dom 移动到内存中，即 fragment（文档碎片）
            let frament = this.node2fragment(this.el);
            this.compile(frament)
            this.el.appendChild(frament)
        }
    }
    // 判断是否是元素节点
    isElementNode(node) {
        return node.nodeType === 1
    }

    node2fragment(el) {
        // 创建文档碎片
        let frament = document.createDocumentFragment()

        // 第一个子节点
        let firstChild
        while (firstChild = el.firstChild) {
            frament.appendChild(firstChild)
        }

        return frament
    }

    /************** 新增代码 ******************/
    // 解析文档碎片
    // 判断属性是否为指令
    isDirective(name) {
        return name.includes("v-")
    }

    compile(fragment) {
        // 获取子节点
        let childNodes = fragment.childNodes

        childNodes.forEach(node => {
            if (this.isElementNode(node)) { // 元素节点
                // 循环遍历
                this.compile(node)
                this.compileElement(node)
            } else {
                this.compileText(node)
            }
        })
    }

    compileText(node) {
        let expr = node.textContent
        let reg = /\{\{([^}]+)\}\}/
        if (reg.test(expr)) {
            CompileUtil['text'](node, this.vm, expr)
        }
    }

    compileElement(node) {
        let attrs = node.attributes
        Array.from(attrs).forEach(attr => {
            // 获取属性名，判断属性是否为指令，即含 v-
            let attrName = attr.name

            if (this.isDirective(attrName)) {
                // 如果是指令，取到该属性值得变量在 data 中对应得值，替换到节点中
                let exp = attr.value
                let type = attrName.slice(2)

                // 调用指令对应的方法
                CompileUtil[type](node, this.vm, exp)
            }
        })
    }
}

const CompileUtil = {
    getVal(vm, exp) {
        exp = exp.trim()
        exp = exp.split('.')
        let value = exp.reduce((prev, next) => {
            return prev[next]
        }, vm.$data)

        return value
    },
    setVal (vm, exp, newVal) {
        exp = exp.split(".");
        return exp.reduce((prev, next, currentIndex) => {
            // 如果当前归并的为数组的最后一项，则将新值设置到该属性
            if(currentIndex === exp.length - 1) {
                return prev[next] = newVal;
            }
    
            // 继续归并
            return prev[next];
        }, vm.$data);
    },

    getTextVal(vm, exp) {
        return exp.replace(/\{\{(([^}]+))\}\}/g, (...arguments) => {
            return this.getVal(vm, arguments[1])
        })
    },
    // v-model
    model(node, vm, exp) {
        let updateFn = this.updater.modelUpdater

        // 获取 data 中对应的变量的值
        let value = this.getVal(vm, exp);
        new Watcher(vm, exp, (newValue) => {
            updateFn && updateFn(node, newValue)
        })
        // v-model 双向数据绑定，对 input 添加事件监听
        node.addEventListener('input', e => {
            // 获取输入的新值
            let newValue = e.target.value;

            // 更新到节点
            this.setVal(vm, exp, newValue);
        });

        updateFn && updateFn(node, value)
    },

    text(node, vm, exp) {
        let updateFn = this.updater.textUpdater
        // 获取 data 中对应的变量的值
        let value = this.getTextVal(vm, exp)
        // 通过正则替换，将取到数据中的值替换掉 {{ }}
        exp.replace(/\{\{(([^}]+))\}\}/g, (...arguments) => {
            // 解析时遇到了模板中需要替换为数据值的变量时，应该添加一个观察者
            new Watcher(vm, arguments[1].trim(), (newValue) => {
                // 更新
                updateFn && updateFn(node, newValue)
            })
        })
        updateFn && updateFn(node, value)
    },

    updater: {
        textUpdater(node, value) {
            node.textContent = value
        },
        modelUpdater(node, value) {
            node.value = value
        }
    }
}
