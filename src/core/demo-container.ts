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
    render(tokens: any, idx: any, options: any, env: MarkdownEnv) {
      const opening = tokens[idx].nesting === 1
      if (opening) {
        const content = `<demo ${tokens[idx].info.trim().match(demoRE)?.[1]} />`
        const props = parseProps(content)

        if (!props.src)
          throw new Error('src prop is required')

        const { src, desc, attrs, ...otherProps } = props

        const markdownPath = dirname(env.path)
        const srcPath = resolve(markdownPath, src).replace(/\\/g, '/')

        if (!fs.existsSync(srcPath))
          throw new Error(`rendering ${env.path}: ${srcPath} does not exist`)

        return generateDemoContainerPrefix(md, env, {
          desc,
          attrs,
          props: otherProps,
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
