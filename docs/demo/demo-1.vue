<script lang="ts" setup>
import defaultContent2, {
  Custom,
  Custom2,
} from './indexcopy'

import type { A } from './d'
import defaultContent from './'

import * as anys from './'

const data: string | number | A = 'Hello!'

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
  <Custom2 />
</template>
