const koa = require('koa')
const static = require('koa-static');
const path = require('path')

const app = new koa()

app.use(static(path.join(__dirname, 'dist')))
// 监听端口≈
app.listen(8090,function(){
    console.log('启动成功: http://localhost:8090');
});
