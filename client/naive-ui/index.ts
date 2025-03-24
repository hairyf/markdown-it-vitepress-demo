import type { App, Plugin } from 'vue'
import NaiveUIContainer from './index.vue'

const plugin: Plugin<{ github?: string }> = {
  install(app: App, options) {
    if (options?.github) {
      // TODO: add github link by default props
    }
    app.component('demo-container', NaiveUIContainer)
  },
}
export default plugin

export { NaiveUIContainer }
