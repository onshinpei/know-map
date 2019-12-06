# VUE2组件懒加载浅析

> 原文地址：[https://www.cnblogs.com/zhanyishu/p/6587571.html](https://www.cnblogs.com/zhanyishu/p/6587571.html)

## 什么是懒加载

懒加载也叫延迟加载，即在需要的时候进行加载，随用随载。

## 为什么需要懒加载

在单页应用中，如果没有应用懒加载，运用webpack打包后的文件将会异常的大，造成进入首页时，需要加载的内容过多，延时过长，不利于用户体验，而运用懒加载则可以将页面进行划分，需要的时候加载页面，可以有效的分担首页所承担的加载压力，减少首页加载用时

## 如何与webpack配合实现组件懒加载

### 在webpack配置文件中的output路径配置chunkFilename属性

``` js
output: {
    path: resolve(__dirname, 'dist'),
    filename: options.dev ? '[name].js' : '[name].js?[chunkhash]',
    chunkFilename: 'chunk[id].js?[chunkhash]',
    publicPath: options.dev ? '/assets/' : publicPath
},
```

chunkFilename路径将会作为组件懒加载的路径

### 配合webpack支持的异步加载方法

- resolve => require([URL], resolve), 支持性好
- () => system.import(URL) , webpack2官网上已经声明将逐渐废除, 不推荐使用
- () => import(URL), webpack2官网推荐使用, 属于es7范畴, 需要配合babel的syntax-dynamic-import插件使用, 具体使用方法如下

``` bash
npm install --save-dev babel-core babel-loader babel-plugin-syntax-dynamic-import babel-preset-es2015
```

``` js
use: [{
    loader: 'babel-loader',
    options: {
    presets: [['es2015', {modules: false}]],
    plugins: ['syntax-dynamic-import']
    }
}]
```

## 具体实例中实现懒加载

### 1、路由中配置异步组件

``` js
export default new Router({
    routes: [
        {
            mode: 'history',
            path: '/my',
            name: 'my',
            component:  resolve => require(['../page/my/my.vue'], resolve),//懒加载
        },
    ]
})
```

### 2、实例中配置异步组件

``` js
components: {
    historyTab: resolve => {
        require(['../../component/historyTab/historyTab.vue'], resolve)
    },//懒加载
},
```

### 3、全局注册异步组件

``` js
Vue.component('mideaHeader', () => {
    System.import('./component/header/header.vue')
})
```

## 配置异步组件实现懒加载的问题分析

### 1、多次进出同一个异步加载页面是否会造成多次加载组件呢

答：否，首次需要用到组件时浏览器会发送请求加载组件，加载完将会缓存起来，以供之后再次用到该组件时调用

### 2、在多个地方使用同一个异步组件时是否造成多次加载组件？如

``` js
//a页面
export default {
    components: {
        historyTab: resolve => {require(['../../component/historyTab/historyTab.vue'], resolve)},//懒加载
    },
}
//b页面
export default {
    components: {
        historyTab: resolve => {require(['../../component/historyTab/historyTab.vue'], resolve)},//懒加载
    },
}
```

答：否，理由同上

### 3、如果在两个异步加载的页面中分别同步与异步加载同一个组件时是否会造成资源重用？ 如：

``` js
//a页面
import historyTab from '../../component/historyTab/historyTab.vue';
export default {
    components: {
        historyTab
    },
}

//b页面
export default {
    components: {
        historyTab: resolve => {require(['../../component/historyTab/historyTab.vue'], resolve)},//懒加载
    },
}
```

答: 会, 将会造成资源重用, 根据打包后输出的结果来看, a页面中会嵌入historyTab组件的代码, b页面中的historyTab组件还是采用异步加载的方式, 另外打包chunk；

解决方案： 组件开发时， 如果根页面没有导入组件的情况下，而是在其他异步加载页面中同时用到组件， 那么为实现资源的最大利用，在协同开发的时候全部人都使用异步加载组件

### 4、在异步加载页面中载嵌入异步加载的组件时对页面是否会有渲染延时影响？

答：会， 异步加载的组件将会比页面中其他元素滞后出现， 页面会有瞬间闪跳影响；

解决方案：因为在首次加载组件的时候会有加载时间， 出现页面滞后， 所以需要合理的进行页面结构设计， 避免首次出现跳闪现象；

## 懒加载的最终实现方案

### 1、路由页面以及路由页面中的组件全都使用懒加载

优点：

1. 最大化的实现随用随载
2. 团队开发不会因为沟通问题造成资源的重复浪费

缺点：当一个页面中嵌套多个组件时将发送多次的http请求，可能会造成网页显示过慢且渲染参差不齐的问题

### 2、路由页面使用懒加载， 而路由页面中的组件按需进行懒加载, 即如果组件不大且使用不太频繁, 直接在路由页面中导入组件, 如果组件使用较为频繁使用懒加载

优点：能够减少页面中的http请求，页面显示效果好
缺点：需要团队事先交流， 在框架中分别建立懒加载组件与非懒加载组件文件夹

### 3、路由页面使用懒加载，在不特别影响首页显示延迟的情况下，根页面合理导入复用组件，再结合方案2

优点：

1. 合理解决首页延迟显示问题
2. 能够最大化的减少http请求， 且做其他他路由界面的显示效果最佳

缺点：还是需要团队交流，建立合理区分各种加载方式的组件文件夹
