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
  title="Print Hello World"
  desc="This is a simple example of a Vue component that prints 'Hello World' to the console."
  src="./index.vue"
  attrs="{5}"
  attrs-in-js="{4}"
  twoslash
  expand
/>
