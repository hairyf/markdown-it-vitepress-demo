<script lang="ts" setup>
import type { Codeeditor } from 'codeeditor-kit'
import Container from './Container.vue'

const props = defineProps<{
  sfcTsCode: string
  // if using ts, sfcJsCode will transform the to js
  sfcJsCode: string
  metadata: Record<string, any>
  title: string
  expand?: boolean
  github?: string
  codeeditor?: Codeeditor
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
