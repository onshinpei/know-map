let Promise = require('./promise')

// let p = new Promise((resolve, reject) => {
//     resolve(3)
// //    throw new Error(3)
// }).then((res) => {
//     console.log(res)
//     return 300
// }, err => {
//     console.error(err)
//     return 400
// }).then(res => {
//     console.log(res)
// }, err => {
//     console.error(err)
// })

// let promise2 = p.then(data => {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             reject('hello')
//         }, 1000)
//     })
// })


let promise1 = new Promise((reslove, reject) => {
    setTimeout(() => {
        reslove(1)
    }, 1000)
})

let promise2 = new Promise((reslove, reject) => {
    setTimeout(() => {
        reslove(3)
    }, 3000)
    throw new Error('1')
}).then(() => {
    // throw new Error('1')
}, err=> {
    console.log({type: 1, err})
}).catch(err=> {
    console.error(err)
})

// Promise.all([promise1, promise2]).then(res => {
//     console.log(res)
// })

