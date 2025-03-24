<script lang="ts" setup>
import Container from './Container.vue'

const props = defineProps<{
  sfcTsCode: string
  // if using ts, sfcJsCode will transform the to js
  sfcJsCode: string
  sfcTsHtml: string
  sfcJsHtml: string
  title: string
  metadata: Record<string, any>
  expand?: boolean
}>()
</script>

<template>
  <ClientOnly>
    <Container v-bind="props">
      <template v-for="(slot, key) in $slots" #[key]>
        <slot :name="key" />
      </template>
    </Container>
  </ClientOnly>
</template>
