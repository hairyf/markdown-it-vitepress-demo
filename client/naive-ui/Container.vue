<script lang="ts" setup>
import { computed, ref } from 'vue'
import CopyCodeButton from './components/CopyCodeButton.vue'
import EditOnGithubButton from './components/EditOnGithubButton.vue'
import EditOnSandboxButton from './components/EditOnSandboxButton.vue'
import ExpandToggleButton from './components/ExpandToggleButton.vue'
import NaiveContainer from './components/NaiveContainer.vue'
import { i18n } from './composables'

const props = defineProps<{
  sfcTsCode: string
  // if using ts, sfcJsCode will transform the to js
  sfcJsCode: string
  github?: string
  title: string
  metadata: Record<string, any>
  expand?: boolean
}>()

const visible = ref(props.expand ?? false)

const { t } = i18n({
  'zh-CN': {
    show: '显示代码',
    hide: '收起代码',
    editOnGithub: '在 GitHub 中编辑',
    editInCodeSandbox: '在 CodeSandbox 中编辑',
    copyCode: '复制代码',
    copySuccess: '复制成功',
  },
  'en-US': {
    show: 'Show Code',
    hide: 'Hide Code',
    editOnGithub: 'Edit on GitHub',
    editInCodeSandbox: 'Edit in CodeSandbox',
    copyCode: 'Copy Code',
    copySuccess: 'Successfully Copied',
  },
})

const sfcTsCode = computed(() => decodeURIComponent(props.sfcTsCode))
const sfcJsCode = computed(() => decodeURIComponent(props.sfcJsCode))

const isUsingTs = computed(() => !!props.sfcTsCode)

const sfcCode = computed(() => isUsingTs.value ? sfcTsCode.value : sfcJsCode.value)

const showTs = ref(isUsingTs.value)
</script>

<template>
  <NaiveContainer :id="metadata.fileName" :title="title">
    <template #header-extra>
      <EditOnSandboxButton
        :code="sfcCode"
        :tooltip="t('editInCodeSandbox')"
      />
      <EditOnGithubButton
        :relative-path="metadata.relativePath"
        :tooltip="t('editOnGithub')"
        :glob-url="github"
      />
      <CopyCodeButton
        :code="sfcCode"
        :success-text="t('copySuccess')"
        :tooltip="t('copyCode')"
      />
      <ExpandToggleButton
        :tooltip="!visible ? t('show') : t('hide')"
        @click="visible = !visible"
      />
    </template>
    <n-p v-if="$slots['md:desc']" class="desc">
      <slot name="md:desc" />
    </n-p>
    <slot />
    <template v-if="visible" #footer>
      <n-tabs
        v-if="isUsingTs"
        size="small"
        type="segment"
        style="padding: 12px 24px 0 24px"
        animated
        @update:value="($e) => (showTs = $e === 'ts')"
      >
        <n-tab name="ts">
          TypeScript
        </n-tab>
        <n-tab name="js">
          JavaScript
        </n-tab>
      </n-tabs>

      <slot v-if="showTs" name="md:sfc-ts" />
      <slot v-else name="md:sfc-js" />
    </template>
  </NaiveContainer>
</template>

<style>
  .desc:not(:empty) {
    margin-bottom: 24px;
  }
  .demo-card .demo-card__view:not(:first-child) {
    margin-top: 16px;
  }
  .demo-card code.n-text {
    white-space: nowrap;
  }
</style>
