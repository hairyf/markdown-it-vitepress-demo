import type { MarkdownEnv, MarkdownRenderer } from 'vitepress'
import type { Metadata } from '../types'
import { relative } from 'node:path'
import process from 'node:process'
import { transformSync } from 'esbuild'
import { parse as parseSfc } from 'vue/compiler-sfc'
import { normalizePath, trim } from './util'

export interface GenerateOptions {
  desc?: string
  attrs?: string
  props: Record<string, any>
  path: string
  code: string
}

const scriptRE = /<\/script>/
const scriptLangTsRE = /<\s*script[^>]+\blang=['"]ts['"][^>]*/
const scriptSetupRE = /<\s*script[^>]+\bsetup\b[^>]*/
const scriptClientRE = /<\s*script[^>]+\bclient\b[^>]*/
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

function parseModuleContents(content: string) {
  return [...content.matchAll(/import(.*?)from/gs)]
    .map(v => v[1])
    .map(v => v.replace(/[\r\n]/g, ''))
    .map(v => v.replace('* as ', ''))
    .map(v => v.replace(/ /g, ''))
    .map(v => v.replace(',}', '}'))
    .map(v => v.replace('{', ''))
    .map(v => v.replace('}', ''))
    .map(v => v.trim())
    .map(v => v.split(','))
    .flatMap(v => v)
}
function parseModuleTypes(content: string) {
  return [...content.matchAll(/import type(.*?)from(.*?)\n/gs)]
    .map(v => v[0])
}

export function transformSfcCode(code: string, lang: 'js' | 'ts') {
  const { descriptor } = parseSfc(code)
  let source = code.replace(/<script.*?<\/script>/gs, '')
  function into(prefix: string, content: string, suffix: string) {
    if (lang === 'js') {
      const imports = parseModuleContents(content)
      const line = '\n__blank_line\n'

      let beforeContent = content.replace(/\n(\s)*\n/g, line)
      beforeContent += '\n__blank_import_start;'
      beforeContent += `\n${imports.map(i => `${i};`).join('\n')}`
      beforeContent += '\n__blank_import_end;'

      parseModuleTypes(beforeContent).forEach((str) => {
        beforeContent = beforeContent.replace(str, line)
      })

      let { code } = transformSync(beforeContent, {
        loader: 'ts',
        minify: false,
        minifyWhitespace: false,
        treeShaking: false,
        charset: 'utf8',
      })

      code = code
        .replace(/__blank_line;/g, '')
        .replace(/__blank_import_start;.*?__blank_import_end;/s, '')
        .trim()

      content = `\n${code}\n`
    }
    source = `${prefix}${content}${suffix}\n\n${source.trim()}`
  }

  try {
    if (descriptor.scriptSetup?.content)
      into(`<script ${lang === 'ts' ? 'lang="ts" ' : ''}setup>`, descriptor.scriptSetup.content, '</script>')

    if (descriptor.script?.content)
      into(`<script ${lang === 'ts' ? 'lang="ts" ' : ''}>`, descriptor.script.content, '</script>')

    return source.trim()
  }
  catch (error: any) {
    console.warn('[markdown-it-vitepress-demo]: ', error.message)
    return code
  }
}
