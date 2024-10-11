<script setup lang="ts">
const props = withDefaults(defineProps<{
  label: string
}>(), {
  label: 'Toolbar'
})
</script>
<template>
  <div role="toolbar" class="ui toolbar" :aria-label="label">
    <slot />
  </div>
</template>