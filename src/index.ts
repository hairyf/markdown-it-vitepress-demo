import type { MarkdownRenderer } from 'vitepress'
import { markdownDemoContainer, markdownDemoTagBlock } from './core'

export * from './types'

export function demoMdPlugin(md: MarkdownRenderer) {
  markdownDemoTagBlock(md)
  markdownDemoContainer(md)
}
