<script setup lang="ts">
import type { ServerDrivenUI } from '../../src/runtime/components/ui/server-driven';
const ui = ref<ServerDrivenUI>({
  tag: 'ui-content',
  attrs: {
    list: true,
    class: 'p-4',
  },
  children: [
    {
      tag: 'ui-item',
      children: ['Home'],
    },
    {
      tag: 'ui-item',
      children: ['Basics'],
    }
  ]
})
</script>
<template>
  <ui-server-driven :value="ui" />
</template>