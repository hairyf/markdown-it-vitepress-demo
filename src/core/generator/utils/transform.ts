import type { SFCScriptBlock, SFCStyleBlock, SFCTemplateBlock } from '@vue/compiler-sfc'
import { parse } from '@vue/compiler-sfc'
import { tsToJs } from './convert'
import { format } from './eslint'

export interface TransformSfcOptions {
  lang: 'js' | 'ts'
  fix?: boolean
}

export function transformSfc(code: string, { lang, fix }: TransformSfcOptions) {
  const { descriptor } = parse(code)
  code = joins([
    script(descriptor.scriptSetup, lang),
    script(descriptor.script, lang),
    template(descriptor.template),
    styles(descriptor.styles),
  ])
  if (fix)
    code = format(code, 'vue')
  return code
}

function script(script: SFCScriptBlock | undefined | null, lang: 'js' | 'ts') {
  if (!script)
    return ''

  if (lang === 'ts') {
    return join([
      `<script${attrs(script.attrs)}>`,
      script.content.trim(),
      '</script>',
    ])
  }
  if (script.lang === 'ts' && lang === 'js') {
    return join([
      `<script${attrs(script.attrs, ['lang'])}>`,
      tsToJs(script.content),
      '</script>',
    ])
  }
}

function template(template: SFCTemplateBlock | undefined | null) {
  if (!template)
    return ''

  return [
    `<template${attrs(template.attrs)}>`,
    template.content,
    '</template>',
  ].join('')
}

function styles(styles: SFCStyleBlock[]) {
  return join(
    styles.map(style => `<style${attrs(style.attrs)}>${style.content}</style>`),
  )
}

function attrs(attrs: Record<string, string | boolean> = {}, filterKeys: string[] = []) {
  const code = Object.entries(attrs)
    .filter(([key]) => !filterKeys.includes(key))
    .map(([key, value]) => {
      if (typeof value === 'boolean')
        return key
      return `${key}="${value}"`
    })
    .join(' ')

  return code ? ` ${code}` : ''
}

function joins(code: (string | undefined)[]) {
  return code.filter(Boolean).map(code => code?.trim()).join('\n\n')
}

function join(code: (string | undefined)[]) {
  return code.filter(Boolean).map(code => code?.trim()).join('\n')
}
