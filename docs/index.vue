<script lang="ts" setup>
import { NButton } from 'naive-ui'

type Message = string | number
const data: Message = 'Hello!'

function print(text: Message) {
  alert(text)
}
</script>

<template>
  <NButton @click="() => print(data)">
    {{ data }} Click Me!
  </NButton>
</template>
