<script setup lang="ts">
const props = withDefaults(defineProps<{
  tag?: string
  innerTag?: string
}>(), {
  tag: 'div',
  innerTag: 'div',
})
</script>
<template>
  <component :is="tag" ref="row">
    <slot name="leading" />
    <component :is="innerTag" class="*">
      <slot />
    </component>
    <slot name="trailing" />
  </component>
</template>
<style scoped>
:deep() {
  display: flex;
  justify-items: center;
  justify-content: space-between;
  gap: 0.25rem;

  >.\* {
    justify-content: unset;
    flex-grow: 1;
  }

  > :slotted() {
    display: flex;
    gap: 0.25rem;
  }
}
</style>