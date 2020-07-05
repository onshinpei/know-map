const koa = require('koa')
const static = require('koa-static');
const path = require('path')
const router = require('koa-router')()
const cors = require('@koa/cors');


const app = new koa()
router.get('/promise_test', async (ctx, next) => {
    let {t=1} = ctx.query
    t = new Number(t)
    if (isNaN(t)) {
        t = 1
    }
    let result = await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(`${t} 完成`)
        }, t*1000)
    })
    ctx.body = result
})

app.use(async function(ctx, next) {
    console.log(ctx.request.originalUrl)
    await next()
})
app.use(router.routes())
app.use(cors());
app.use(static(path.join(__dirname, 'dist')))
app.use(static(path.join(__dirname, 'example')))
// 监听端口≈
app.listen(8090,function(){
    console.log('启动成功: http://localhost:8090');
});
