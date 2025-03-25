import type { DefaultTheme } from 'vitepress'
import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import { defineConfig } from 'vitepress'
import { demoMdPlugin } from '../../src'

const themeConfig: DefaultTheme.Config = {
  // https://vitepress.dev/reference/default-theme-config

}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Vitepress Markdown Demo',
  description: 'A Markdown plugin',

  head: [
    ['link', { rel: 'icon', href: '/logo.svg' }],
    ['meta', { name: 'author', content: 'Hairyf' }],
  ],
  themeConfig,
  markdown: {
    codeTransformers: [
      transformerTwoslash({ throws: false }) as any,
    ],
    // Explicitly load these languages for types hightlighting
    languages: ['js', 'jsx', 'ts', 'tsx'] as any,
    config(md) {
      md.use(demoMdPlugin)
    },
  },
  locales: {
    'root': {
      label: 'English',
      lang: 'en-US',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/' },
        ],

        socialLinks: [
          { icon: 'github', link: 'https://github.com/hairyf/vitepress-plugin-demo' },
        ],
      },
    },
    'zh-CN': {
      label: '简体中文',
      lang: 'zh-CN',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/zh-CN/' },
        ],
        socialLinks: [
          { icon: 'github', link: 'https://github.com/hairyf/vitepress-plugin-demo' },
        ],
      },
    },
  },
  vite: { ssr: { noExternal: ['naive-ui'] } },
})
