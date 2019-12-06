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