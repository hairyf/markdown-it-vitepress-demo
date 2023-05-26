import { dirname, resolve } from 'node:path'
import type { MarkdownEnv, MarkdownRenderer } from 'vitepress'
import mdContainer from 'markdown-it-container'
import fs from 'fs-extra'
import { generateDemoContainerPrefix, generateDemoContainerSuffix, parseProps } from '../utils'

const demoRE = /^demo\s*(.*)$/

export function markdownDemoContainer(md: MarkdownRenderer) {
  mdContainer(md, 'demo', {
    validate(params) {
      return !!params.trim().match(/^demo\s*(.*)$/)
    },
    render(tokens, idx, options, env: MarkdownEnv) {
      const opening = tokens[idx].nesting === 1
      if (opening) {
        const attrs = tokens[idx].info.trim().match(demoRE)?.[1]
        const content = `<demo ${attrs} />`
        const props = parseProps(content)

        if (!props.src)
          throw new Error('src prop is required')
        const markdownPath = dirname(env.path)
        const srcPath = resolve(markdownPath, props.src).replace(/\\/g, '/')

        if (!fs.existsSync(srcPath))
          throw new Error(`rendering ${env.path}: ${srcPath} does not exist`)

        return generateDemoContainerPrefix(md, env, {
          title: props.title,
          desc: props.desc,
          code: fs.readFileSync(srcPath, 'utf-8'),
          path: resolve(markdownPath, props.src),
        })
      }
      else {
        return generateDemoContainerSuffix()
      }
    },
  })
}
