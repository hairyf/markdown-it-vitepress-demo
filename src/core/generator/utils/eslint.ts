import path from 'node:path'
import { createSyncFn as createWorker } from 'synckit'

export interface Format {
  (code: string, lang: string): string
}

const syncify = createWorker<Format>(
  path.join(import.meta.dirname, './eslint.worker'),
)

export const format: Format = (code, lang) => {
  try {
    return decodeURIComponent(syncify(code, lang))
  }
  catch {
    return code
  }
}
