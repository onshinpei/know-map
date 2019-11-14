module.exports = {
    title: '前端知识地图',
    description: '一些零零碎碎的学习日志',
    port: 8090,
    dest: 'dist',
    head: [
        ['link', { rel: 'icon', href: '/images/favicon.ico' }],
    ],
    configureWebpack: (config, isServer) => {
        if (!isServer) {
            return {
                module: {
                    rules: [
                        {
                            test: /\.(gif|png|jpe?g|svg)$/i,
                            use: [
                                {
                                    loader: 'file-loader',
                                    options: {
                                        name: '[name].[ext]',
                                        outputPath: 'images/'
                                    }
                                },
                                {
                                    loader: 'image-webpack-loader',
                                    options: {
                                        bypassOnDebug: true,
                                    }
                                }
                            ]
                        },
                    ]
                }
            }

        }
    },
    markdown: {
        lineNumbers: true
    },
    themeConfig: {
        nav: [
            { text: '主页', link: '/' },
            {
                text: '博文',
                items: [
                    { text: 'Android', link: '/android/' },
                    { text: 'ios', link: '/ios/' },
                    { text: 'Web', link: '/web/' }
                ]
            },
            { text: '关于', link: '/about/' },
            { text: 'Github', link: 'https://www.github.com/onshinpei/konw-map' },
        ],
        sidebar: [
            {
                title: '基础知识',
                collapsable: false,
                children: [
                    '/javascript/eventLoop',
                    '/javascript/mvvm'
                ]
            },
        ]

    },

}