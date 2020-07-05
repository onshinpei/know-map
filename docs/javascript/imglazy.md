# 简单实现一个图片懒加载

按需加载图片，就是让图片默认开始不加载，而且在接近可视区域范围时，再进行加载。也称之为懒惰加载。大家都知道，图片一下子全部都加载，请求的次数将会增加，势必影响性能。

先来看下懒惰加载的实现原理。它的触发动作是：当滚动条拉动到某个位置时，即将进入可视范围的图片需要加载。实现的过程分为下面几个步骤：

- 生成`<img data-src="url">`标签时，用data-src来保存图片地址；
- 记录的图片data-src都保存到数组里；
- 对滚动条进行事件绑定,假设绑定的函数为function lazyload(){};
- 在函数lazyload中，按照下面思路实现：计算图片的Y坐标，并计算可视区域的高度height，当Y小于等于(height+ scrollTop)时，图片的src的值用data-src的来替换，从而来实现图片的按需加载；

::: tip 提示
对于高版本浏览器，已经很好的支持了`element`进入viewport的监听，这个就是[IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
:::

LazyLoad.js完整代码如下

``` js
"use strict";

const defaults = {
    src: "data-src",
    srcset: "data-srcset",
    selector: ".lazyload",
    root: null,
    rootMargin: "0px",
    threshold: 0
};

function extend() {
    let extended = {};
    let deep = false;
    let i = 0;
    let length = arguments.length;

    /* Check if a deep merge */
    if (Object.prototype.toString.call(arguments[0]) === "[object Boolean]") {
        deep = arguments[0];
        i++;
    }

    /* Merge the object into the extended object */
    let merge = function (obj) {
        for (let prop in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                /* If deep merge and property is an object, merge properties */
                if (deep && Object.prototype.toString.call(obj[prop]) === "[object Object]") {
                    extended[prop] = extend(true, extended[prop], obj[prop]);
                } else {
                    extended[prop] = obj[prop];
                }
            }
        }
    };

    /* Loop through each object and conduct a merge */
    for (; i < length; i++) {
        let obj = arguments[i];
        merge(obj);
    }

    return extended;

}

class LazyLoad {
    constructor(images, options) {
        this.settings = extend(defaults, options)
        this.images = images || document.querySelectorAll(this.settings.selector)
        this.observer = null;
        this.init();
        window.addEventListener('scroll', this.scroll.bind(this))
    }

    init() {
        if (!window.IntersectionObserver) {
            this.loadImages()
            return
        }

        let self = this;
        this.observer = new IntersectionObserver(function (entries) {
            Array.prototype.forEach.call(entries, function (entry) {
                if (entry.isIntersecting) {
                    self.observer.unobserve(entry.target)
                    let src = entry.target.getAttribute(self.settings.src);
                    let srcset = entry.target.getAttribute(self.settings.srcset);
                    if ("img" === entry.target.tagName.toLowerCase()) {
                        if (src) {
                            entry.target.src = src;
                        }
                        if (srcset) {
                            entry.target.srcset = srcset;
                        }
                    } else {
                        entry.target.style.backgroundImage = "url(" + src + ")";
                    }
                }
            })
        })

        Array.prototype.forEach.call(this.images, function (image) {
            if (!image.isAttachIntersecting) {
                self.observer.observe(image);
                image.isAttachIntersectinng = true
            }
        });
    }
    /**
    * 元素在页面中Y轴的位置
    */
    pageY(el) {
        let top = 0;
        do {
            top += el.offsetTop + el.clientTop;

        } while (el.offsetParent && (el = el.offsetParent));
        return top;
    }
    /**
    * 元素在页面中X轴的位置
    */
    pageX(el) {
        let left = 0;
        do {
            left += el.offsetLeft + el.clientLeft;

        } while (el.offsetParent && (el = el.offsetParent));
        return left;
    }
    scroll() {
      this.init()  
    }
    loadImages() {
        if (!this.settings) { return; }
        let self = this

        let iScrollTop = document.documentElement.scrollTop || document.body.scrollTop;

        let iClientHeight = iScrollTop + document.documentElement.clientHeight
        Array.prototype.forEach.call(this.images, function (image) {
            if (!image.isShow) {
                let iTop = self.pageY(image)
                let iBottom = iTop + image.offsetHeight
                let isTopArea = (iTop > iScrollTop && iTop < iClientHeight) ? true : false
                let isBottomArea = (iBottom > iScrollTop && iBottom < iClientHeight) ? true : false
                if (isTopArea || isBottomArea) {
                    let src = image.getAttribute(self.settings.src)
                    let srcset = image.getAttribute(self.settings.srcset)
                    if ("img" === image.tagName.toLowerCase()) {
                        if (src) {
                            image.src = src;
                        }
                        if (srcset) {
                            image.srcset = srcset;
                        }
                    } else {
                        image.style.backgroundImage = "url('" + src + "')";
                    }
                    image.isShow = true
                }
            }
        })
    }

    loadAndDestroy() {
        if (!this.settings) { return; }
        this.loadImages();
        this.destroy();
    }

    destroy() {
        if (!this.settings) { return; }
        this.observer.disconnect();
        this.settings = null;
    }
}
```

运行以下测试代码：

``` html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <script src="./lazy.js" defer></script>
    <style>
        .img-box img{
            min-height: 682px;
        }
    </style>
</head>

<body>
    <div id="app">
        <div class="img-box">
            <img data-src="https://bbs.qn.img-space.com/201912/3/61df290aab94469ff4645d10f81fe319.jpg?imageView2/2/w/1024/q/100/ignore-error/1/"
                alt="" class="lazyload">
        </div>
        <div class="img-box">
            <img data-src="https://bbs.qn.img-space.com/201912/3/fb63652b3c5f17ab9ff589e1e6049044.jpg?imageView2/2/w/1024/q/100/ignore-error/1/"
                alt="" class="lazyload">
        </div>
        <div class="img-box">
            <img data-src="https://bbs.qn.img-space.com/201912/3/61df290aab94469ff4645d10f81fe319.jpg?imageView2/2/w/1024/q/100/ignore-error/1/"
                alt="" class="lazyload">
        </div>
        <div class="img-box">
            <img data-src="https://bbs.qn.img-space.com/201912/3/61df290aab94469ff4645d10f81fe319.jpg?imageView2/2/w/1024/q/100/ignore-error/1/"
                alt="" class="lazyload">
        </div>
    </div>
    <script>
        window.onload = function () {
            new LazyLoad()
        }
    </script>
</body>

</html>
```

> [示例代码](https://github.com/onshinpei/know-map/tree/master/example/imglazyload)
