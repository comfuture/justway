<script setup lang="ts">
defineProps<{
  name: string;
  filled?: boolean;
}>();
</script>
<template>
  <i class="material-symbols-outlined" :class="{ filled }">
    {{ name }}
  </i>
</template>
<style>
@import url(https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200);

.material-symbols-outlined {
  vertical-align: middle;
  font-variation-settings:
    'FILL' 0,
    'wght' 400,
    'GRAD' 0,
    'opsz' 48;

  &.filled {
    font-variation-settings:
      'FILL' 1;
  }
}
</style>