import TwoslashFloatingVue from '@shikijs/vitepress-twoslash/client'
// https://vitepress.dev/guide/custom-theme
import Theme from 'vitepress/theme'
// your demo component
import CustomDemoContainer from './components/CustomDemoContainer.vue'
import './style.css'
import '@shikijs/vitepress-twoslash/style.css'

export default {
  ...Theme,
  enhanceApp({ app }) {
    app.component('demo-container', CustomDemoContainer)
    app.use(TwoslashFloatingVue)
  },
}
