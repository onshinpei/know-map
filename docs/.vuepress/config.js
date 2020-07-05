const NODE_ENV = process.env.NODE_ENV
module.exports = {
    title: '前端知识地图',
    description: '一些零零碎碎的学习日志',
    port: 8090,
    dest: 'dist',
    base: NODE_ENV === 'production' ? '/docs/' : '/',
    head: [
        ['link', { rel: 'icon', href: `${NODE_ENV === 'production' ? 'docs' : ''}/images/favicon.ico` }],
    ],
    chainWebpack: config => {
        config.module
            .rule('images')
            .use('image-webpack-loader')
            .loader('image-webpack-loader')
            .options({
                bypassOnDebug: true
            })
            .end()
    },

    markdown: {
        lineNumbers: true
    },
    themeConfig: {
        nav: [
            { text: '主页', link: '/' },
            // {
            //     text: '博文',
            //     items: [
            //         { text: 'Android', link: '/android/' },
            //         { text: 'ios', link: '/ios/' },
            //         { text: 'Web', link: '/web/' }
            //     ]
            // },
            { text: '关于', link: '/about/' },
            { text: 'Github', link: 'https://www.github.com/onshinpei/konw-map' },
        ],
        sidebar: [
            {
                title: '基础知识',
                collapsable: false,
                children: [
                    '/javascript/eventLoop',
                    'javascript/frontendOptimization',
                    'javascript/allPosition.md',
                    'javascript/函数式编程的理解.md',
                    'javascript/深入理解对象创建.md'
                ]
            },
            {
                title: '动手实践',
                collapsable: false,
                children: [
                    '/javascript/mvvm',
                    '/javascript/imglazy'
                ]
            },
            {
                title: '搬运好文',
                collapsable: false,
                children: [
                    'frame/vueLazy.md'
                ]
            },
        ]

    },

}