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

const sfcHtml = computed(() => decodeURIComponent(props.sfcTsHtml || props.sfcJsHtml))
</script>

<template>
  <div>
    <h3 style="margin-bottom: 20px;">
      {{ title }}
    </h3>
    <!-- The demo is rendered in the default slot -->
    <slot />
    <!-- Highlighted code for the demo -->
    <h2>sfcHtml：</h2>
    <div class="language-vue" v-html="sfcHtml" />
    <!-- The description is rendered in the desc slot -->
    <slot name="desc" />
  </div>
</template>
