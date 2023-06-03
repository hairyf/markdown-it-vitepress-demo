<!-- eslint-disable no-console -->
<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps<{
  sfcTsCode: string
  sfcJsCode: string
  sfcTsHtml: string
  sfcJsHtml: string
  title: string
  metadata: object
  expand?: boolean
  a?: number
  b?: object
}>()

const sfcTsHtml = computed(() => decodeURIComponent(props.sfcTsHtml))
const sfcJsHtml = computed(() => decodeURIComponent(props.sfcJsHtml))

console.log({ ...props })
</script>

<template>
  <div>
    <h3 style="margin-bottom: 20px;">
      {{ title }}
    </h3>
    <!-- The demo is rendered in the default slot -->
    <slot />
    <!-- Highlighted code for the demo -->
    <div>
      <div class="language-vue" style="flex: 1;" v-html="sfcTsHtml" />
      <div class="language-vue" style="flex: 1;" v-html="sfcJsHtml" />
    </div>
    <slot name="desc" />
  </div>
</template>
