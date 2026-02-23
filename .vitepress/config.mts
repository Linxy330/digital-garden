import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Kenny's Garden",
  description: "Digital Garden of Kenny Lin",

  lang: 'zh-CN',

  // 忽略死链接报错
  ignoreDeadLinks: true,

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config

    // 左上角的网站标题
    siteTitle: 'Kenny\'s Garden',

    // 目录显示的层级（显示 h2 到 h4）
    outline: {
      level: [2, 4],
      label: '目录'
    },

    // 右上角的导航栏
    nav: [
      { text: '首页', link: '/' },
    ],

    // 左侧的侧边栏 (目录)
    sidebar: [
      {
        text: '最近更新',
        items: [
          { text: '在云端种下一座花园', link: '/deployment-story' },
          { text: '关于 Pixel 刷码进站的那码事', link: '/brightness-problem' }
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