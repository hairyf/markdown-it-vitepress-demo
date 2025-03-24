import type { MarkdownEnv, MarkdownRenderer } from 'vitepress'
import type { Metadata } from '../../types'
import { relative } from 'node:path'
import process from 'node:process'
import {
  normalizePath,
  parseMdAttrs,
  transformSfc,
  trim,
} from './utils'

export interface GenerateOptions {
  props: Record<string, any>
  desc?: string
  attr?: string
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
  {
    props: { twoslash, ...bindProps },
    code,
    desc,
    path,
    attr,
  }: GenerateOptions,
) {
  const highlight = md.options.highlight!
  const name = `DemoComponent${index++}`
  path = normalizePath(path)
  injectImportStatement(name, path, env)
  const attrs = parseMdAttrs(attr)
  twoslash && attrs.push('twoslash')
  attr = attrs.join(',')

  const isUsingTS = /lang=['"]ts['"]/.test(code)
  const sfcTsCode = isUsingTS ? transformSfc(code, 'ts') : ''
  const sfcJsCode = transformSfc(code, 'js')
  const sfcTsHtml = isUsingTS ? highlight(sfcTsCode, 'vue', attr) : ''
  const sfcJsHtml = highlight!(sfcJsCode, 'vue', attr)

  const highlightedHtml = sfcTsHtml || sfcJsHtml
  const descriptionHtml = md.renderInline(desc || '')

  const metadata: Metadata = {
    absolutePath: path,
    relativePath: normalizePath(relative(process.cwd(), path)),
    fileName: path.split('/').pop() || '',
  }

  const props
    = `sfcTsCode="${encodeURIComponent(sfcTsCode)}"\n`
      + `sfcJsCode="${encodeURIComponent(sfcJsCode)}"\n`
      + `sfcTsHtml="${encodeURIComponent(sfcTsHtml)}"\n`
      + `sfcJsHtml="${encodeURIComponent(sfcJsHtml)}"\n`
      + `:metadata='${JSON.stringify(metadata)}'\n`
      + `v-bind='${JSON.stringify(bindProps)}'\n`

  return {
    name,
    props,
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
  const { name, props, descriptionHtml, sfcTsHtml, sfcJsHtml } = parse(md, env, options)

  return trim(`
  <demo-container \n${props}>
    ${generateSfcSlots(sfcTsHtml, sfcJsHtml)}
    <${name} />
    <template #md:desc>
      ${descriptionHtml}
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

  const isUsingTS = tags.findIndex(tag => scriptLangTsRE.test(tag.content)) > -1

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
  const { name, props, sfcTsHtml, sfcJsHtml } = parse(md, env, options)

  return trim(`
  <demo-container \n${props}>
    ${generateSfcSlots(sfcTsHtml, sfcJsHtml)}
    <${name} />
    <template #md:desc>
  `)
}

export function generateDemoContainerSuffix() {
  return trim(`
    </template>
  </demo-container>
  `)
}

export function generateSfcSlots(sfcTsHtml?: string, sfcJsHtml?: string) {
  return trim(`
    <template #md:sfc-ts>
      <div class="language-vue" style="flex: 1;">
        ${sfcTsHtml}
      </div>
    </template>
    <template #md:sfc-js>
      <div class="language-vue" style="flex: 1;">
        ${sfcJsHtml}
      </div>
    </template>
  `)
}
