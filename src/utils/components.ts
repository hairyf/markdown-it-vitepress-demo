import { relative } from 'node:path'
import type { MarkdownEnv, MarkdownRenderer } from 'vitepress'
import { parse } from 'vue/compiler-sfc'
import { transformSync } from '@swc/core'
import type { Metadata } from '../types'
import { normalizePath, trim } from './util'

export interface GenerateOptions {
  title?: string
  desc?: string
  attrs?: string
  path: string
  code: string
}

const scriptRE = /<\/script>/
const scriptLangTsRE = /<\s*script[^>]*\blang=['"]ts['"][^>]*/
const scriptSetupRE = /<\s*script[^>]*\bsetup\b[^>]*/
const scriptClientRE = /<\s*script[^>]*\bclient\b[^>]*/
let index = 1

export function generateDemoComponent(
  md: MarkdownRenderer,
  env: MarkdownEnv,
  { title, code, desc, path, attrs }: GenerateOptions,
) {
  const name = `DemoComponent${index++}`
  path = normalizePath(path)

  injectImportStatement(name, path, env)

  const isUsingTS = /lang=['"]ts['"]/.test(code)
  const highlightedHtml = md.options.highlight!(code, 'vue', attrs || '')
  const descriptionHtml = md.renderInline(desc || '')
  const sfcTsCode = isUsingTS ? code : ''
  const sfcJsCode = isUsingTS ? sfcTs2Js(code) : code
  const sfcTsHtml = isUsingTS ? highlightedHtml : ''
  const sfcJsHtml = md.options.highlight!(sfcJsCode, 'vue', attrs || '')

  const metadata: Metadata = {
    absolutePath: path,
    relativePath: normalizePath(relative(process.cwd(), path)),
    fileName: path.split('/').pop() || '',
  }
  return trim(`
  <demo-container
    sfcTsCode="${encodeURIComponent(sfcTsCode)}"
    sfcJsCode="${encodeURIComponent(sfcJsCode)}"
    sfcTsHtml="${encodeURIComponent(sfcTsHtml)}"
    sfcJsHtml="${encodeURIComponent(sfcJsHtml)}"
    title="${title}"
    :metadata='${JSON.stringify(metadata)}'
  >
    <${name} />
    <template #desc>
      <div v-if="${Boolean(desc)}" v-html="'${descriptionHtml}'"></div>
    </template>
  </demo-container>
  `)
}

export function injectImportStatement(
  name: string,
  path: string,
  env: MarkdownEnv,
) {
  const registerStatement = `import ${name} from '${path}'`.trim()
  if (!env.sfcBlocks)
    throw new Error('env.sfcBlocks is undefined')

  if (!env.sfcBlocks?.scripts)
    env.sfcBlocks.scripts = []
  const tags = env.sfcBlocks.scripts

  const isUsingTS
    = tags.findIndex(tag => scriptLangTsRE.test(tag.content)) > -1

  const setupScriptIndex = tags?.findIndex((tag) => {
    return (
      scriptRE.test(tag.content)
      && scriptSetupRE.test(tag.content)
      && !scriptClientRE.test(tag.content)
    )
  })
  const isUsingSetup = setupScriptIndex > -1

  if (isUsingSetup) {
    const tagSrc = tags[setupScriptIndex]
    const content = tagSrc.content.replace(
      scriptRE,
      `${registerStatement}\n</script>`,
    )
    tags[setupScriptIndex].content = content
  }
  else {
    tags.unshift({
      content: `\n
      <script ${isUsingTS ? 'lang="ts"' : ''} setup>
        ${registerStatement}
      </script>`,
    } as any)
  }
}

export function generateDemoContainerPrefix(
  md: MarkdownRenderer,
  env: MarkdownEnv,
  { title, code, desc, path, attrs }: GenerateOptions,
) {
  const name = `DemoComponent${index++}`
  path = normalizePath(path)

  injectImportStatement(name, path, env)

  const isUsingTS = /lang=['"]ts['"]/.test(code)
  const highlightedHtml = md.options.highlight!(code, 'vue', attrs || '')

  const descriptionHtml = md.renderInline(desc || '')
  const sfcTsCode = isUsingTS ? code : ''
  const sfcJsCode = isUsingTS ? sfcTs2Js(code) : code
  const sfcTsHtml = isUsingTS ? highlightedHtml : ''
  const sfcJsHtml = md.options.highlight!(sfcJsCode, 'vue', attrs || '')
  const metadata: Metadata = {
    absolutePath: path,
    relativePath: normalizePath(relative(process.cwd(), path)),
    fileName: path.split('/').pop() || '',
  }
  return trim(`
  <demo-container
    sfcTsCode="${encodeURIComponent(sfcTsCode)}"
    sfcJsCode="${encodeURIComponent(sfcJsCode)}"
    sfcTsHtml="${encodeURIComponent(sfcTsHtml)}"
    sfcJsHtml="${encodeURIComponent(sfcJsHtml)}"
    ${desc ? `descriptionHtml="${encodeURIComponent(descriptionHtml)}"` : ''}
    title="${title}"
    :metadata='${JSON.stringify(metadata)}'
  >
    <${name} />
    <template #desc>
  `)
}

export function generateDemoContainerSuffix() {
  return trim(`
    </template>
  </demo-container>
  `)
}

export function sfcTs2Js(code: string) {
  const { descriptor } = parse(code)
  let source = code.replace(/<script.*?<\/script>/gs, '')

  function into(prefix: string, content: string, suffix: string) {
    let { code } = transformSync(content, {
      jsc: {
        parser: { syntax: 'typescript' },
        target: 'es2018',
      },
    })
    code = code.replace(/ {4}/g, '  ')
    source = `${prefix}\n${code}${suffix}\n\n${source.trim()}`
  }

  if (descriptor.scriptSetup?.content)
    into('<script setup>', descriptor.scriptSetup.content, '</script>')

  if (descriptor.script?.content)
    into('<script>', descriptor.script.content, '</script>')

  return source
}
