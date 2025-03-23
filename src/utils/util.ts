import { sep } from 'node:path'

export function normalizePath(path: string) {
  return path.split(sep).join('/')
}

export function trim(str: string) {
  return str.trim()
}

export function isUndefined(v: any): v is undefined {
  return v === undefined || v === null
}

export function parseMdAttrs(attrs?: string) {
  attrs = attrs ?? ''
  return attrs
    .replace('{', '')
    .replace('}', '')
    .split(',')
}
