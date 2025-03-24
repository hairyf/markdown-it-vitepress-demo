import type { DefaultTheme } from 'vitepress'
import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import { defineConfig } from 'vitepress'
import markdownDemo from '../../src'

const themeConfig: DefaultTheme.Config = {
  // https://vitepress.dev/reference/default-theme-config
  nav: [
    { text: 'Home', link: '/' },
  ],

  socialLinks: [
    { icon: 'github', link: 'https://github.com/hairyf/markdown-it-vitepress-demo' },
  ],
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Vitepress Markdown',
  description: 'A Markdown plugin',
  themeConfig,
  markdown: {
    codeTransformers: [
      transformerTwoslash({ throws: false }) as any,
    ],
    // Explicitly load these languages for types hightlighting
    languages: ['js', 'jsx', 'ts', 'tsx'] as any,
    config(md) {
      md.use(markdownDemo)
    },
  },
  vite: { ssr: { noExternal: ['naive-ui'] } },
})
