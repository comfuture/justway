<script setup lang="ts">
const isEditing = defineModel<boolean>({
  default: false,
});
const toggleEditing = () => {
  isEditing.value = !isEditing.value;
};
</script>
<template>
  <slot :toggle="toggleEditing">
  </slot>
</template>