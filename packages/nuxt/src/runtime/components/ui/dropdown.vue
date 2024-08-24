<script setup lang="ts">
import type { Placement } from '@floating-ui/vue'
import { ref, provide } from '#imports'

const props = withDefaults(defineProps<{
  placement?: Placement
  offset?: number
}>(), {
  placement: 'bottom',
  offset: 0
})
const emit = defineEmits<{
  (event: 'select', value: any): void
}>()

const dropdown = ref<HTMLElement>()

provide('container', 'ui-dropdown')
</script>
<template>
  <ui-popover :placement ref="dropdown">
    <template #trigger="{ toggle, open, close }">
      <slot :toggle="toggle" :open="open" :close="close" />
    </template>
    <template #="{ toggle, open, close }">
      <menu class="ui dropdown">
        <slot name="menu"></slot>
      </menu>
    </template>
  </ui-popover>
</template>
<style>
menu.ui.dropdown {
  /* @apply bg-[color:canvas] shadow rounded p-1; */
  background-color: canvas;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 0.25rem;
  padding: 0.25rem;

  >.item,
  >.popover-trigger {
    padding: 0.5rem;

    &:hover {
      background-color: var(--ui-hover-color);
    }
  }
}
</style>