import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Kenny's Garden",
  description: "Digital Garden of Kenny Lin",

  lang: 'zh-CN',

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config

    // 左上角的网站标题
    siteTitle: 'Kenny\'s Digital Garden',

    // 右上角的导航栏
    nav: [
      { text: '首页', link: '/' },
      { text: '技术笔记', link: '/markdown-examples' },
      { text: '关于我', link: '/api-examples' }
    ],

    // 左侧的侧边栏 (目录)
    sidebar: [
      {
        text: '最近更新',
        items: [
          { text: 'Markdown 示例', link: '/markdown-examples' },
          { text: 'API 示例', link: '/api-examples' }
        ]
      }
    ],

    // 社交链接 (右上角的图标)
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Linxy330/' }
    ],

    // 页脚
    footer: {
      copyright: 'Copyright © 2026 Kenny Lin'
    },

    // 把原本英文的“上一页/下一页”改成中文
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },

    // 移动端菜单标题
    sidebarMenuLabel: '目录',
    returnToTopLabel: '返回顶部',
    darkModeSwitchLabel: '深色模式'
  }
})