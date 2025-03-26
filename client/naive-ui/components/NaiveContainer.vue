<script lang="ts" setup>
import type { InstallComponent, InstallProvider } from './InstallProvider'
import { darkTheme, lightTheme } from 'naive-ui'
import { useData } from 'vitepress'

const props = defineProps<{
  install?: InstallComponent[]
  title: string
  id: string
}>()

const { isDark } = useData()

function handleTitleClick() {
  window.location.hash = `#${props.id}`
}
</script>

<template>
  <n-config-provider :theme="isDark ? darkTheme : lightTheme">
    <n-message-provider>
      <InstallProvider :install="props.install">
        <n-card
          :id="id"
          class="demo-card"
          :segmented="{
            footer: true,
          }"
          footer-style="padding: 0;"
        >
          <template #header>
            <span style="cursor: pointer" @click="handleTitleClick">
              {{ title }}
            </span>
          </template>
          <template #header-extra>
            <div style="display: flex; gap: 6px">
              <slot name="header-extra" />
            </div>
          </template>
          <div class="demo-content">
            <slot />
          </div>
          <template #footer>
            <slot name="footer" />
          </template>
        </n-card>
      </InstallProvider>
    </n-message-provider>
  </n-config-provider>
</template>

<style>
  .demo-card {
    margin: 28px 0;
  }
  .demo-content p {
    margin: 0;
  }
</style>
