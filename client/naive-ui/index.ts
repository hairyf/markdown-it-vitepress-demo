import type { CodeeditorOptions } from 'codeeditor-kit'
import type { FunctionPlugin } from 'vue'
import type { InstallComponent } from './components/InstallProvider'
import { Codeeditor } from 'codeeditor-kit'
import NaiveUIContainer from './index.vue'

export interface NaiveUIContainerOptions {
  codeeditor?: CodeeditorOptions<any>
  install?: InstallComponent[]
  github?: string
}

const plugin: FunctionPlugin<[NaiveUIContainerOptions]> = (app, options) => {
  app.config.globalProperties.$github = options?.github
  app.config.globalProperties.$codeeditor = new Codeeditor({
    editors: [],
    ...options.codeeditor,
  })
  NaiveUIContainer.props.install.default = options.install
  app.component('demo-container', NaiveUIContainer)
}
export default plugin

export { NaiveUIContainer }
