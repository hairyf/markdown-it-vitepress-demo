<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps<{
  sfcTsCode: string
  sfcJsCode: string
  sfcTsHtml: string
  sfcJsHtml: string
  title: string
  metadata: object
}>()

const sfcTsHtml = computed(() => decodeURIComponent(props.sfcTsHtml))
const sfcJsHtml = computed(() => decodeURIComponent(props.sfcJsHtml))
</script>

<template>
  <div>
    <h3 style="margin-bottom: 20px;">
      {{ title }}
    </h3>
    <!-- The demo is rendered in the default slot -->
    <slot />
    <!-- Highlighted code for the demo -->
    <h2>sfcTsHtml：</h2>
    <div class="language-vue" v-html="sfcTsHtml" />
    <h2>sfcJsHtml：</h2>
    <div class="language-vue" v-html="sfcJsHtml" />
    <!-- The description is rendered in the desc slot -->
    <slot name="desc" />
  </div>
</template>
