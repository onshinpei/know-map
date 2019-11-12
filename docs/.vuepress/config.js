module.exports = {
    title: '前端知识地图',
    description: '一些零零碎碎的学习日志',
    port: 8090,
    head: [
        ['link', { rel: 'icon', href: '/images/favicon.ico' }],
    ],
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
            title: 'JavaScript 学习',
            collapsable: false,
            children: [
              '/javascript/eventLoop',
            ]
          },
        ]
        
    },
   
}