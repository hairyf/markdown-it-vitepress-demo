import { sep } from 'node:path'

export function normalizePath(path: string) {
  return path.split(sep).join('/')
}

export function trim(str: string) {
  return str.trim()
}

export function parseMdAttrs(attrs?: string) {
  attrs = attrs ?? ''
  return attrs
    .replace('{', '')
    .replace('}', '')
    .split(',')
}
