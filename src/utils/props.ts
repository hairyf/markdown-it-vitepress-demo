import type { AttributeNode, ElementNode } from '@vue/compiler-core'
import { baseParse } from '@vue/compiler-core'

function getPropsMap(attrs: AttributeNode[]) {
  const map: Record<string, string | undefined> = {}
  for (const { name, value } of attrs)
    map[name] = value?.content
  return map
}

export function parseProps(content: string) {
  const ast = baseParse(content)
  const demoElement = ast.children[0] as ElementNode
  return getPropsMap(demoElement.props as AttributeNode[])
}
