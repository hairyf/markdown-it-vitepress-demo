import { relative } from 'node:path'
import type { MarkdownEnv, MarkdownRenderer } from 'vitepress'
import { parse as parseSfc } from 'vue/compiler-sfc'
import { transformSync } from 'esbuild'
import type { Metadata } from '../types'
import { normalizePath, trim } from './util'

export interface GenerateOptions {
  desc?: string
  attrs?: string
  props: Record<string, any>
  path: string
  code: string
}

const scriptRE = /<\/script>/
const scriptLangTsRE = /<\s*script[^>]*\blang=['"]ts['"][^>]*/
const scriptSetupRE = /<\s*script[^>]*\bsetup\b[^>]*/
const scriptClientRE = /<\s*script[^>]*\bclient\b[^>]*/
let index = 1

export function parse(
  md: MarkdownRenderer,
  env: MarkdownEnv,
  { code, desc, path, attrs: _attrs, props }: GenerateOptions,
) {
  const name = `DemoComponent${index++}`
  path = normalizePath(path)
  injectImportStatement(name, path, env)

  const isUsingTS = /lang=['"]ts['"]/.test(code)
  const highlightedHtml = md.options.highlight!(code, 'vue', _attrs || '')
  const descriptionHtml = md.renderInline(desc || '')
  const sfcTsCode = isUsingTS ? transformSfcCode(code, 'ts') : ''
  const sfcJsCode = isUsingTS ? transformSfcCode(code, 'js') : code
  const sfcTsHtml = isUsingTS ? highlightedHtml : ''
  const sfcJsHtml = md.options.highlight!(sfcJsCode, 'vue', _attrs || '')

  const metadata: Metadata = {
    absolutePath: path,
    relativePath: normalizePath(relative(process.cwd(), path)),
    fileName: path.split('/').pop() || '',
  }

  const attrs
   = `sfcTsCode="${encodeURIComponent(sfcTsCode)}"\n`
   + `sfcJsCode="${encodeURIComponent(sfcJsCode)}"\n`
   + `sfcTsHtml="${encodeURIComponent(sfcTsHtml)}"\n`
   + `sfcJsHtml="${encodeURIComponent(sfcJsHtml)}"\n`
   + `:metadata='${JSON.stringify(metadata)}'\n`
   + `v-bind='${JSON.stringify(props)}'\n`

  return {
    name,
    attrs,
    descriptionHtml,
    highlightedHtml,
    isUsingTS,
    sfcTsCode,
    sfcJsCode,
    sfcTsHtml,
    sfcJsHtml,
  }
}

export function generateDemoComponent(
  md: MarkdownRenderer,
  env: MarkdownEnv,
  options: GenerateOptions,
) {
  const { name, attrs, descriptionHtml } = parse(md, env, options)

  return trim(`
  <demo-container \n${attrs}>
    <${name} />
    <template #desc>
      <div v-if="${Boolean(descriptionHtml)}" v-html="'${descriptionHtml}'"></div>
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
  options: GenerateOptions,
) {
  const { name, attrs } = parse(md, env, options)

  return trim(`
  <demo-container \n${attrs}>
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

export function transformSfcCode(code: string, lang: 'js' | 'ts') {
  const { descriptor } = parseSfc(code)
  let source = code.replace(/<script.*?<\/script>/gs, '')

  function into(prefix: string, content: string, suffix: string) {
    if (lang === 'js') {
      const beforeTransformContent = content.replace(
        /\n(\s)*\n/g,
        '\n__blank_line\n',
      )
      const { code } = transformSync(beforeTransformContent, {
        loader: 'ts',
        minify: false,
        minifyWhitespace: false,
        charset: 'utf8',
      })

      content = `\n${code.trim().replace(/__blankline;/g, '')}\n`
    }
    source = `${prefix}${content}${suffix}\n\n${source.trim()}`
  }

  if (descriptor.scriptSetup?.content)
    into('<script setup>', descriptor.scriptSetup.content, '</script>')

  if (descriptor.script?.content)
    into('<script>', descriptor.script.content, '</script>')

  return source.trim()
}
