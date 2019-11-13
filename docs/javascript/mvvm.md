# 简单实现一个MVVM

## MVVM 是什么

MVVM 设计模式，是由 MVC（最早来源于后端）、MVP 等设计模式进化而来，M - 数据模型（Model），VM - 视图模型（ViewModel），V - 视图层（View）。
在 MVC 模式中，除了 Model 和 View 层以外，其他所有的逻辑都在 Controller 中，Controller 负责显示页面、响应用户操作、网络请求及与 Model 的交互，随着业务的增加和产品的迭代，Controller 中的处理逻辑越来越多、越来越复杂，难以维护。为了更好的管理代码，为了更方便的扩展业务，必须要为 Controller “瘦身”，需要更清晰的将用户界面（UI）开发从应用程序的业务逻辑与行为中分离，MVVM 为此而生。

很多 MVVM 的实现都是通过数据绑定来将 View 的逻辑从其他层分离，可以用下图来简略的表示：
![mvvm](../images/mvvm/1.png)

使用 MVVM 设计模式的前端框架很多，其中渐进式框架 Vue 是典型的代表，并在开发使用中深得广大前端开发者的青睐，我们这篇就根据 Vue 对于 MVVM 的实现方式来简单模拟一版 MVVM 库。

## MVVM的流分析

在Vue的MVVM设计中，我们主要针对`Compile`(模板编译)、`Observer`(数据劫持)、`Watcher`(数据监听)和`Dep`(发布订阅)几个部分来实现，核心逻辑可参照下图：

![vue mvvm](../images/mvvm/2.png)

## MVVM类的实现

在Vue中，对外只暴露一个名为Vue的构造函数，在使用的时候`new`一个Vue实例，然后传入一个`options`参数，类型为一个对象，包括当前`Vue`实例的作用于`el`、模板板顶的数据`data`等

我们模拟这种MVVM模式的时候也构建一个类，名字就叫MVVM，在使用时同Vue框架类似，需要通过`new`创建`MVVM`的实例并传入`options`

在新工程目录下新建MVVM.js文件

```js
class MVVM {
    constructor(options) {
        this.$el = options.el
        this.$data = options.data

        if (this.$el) {
            new Observer(this.$data)
        }
    }
}
```

::: tip 思路

- 我们先实现对数据的劫持
:::

接下来我们来实现对数据的劫持类Observer，在同级目录下新建observer.js

```js
class Observer {
    constructor(data) {
        this.observer(data)
    }

    observer(data) {
        if (!data || typeof data != 'object') { // 只有object才需要劫持
            return
        }
        let _value
        Object.keys(data).forEach(key => {
            _value = data[key]
            Object.defineProperty(data, key, {
                enumerable: true,
                configurable: true,
                get() {
                    console.log(`你获取了${key}`)
                    return _value
                },
                set(newValue) {
                    console.log(`${key}变为${newValue}`)
                    _value = newValue
                }
            })
        })
    }
}

```

此时将这两个js引入到测试index.html，如下

``` html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <script src="./observer.js"></script>
    <script src="./MVVM.js"></script>
</head>
<body>
    <div id="app">
        <input type="text" v-model="message">
    </div>
    <script>
        var vm = new MVVM({
            el: '#app',
            data: {
                message: '1234'
            }
        })
    </script>
</body>
</html>

```

得到的效果如下图所示

![演示1](../images/mvvm/3.gif)

由图中可知，当我们获取值得时候就可以调用`get`方法，当我们设置值得时候就可以调用`set`方法。所以当我们从编译模板渲染数据时（类似于`{{message}}`）会调用我们的`get`方法，我们就可以知道哪些地方使用了该数据, 下面我们就来实现编译魔板的方法 `Compile`
