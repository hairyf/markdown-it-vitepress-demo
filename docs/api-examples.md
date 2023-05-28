---
outline: deep
---

# Demo

<demo src="./demo/demo-1.vue" attrs="{4}" title="Demo block - 1" desc="use demo" />

<demo src="./demo/demo-1.vue" attrs="{6}" title="Demo block - 2" v-bind="{a: 321}" desc="use `demo`" />

<demo src="./demo/demo-1.vue"  title="Demo block - 3" expand :a="123" />

::: demo src="./demo/demo-1.vue" title="Demo Container - 1" expand="true"

This is a `description` that can be written using Markdown.

:::
