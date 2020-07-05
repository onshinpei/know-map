// 有10个请求，并发只能最大为三个，怎么去实现

var queue = []
for (let i = 0; i < 10; i++) {
    queue.push(function() {
        return axios.get(`http://localhost:8090/promise_test?t=${Math.random()}`)
    })
}
Promise.limitAll = function(excutors, maxlimit) {
    let values = []
    let excutors_length = excutors.length
    index = 0
    function start_excutor(now_excutor, resolve) {
        now_excutor.index = index++
        return now_excutor().then(res=> res, err=> err).then(res=> {
            values[now_excutor.index] = res.data
            if (values.length === excutors_length) {
                resolve(values)
            }
            // debugger
            if (excutors.length) {
                start_excutor(excutors.splice(0,1)[0], resolve)
            }
            
        })
    }

    return new Promise((resolve, reject) => {
        let now_excutors = excutors.splice(0, maxlimit)
        for(let i = 0; i < now_excutors.length; i++) {
            let now_excutor = now_excutors[i]
            start_excutor(now_excutor,resolve)
        }
    })

}

Promise.limitAll(queue, 3).then(res=> {
    console.log(res)
})