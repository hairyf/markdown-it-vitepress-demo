# markdown-it-vitepress-demo

[![NPM version](https://img.shields.io/npm/v/markdown-it-vitepress-demo?color=a1b858&label=)](https://www.npmjs.com/package/markdown-it-vitepress-demo)

`markdown-it-vitepress-demo` is a `markdown-it` plugin specifically designed for Vitepress demos. It converts code blocks in Markdown into references to the `<demo-container>` component. It does not generate UI itself but serves as a plugin for creating demo containers. This means that you need to implement and register the `<demo-container>` component yourself, and `markdown-it-vitepress-demo` makes this process easier.

With this plugin, you can use the `<demo>` tag in Markdown to reference a demo container. For example:

```markdown
<demo src="../demo.vue" title="Demo block" desc="use demo" />
```

You can use Markdown syntax in the `desc` field. For example:

```markdown
<demo src="../demo.vue" title="Demo block" desc="use `demo` ..." />
```

However, we recommend using the `container` mode to write the `desc` content with Markdown:

```markdown
::: demo src="../demo.vue" title="Demo block"

This is a `description` that can be written using Markdown.

:::
```

This looks more aesthetically pleasing and adheres better to Markdown syntax.

## Install

```bash
npm install markdown-it-vitepress-demo --save-dev
```

## Usage

```js
// .vitepress/config.js
export default defineConfig({
  markdown: {
    config(md) {
      md.use(require('markdown-it-vitepress-demo'))
    },
  },
})
```

Register your `<demo-container>` component in `theme/index.ts|js`:

```js
// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
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
```

The `demo-container` component will receive relevant information about the demo, and you need to implement the rendering of the demo:

```html
<script lang="ts" setup>
import { computed, useSlots } from 'vue'

const props = defineProps<{
  sfcTsCode: string
  sfcJsCode: string
  highlightedHtml: string
  // descriptionHtml is generally not used since the slot with name="desc" will handle everything
  descriptionHtml?: string
  title: string
  metadata: object
}>()

const sfcTsCode = computed(() => decodeURIComponent(props.sfcTsCode))
const sfcJsCode = computed(() => decodeURIComponent(props.sfcJsCode))
const highlightedHtml = computed(() => decodeURIComponent(props.highlightedHtml))
</script>

<template>
  <div>
    <div>{{ title }}</div>
    <!-- The demo is rendered in the default slot -->
    <slot />
    <!-- highlighted code for the demo -->
    <div class="language-vue" v-html="highlightedHtml"></div>
    <!-- The description is rendered in the desc slot -->
    <slot name="desc" />
  </div>
</template>
```

## Metadata

The `demo-container` component will receive relevant information about the demo. You can use the `metadata` to access and use this information within the demo:

```html
<script lang

="ts" setup>
import { computed, useSlots } from 'vue'

const props = defineProps<{
  sfcTsCode: string
  sfcJsCode: string
  highlightedHtml: string
  descriptionHtml?: string
  title: string
  // metadata returns information about the demo during build (absolutePath, relativePath, fileName)
  metadata: object
}>()
const githubBlobUrl = 'https://www.github.com/.../tree/main/'
const githubPath = githubBlobUrl + props.metadata.relativePath

function toEditGithubDemoFile() {
  window.open(githubPath)
}
</script>
```

## License

[MIT](./LICENSE) License © 2022 [Hairyf](https://github.com/hairyf)