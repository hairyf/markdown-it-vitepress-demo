import type { Codeeditor } from 'codeeditor-kit'

declare module 'vue' {
  interface ComponentCustomProperties {
    $codeeditor?: Codeeditor
    $github?: string
  }
}

export {}
