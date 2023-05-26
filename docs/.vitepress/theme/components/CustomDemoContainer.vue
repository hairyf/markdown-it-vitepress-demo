<script lang="ts" setup>
import { computed } from 'vue'

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

console.log(props)
</script>

<template>
  <div>
    <div>{{ title }}</div>
    <!-- The demo is rendered in the default slot -->
    <slot />
    <!-- Highlighted code for the demo -->
    <div class="language-vue" v-html="highlightedHtml" />
    <!-- The description is rendered in the desc slot -->
    <slot name="desc" />
  </div>
</template>
