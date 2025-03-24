import { transformSync } from 'esbuild'

export function parseModuleContents(content: string) {
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

export function parseModuleTypes(content: string) {
  return [...content.matchAll(/import type(.*?)from(.*?)\n/gs)]
    .map(v => v[0])
}

export function tsToJs(content?: string) {
  if (!content)
    return ''
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

  return `\n${code}\n`
}
