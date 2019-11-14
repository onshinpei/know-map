const NODE_ENV = process.env.NODE_ENV
module.exports = {
    title: '前端知识地图',
    description: '一些零零碎碎的学习日志',
    port: 8090,
    dest: 'dist',
    base: NODE_ENV === 'production' ? '/docs/' : '/',
    head: [
        ['link', { rel: 'icon', href: `${NODE_ENV === 'production' ? 'docs': ''}/images/favicon.ico` }],
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
    // configureWebpack: (config, isServer) => {
    //     if (!isServer) {
    //         return {
    //             module: {
    //                 rules: [
    //                     {
    //                         test: /\.(gif|png|jpe?g|svg)$/i,
    //                         use: [
    //                             {
    //                                 loader: 'file-loader',
    //                                 options: {
    //                                     name: '[name].[hash].[ext]',
    //                                     outputPath: 'assets/img'
    //                                 }
    //                             },
    //                             // {
    //                             //     loader: 'image-webpack-loader',
    //                             //     options: {
    //                             //         bypassOnDebug: true,
    //                             //     }
    //                             // }
    //                         ]
    //                     },
    //                 ]
    //             }
    //         }

    //     }
    // },
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