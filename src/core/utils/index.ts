import type { AttributeNode, ElementNode } from '@vue/compiler-core'
import { baseParse } from '@vue/compiler-core'

function getPropsMappings(attrs: any[]) {
  const map: Record<string, any> = {}
  for (const { name, value, exp, arg } of attrs) {
    if (name === 'bind') {
      if (!isUndefined(arg?.content))
        map[arg.content] = JSON.parse(exp.content)
      continue
    }
    if (isUndefined(value?.content) || value?.content === '')
      map[name] = true
    else if (['true', 'false'].includes(value?.content || ''))
      map[name] = value?.content === 'true'
    else
      map[name] = value?.content
  }
  return map
}

export function parseProps(content: string) {
  const element = baseParse(content).children[0] as ElementNode
  return getPropsMappings(element.props as AttributeNode[])
}

export function isUndefined(v: any): v is undefined {
  return v === undefined || v === null
}
