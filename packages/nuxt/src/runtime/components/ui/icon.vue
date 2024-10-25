<script setup lang="ts">
const props = defineProps<{
  name: string;
  filled?: boolean;
}>();

// const isFontLoaded = ref(document?.fonts?.check('1em Material Symbols Outlined'));
// document?.fonts?.addEventListener('loadingdone', () => {
//   isFontLoaded.value = true;
// });
// const fontText = computed(() => (isFontLoaded.value ? props.name : ' '));
</script>
<template>
  <i class="material-symbols-outlined" :class="{ filled }">
    {{ name }}
  </i>
</template>
<style>
@import url(https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200);

.material-symbols-outlined {
  width: 1em;
  overflow: hidden;
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
