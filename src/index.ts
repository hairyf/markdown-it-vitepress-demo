import type { MarkdownRenderer } from 'vitepress'
import { markdownDemoContainer, markdownDemoTagBlock } from './markdown-it'

export * from './markdown-it'
export * from './types'

function use(md: MarkdownRenderer) {
  markdownDemoTagBlock(md)
  markdownDemoContainer(md)
}

export default use
