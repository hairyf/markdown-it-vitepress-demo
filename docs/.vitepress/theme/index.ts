import TwoslashFloating from '@shikijs/vitepress-twoslash/client'
import Theme from 'vitepress/theme'
import NaiveUIContainer from '../../../client/naive-ui'
import '@shikijs/vitepress-twoslash/style.css'
import './style.css'

export default {
  ...Theme,
  async enhanceApp({ app }) {
    if (!import.meta.env.SSR) {
      const { default: NaiveUI } = await import('naive-ui')
      app.use(NaiveUI)
    }
    app.use(TwoslashFloating)
    app.use(NaiveUIContainer)
  },
}
