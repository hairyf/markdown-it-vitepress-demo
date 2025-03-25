import type { CodeeditorOptions } from 'codeeditor-kit'
import type { FunctionPlugin } from 'vue'
import { Codeeditor } from 'codeeditor-kit'
import NaiveUIContainer from './index.vue'

export interface NaiveUIContainerOptions {
  codeeditor?: CodeeditorOptions<any>
  github?: string
}

const plugin: FunctionPlugin<[NaiveUIContainerOptions]> = (app, options) => {
  app.config.globalProperties.$github = options?.github
  app.config.globalProperties.$codeeditor = new Codeeditor({
    editors: [],
    ...options.codeeditor,
  })
  app.component('demo-container', NaiveUIContainer)
}
export default plugin

export { NaiveUIContainer }
