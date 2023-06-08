<script lang="ts" setup>
import defaultContent2 from './indexcopy'
import defaultContent, {
  Custom,
} from './'
import * as anys from './'

const data: string | number = 'Hello!'
function onClick() {
  alert('Hello!')
}
</script>

<template>
  <Custom>
    <button @click="onClick">
      {{ data }} Click Me! {{ defaultContent }} {{ defaultContent2 }}
      {{ anys.default }}
    </button>
  </Custom>
</template>
