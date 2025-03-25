const indexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Naive UI Demo</title>
    <style>
      body {
        padding: 24px;
      }
    </style>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
`

const appVue = `<template>
  <np-global-provider>
    <demo />
  </np-global-provider>
</template>

<script>
import { defineComponent } from "vue";
import Demo from "./Demo.vue";

export default defineComponent({
components: {
  Demo,
},
});
</script>`

const mainJs = `import { createApp } from "vue";
import naive from "naive-ui";
import naiveProComponents from "naive-ui-pro-components";
import App from "./App.vue";

const app = createApp(App);

app.use(naive);
app.use(naiveProComponents);

app.mount("#app");
`

function getDependencies(code: string) {
  return (code.match(/from '([^']+)'\n/g) || [])
    .map(v => v.slice(6, v.length - 2))
    .reduce<Record<string, string>>(
      (prev, dep) => {
        prev[dep] = 'latest'
        return prev
      },
      {},
    )
}

export async function getCodeSandboxParams(code: string) {
  const { getParameters } = await import('codesandbox/lib/api/define')
  return getParameters({
    files: {
      'package.json': {
        content: {
          dependencies: {
            ...getDependencies(code),
            'vue': 'next',
            'vue-router': 'next',
            'naive-ui': 'latest',
            'naive-ui-pro-components': 'latest',
          },
          devDependencies: {
            '@vue/cli-plugin-babel': '~4.5.0',
            'typescript': '~4.6.3',
          },
        },
      },
      'index.html': {
        content: indexHtml,
      },
      'src/Demo.vue': {
        content: code,
      },
      'src/App.vue': {
        content: appVue,
      },
      'src/main.js': {
        content: mainJs,
      },
    },
  } as any)
}
