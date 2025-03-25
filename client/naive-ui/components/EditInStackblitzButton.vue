<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'EditInCodeSandboxButton',
  props: {
    tooltip: String,
    onClick: Function,
  },
})
</script>

<template>
  <n-tooltip>
    <template #trigger>
      <n-button class="edit-button" text size="tiny" depth="3" @click="onClick">
        <template #icon>
          <n-icon>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Simple Icons by Simple Icons Collaborators - https://github.com/simple-icons/simple-icons/blob/develop/LICENSE.md --><path fill="currentColor" d="M10.797 14.182H3.635L16.728 0l-3.525 9.818h7.162L7.272 24l3.524-9.818Z" /></svg>
          </n-icon>
        </template>
      </n-button>
    </template>
    {{ tooltip }}
  </n-tooltip>
</template>
