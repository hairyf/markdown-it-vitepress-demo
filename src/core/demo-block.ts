import { dirname, resolve } from 'node:path'
import type { MarkdownEnv, MarkdownRenderer } from 'vitepress'
import fs from 'fs-extra'
import { generateDemoComponent, parseProps } from '../utils'

export function markdownDemoTagBlock(md: MarkdownRenderer) {
  function addRenderRule(type: string) {
    const defaultRender = md.renderer.rules[type]
    md.renderer.rules[type] = (tokens, idx, options, env, self) => {
      const token = tokens[idx]
      const content = token.content.trim()
      if (!content.match(/^<demo\s/))
        return defaultRender!(tokens, idx, options, env, self)

      const { path } = env as MarkdownEnv
      const props = parseProps(content)
      if (!props.src) {
        console.error(`rendering ${path}: src prop is required`)
        return defaultRender!(tokens, idx, options, env, self)
      }

      const markdownPath = dirname(path)
      const srcPath = resolve(markdownPath, props.src).replace(/\\/g, '/')

      if (!fs.existsSync(srcPath)) {
        console.error(`rendering ${path}: ${srcPath} does not exist`)
        return defaultRender!(tokens, idx, options, env, self)
      }

      const demoScripts = generateDemoComponent(md, env, {
        title: props.title,
        desc: props.desc,
        code: fs.readFileSync(srcPath, 'utf-8'),
        path: resolve(markdownPath, props.src),
      })

      return demoScripts
    }
  }
  addRenderRule('html_block')
  addRenderRule('html_inline')
}
