---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Demo of Markdown"
  text: "In Vitepress"
  image: "/logo.svg"
  tagline: "Start your component development."
  actions:
    - theme: brand
      text: Get Started
      link: https://github.com/hairyf/vitepress-plugin-demo?tab=readme-ov-file#install
---

<demo
  title="Print Hello World By Vue"
  desc="This is a simple example of a Vue component that prints 'Hello World' to the console."
  src="./index.vue"
  attrs="{5}"
  attrs-in-js="{4}"
  twoslash
  expand
/>

<demo
  title="Print Hello World By React"
  desc="This is a simple example of a React component that prints 'Hello World' to the console."
  src="./index.tsx"
  type="react"
  twoslash
  expand
/>

<demo
  title="Print Hello World By HTML"
  desc="This is a simple example of a html that prints 'Hello World' to the console."
  src="./index.html"
  attrs="{7}"
  expand
/>

<demo
  title="Print Hello World By Code"
  desc="This is a simple example of a code that prints 'Hello World' to the console."
  src="./index.ts"
  attrs="{2}"
  js-attrs="{1}"
  twoslash
  expand
/>
