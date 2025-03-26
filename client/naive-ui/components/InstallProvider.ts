import type { Component, PropType, VNode } from 'vue'
import { defineComponent, h } from 'vue'

export interface InstallComponentOptions { component: Component, props: any }
export type InstallComponent = Component | InstallComponentOptions

export const InstallProvider = defineComponent({
  props: {
    install: {
      type: Array as PropType<InstallComponent[]>,
      default: () => [],
    },
  },
  setup({ install }, { slots }) {
    function render(content: VNode, { component, props }: any) {
      return h(component, props, () => content)
    }
    return () => resolve(install).reduceRight(render, slots.default?.() as any)
  },
})

function resolve(components: InstallComponent[]): InstallComponentOptions[] {
  return components.map((item: any) => {
    if (!item.component)
      return { component: item as Component, props: {} }
    else
      return item
  })
}
