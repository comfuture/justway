<script setup lang="ts">
const props = defineProps<{
  title?: string;
}>()
</script>
<template>
  <section class="ui card">
    <header>
      <slot name="header">
        <h2 v-if="title">{{ title }}</h2>
      </slot>
    </header>
    <slot />
  </section>
</template>
<style>
.ui.card {}
</style>