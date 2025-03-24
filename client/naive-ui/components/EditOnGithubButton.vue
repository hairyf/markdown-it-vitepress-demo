<script lang="ts">
import { defineComponent } from 'vue'
import EditIcon from '../icons/Compose16Regular.js'
import { githubBlobURL } from '../utils'

export default defineComponent({
  name: 'EditOnGithubButton',
  components: {
    EditIcon,
  },
  props: {
    blobURL: {
      type: String,
      default: githubBlobURL,
    },
    relativePath: {
      type: String,
      required: true,
    },
    text: Boolean,
    quaternary: Boolean,
    tooltip: String,
  },
  setup(props) {
    function open() {
      window.open(props.blobURL + props.relativePath, '__blank')
    }
    return { open }
  },
})
</script>

<template>
  <n-tooltip>
    <template #trigger>
      <n-button
        class="edit-button"
        size="tiny"
        text
        target="_blank"
        :style="{ padding: 0 }"
        @click="open"
      >
        <template #icon>
          <n-icon>
            <EditIcon />
          </n-icon>
        </template>
      </n-button>
    </template>
    {{ tooltip }}
  </n-tooltip>
</template>
