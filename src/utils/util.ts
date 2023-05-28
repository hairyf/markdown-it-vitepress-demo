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
