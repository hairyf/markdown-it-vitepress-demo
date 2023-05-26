// https://vitepress.dev/guide/custom-theme
import Theme from 'vitepress/theme'
import './style.css'
// your demo component
import CustomDemoContainer from './components/CustomDemoContainer.vue'

export default {
  ...Theme,
  enhanceApp({ app, router, siteData }) {
    app.component('demo-container', CustomDemoContainer)
  },
}
