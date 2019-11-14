# 性能优化

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

很明显后者明显比前面小很多
