<script lang="ts" setup>
// eslint-disable-next-line @typescript-eslint/no-inferrable-types
const data: string = 'Hello!'
function onClick() {
  alert('Hello!')
}
</script>

<template>
  <button @click="onClick">
    {{ data }} Click Me!
  </button>
</template>
