import type { EnhanceAppContext } from 'vitepress'
import type { NaiveUIContainerOptions } from '../../../client/naive-ui'
import TwoslashFloating from '@shikijs/vitepress-twoslash/client'
import Theme from 'vitepress/theme'
import NaiveUIContainer from '../../../client/naive-ui'
import '@shikijs/vitepress-twoslash/style.css'
import './style.css'

const options: NaiveUIContainerOptions = {
  github: 'https://github.com/hairyf/vitepress-plugin-demo/tree/main',
  codeeditor: {
    editors: ['stackblitz', 'codesandbox'],
    globals: {
      package: {
        scripts: {
          start: 'node -e "console.log(\'Hello, World!\')"',
        },
      },
      opens: ['package.json'],
    },
  },
}

export default {
  ...Theme,
  async enhanceApp({ app }: EnhanceAppContext) {
    // eslint-disable-next-line ts/ban-ts-comment
    // @ts-expect-error
    if (!import.meta.env.SSR) {
      const { default: NaiveUI } = await import('naive-ui')
      app.use(NaiveUI)
    }
    app.use(TwoslashFloating)
    app.use(NaiveUIContainer, options)
  },
}
