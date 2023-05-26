import type { MarkdownRenderer } from 'vitepress'
import { markdownDemoContainer, markdownDemoTagBlock } from './core'

export * from './types'

function use(md: MarkdownRenderer) {
  markdownDemoTagBlock(md)
  markdownDemoContainer(md)
}

export default use
