import type { DefaultTheme } from 'vitepress'
import { defineConfig } from 'vitepress'
import markdownDemo from '../..'

const themeConfig: DefaultTheme.Config = {
  // https://vitepress.dev/reference/default-theme-config
  nav: [
    { text: 'Home', link: '/' },
    { text: 'Examples', link: '/markdown-examples' },
  ],

  sidebar: [
    {
      text: 'Examples',
      items: [
        { text: 'Markdown Examples', link: '/markdown-examples' },
        { text: 'Runtime API Examples', link: '/api-examples' },
      ],
    },
  ],

  socialLinks: [
    { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
  ],
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Markdown Vitepress Demo',
  description: 'A Markdown plugin',
  themeConfig,
  markdown: {
    config(md) {
      md.use(markdownDemo)
    },
  },
})
