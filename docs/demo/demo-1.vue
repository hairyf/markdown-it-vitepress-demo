<script lang="ts" setup>
const data: string | number = 'Hello!'
function onClick() {
  alert('Hello!')
}
</script>

<template>
  <button @click="onClick">
    {{ data }} Click Me!
  </button>
</template>
