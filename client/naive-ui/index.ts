import type { App, Plugin } from 'vue'
import NaiveUIContainer from './index.vue'

export interface Options {
  github?: string
  codesandbox?: any
}

const plugin: Plugin<Options> = {
  install(app: App, options) {
    if (options?.github) {
      // TODO: add github link by default props
    }
    if (options.codesandbox) {
      // TODO: add codesandbox link by default props
    }
    app.component('demo-container', NaiveUIContainer)
  },
}
export default plugin

export { NaiveUIContainer }
