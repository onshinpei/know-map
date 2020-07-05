export const util = {
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
