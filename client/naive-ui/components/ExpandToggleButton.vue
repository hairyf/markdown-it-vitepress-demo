<script lang="ts" setup>
import CodeOutline from '../icons/CodeOutline.js'

defineProps<{
  tooltip?: string
}>()

const emit = defineEmits(['click'])
</script>

<template>
  <NTooltip>
    <template #trigger>
      <NButton
        style="padding: 0"
        size="tiny"
        text
        depth="3"
        @click="emit('click')"
      >
        <template #icon>
          <NIcon>
            <CodeOutline />
          </NIcon>
        </template>
      </NButton>
    </template>
    {{ tooltip }}
  </NTooltip>
</template>
