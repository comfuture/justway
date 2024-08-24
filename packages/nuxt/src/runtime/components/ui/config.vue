<script setup lang="ts">
const props = defineProps<{
  locale?: string,
}>()
props.locale && provide('locale', props.locale);
</script>
<template class="bar">
  <slot />
</template>