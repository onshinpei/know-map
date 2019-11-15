# 性能优化

## 前言

虽然前端开发作为 GUI 开发的一种,但是存在其特殊性,前端的特殊性就在于“动态”二字，传统 GUI 开发，不管是桌面应用还是移动端应用都是需要预先下载的,只有先下载应用程序才会在本地操作系统运行,而前端不同,它是“动态增量”式的,我们的前端应用往往是实时加载执行的,并不需要预先下载,这就造成了一个问题,前端开发中往往最影响性能的不是什么计算或者渲染,而是加载速度,加载速度会直接影响用户体验和网站留存。

《`Designing for Performance`》的作者 `Lara Swanson`在2014年写过一篇文章《Web性能即用户体验》，她在文中提到“网站页面的快速加载，能够建立用户对网站的信任，增加回访率，大部分的用户其实都期待页面能够在`2`秒内加载完成，而当超过`3`秒以后，就会有接近`40%`的用户离开你的网站”。

值得一提的是,GUI 开发依然有一个共同的特殊之处,那就是`体验性能`,体验性能并不指在绝对性能上的性能优化,而是回归用户体验这个根本目的,因为在 GUI 开发的领域,绝大多数情况下追求绝对意义上的性能是没有意义的.

比如一个动画本来就已经有`6` 帧了,你通过一个吊炸天的算法优化到了`120`帧,这对于你的 KPI 毫无用处,因为这个优化本身没有意义,因为除了少数特异功能的异人,没有人能分得清`60`帧和`120`帧的区别,这对于用户的体验没有任何提升,相反,一个首屏加载需要 4s 的网站,你没有任何实质意义上的性能优化,只是加了一个设计姐姐设计的`loading`图,那这也是十分有意义的优化,因为好的 loading 可以减少用户焦虑,让用户感觉没有等太久,这就是用户体验级的性能优化.

说到性能优化，可能第一印象就觉得这只是前端的事情，其实这不仅仅是前端的工作，后端也是紧密相连，大家应该知道著名的**雅虎军规**，那么我们就结合这些军规谈谈性能优化的那点事

::: tip 雅虎军规

1. 尽量减少`HTTP`请求数
2. 减少`DNS`查找
3. 避免重定向
4. 让`Ajax`可缓存
5. 延迟加载组件
6. 预加载组件
7. 减少`DOM`元素的数量
8. 跨域分离组件
9. 尽量少用`iframe`
10. 杜绝`404`
11. 避免使用CSS表达式
12. 选择`<link>`舍弃`@import`
13. 避免使用滤镜
14. 把样式表放在顶部
15. 去除重复脚本
16. 尽量减少DOM访问
17. 用智能的事件处理器
18. 把脚本放在底部
19. 把`JavaScript`和`CSS`放到外面
20. 压缩`JavaScript`和`CSS`
21. 优化图片
22. 优化`CSS Sprite`
23. 不要用HTML缩放图片
24. 用小的可缓存的`favicon.ico`（P.S. 收藏夹图标）
25. 给`Cookie`减肥
26. 把组件放在不含`cookie`的域下
27. 保证所有组件都小于`25K`
28. 把组件打包到一个复合文档里
29. `Gzip`组件
30. 避免图片`src`属性为空
31. 配置`ETags`
32. 对`Ajax`用`GET`请求
33. 尽早清空缓冲区
34. 使用`CDN`（内容分发网络）
35. 添上`Expires`或者`Cache-Control` HTTP头
:::
了解[雅虎军规](https://www.cnblogs.com/xianyulaodi/p/5755079.html)

下面我总结了一些常用的手段去优化我们的资源

## 压缩合并

对于**前端性能优化**自然要关注`首屏`打开速度，而这个速度，很大因素是花费在网络请求上，那么怎么减少网络请求的时间呢？

- 尽量减少`HTTP`请求数
- 压缩`JavaScript`和`CSS`
- 使用`CDN`（内容分发网络
- webpack打包开启Gzip
- CSS Sprite

`CSS Spirite`就是把一些小图用 PS 合成一张图，用 css 定位显示每张图片的位置

``` css
.top_right .phone {
    background: url(../images/top_right.png) no-repeat 7px -17px;
    padding: 0 38px;
}

.top_right .help {
    background: url(../images/top_right.png) no-repeat 0 -47px;
    padding: 0 38px;
}
```

所以`压缩`、`合并` 就是一个解决方案，当然目前较多使用`webpack`等构建工具 压缩、合并。开启方式，在脚手架中修改配置文件：`/config/index.js`

```js
// 生产模式
build: {
  productionGzip: true // 开启Gzip压缩
}
```

同时服务端`nginx`加入配置项

``` shell
gzip on;
gzip_min_length 1k;
gzip_buffers 4 16k;
gzip_comp_level 6;
gzip_types application/javascript text/plain application/x-javascript text/css application/xml text/javascript application/json;
gzip_vary on;
```

nginx开起Gzip前
![gzip1](../images/frontendo/1.png)

nginx开启GZIP后
![gzip2](../images/frontendo/2.png)
![gzip3](../images/frontendo/3.png)

很明显后者文件大小明显比前面小很多

## 优化请求方式

- 静态资源走不同域名
- 开启http2

在非http2中，由于浏览器限制，同一个域名TCP链接的数量有限，所有当该域名的请求值到达最大值时，将无法建立新的链接，必须等待前面的请求完成，所有当放在不同的域名下时，这个问题就迎刃而解了

说到http2,我就来普及下http2了

::: tip HTTP2是什么：
HTTP2.0可以说是SPDY的升级版（其实原本也是基于SPDY设计的），但是，HTTP2.0 跟 SPDY 仍有不同的地方，主要是以下两点

- HTTP2.0 支持明文`HTTP`传输，而`SPDY`强制使用`HTTPS`
- HTTP2.0 消息头的压缩算法采用`HPACK`，而非`SPDY`采用的`DEFLATE`

**HTTP2新特性**:

- **新的二进制格式（`Binary Format`）**: HTTP1.x的解析是基于文本。基于文本协议的格式解析存在天然缺陷，文本的表现形式有多样性，要做到健壮性考虑的场景必然很多，二进制则不同，只认0和1的组合。基于这种考虑HTTP2.0的协议解析决定采用二进制格式，实现方便且健壮

- **多路复用（`MultiPlexing`）**: 即连接共享，即每一个request都是是用作连接共享机制的。一个request对应一个id，这样一个连接上可以有多个request，每个连接的request可以随机的混杂在一起，接收方可以根据request的 id将request再归属到各自不同的服务端请求里面。多路复用原理图：
![多路复用](../images/frontendo/4.jpg)

- **header压缩**: HTTP1.x的`header`带有大量信息，而且每次都要重复发送，`HTTP2.0`使用`encoder`来减少需要传输的`header`大小，通讯双方各自`cache`一份`header fields`表，既避免了重复`header`的传输，又减小了需要传输的大小

- **服务端推送（`server push`**: 同SPDY一样，HTTP2.0也具有server push功能。

目前，有大多数网站已经启用HTTP2.0，例如YouTuBe，淘宝网等网站，利用chrome控制台可以查看是否启用H2：开发中工具中的Network=>Name栏右键=>√Protocol

这是天猫的请求:
![http2](../images/frontendo/5.png)

nginx[升级支持http2](https://www.cnblogs.com/bugutian/p/6628455.html)
:::

## 缓存

缓存会根据请求保存输出内容的副本，例如 页面、图片、文件，当下一个请求来到的时候:如果是相同的`URL`，缓存直接使 用本地的副本响应访问请求，而不是向源服务器再次发送请求。因此，可以从以下 2 个方面提升性能。

- 减少相应延迟，提升响应时间
- 减少网络带宽消耗，节省流量
