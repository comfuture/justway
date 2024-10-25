<script setup lang="ts">
import { ref, onMounted, nextTick, provide } from 'vue'
import { useMutationObserver } from '@vueuse/core';

const props = withDefaults(defineProps<{
  tag?: string
  itemColumnTemplate?: string
}>(), {
  tag: 'div',
  itemColumnTemplate: '' // 'repeat(auto-fill, minmax(0, auto))'
})

const value = defineModel<unknown>({
  default: () => null
})

const setValue = (val: unknown) => {
  value.value = val
}

provide('container', 'ui-group')
provide('groupValue', value)
provide('setValue', setValue)

const initialItemColumnTemplate = props.itemColumnTemplate.replace(/\$[a-z][a-z0-9_-]+/g, 'minmax(0, auto)')
const itemColumnTemplate = ref(initialItemColumnTemplate)
const grouper = ref<HTMLElement>()
const groupWidths = ref<Record<string, number>>({})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isTargetGroup(el: any): el is HTMLElement {
  return el.hasAttribute?.('data-group') ?? false
}

const reLayout = () => {
  if (!props.itemColumnTemplate) {
    return
  }
  groupWidths.value = {}
  grouper.value?.querySelectorAll(':not(.inline) [data-group]').forEach((el) => {
    // const group = el.dataset.group!
    const group = el.getAttribute('data-group')
    if (group) {
      const width = Math.ceil(el.getBoundingClientRect().width)
      const recentWidth = groupWidths.value[group] ?? 0
      if (width > recentWidth) {
        groupWidths.value[group] = width
      }
    }
  })
  itemColumnTemplate.value = props.itemColumnTemplate.replace(/\$[a-z][a-z0-9_-]+/g, (match) => {
    const group = match.slice(1)
    return `minmax(${groupWidths.value[group] ?? 0}px, min-content)`
  })
}

// onMounted(() => requestAnimationFrame(reLayout))
onMounted(reLayout)
useMutationObserver(grouper, (records) => {
  const shouldReLayout = records.some(r => isTargetGroup(r.target))
  if (props.itemColumnTemplate && shouldReLayout) {
    itemColumnTemplate.value = initialItemColumnTemplate
    nextTick(reLayout)
  }
}, {
  childList: true,
  subtree: true
})

defineExpose({
  setValue
})
</script>
<template>
  <component :is="tag" ref="grouper" :class="['ui group', { inline: !!itemColumnTemplate }]">
    <slot :value="value" />
  </component>
</template>
<style>
.ui.group {
  width: fit-content;
  border-radius: var(--ui-border-radius);

  &:focus-within {
    outline: 0.1rem solid var(--ui-outline-color);
  }

  .inline {
    >* {
      display: grid;
      grid-template-columns: v-bind(itemColumnTemplate);
    }
  }
}
</style>