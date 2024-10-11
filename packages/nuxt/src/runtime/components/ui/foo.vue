<script setup lang="ts">
import { h } from 'vue';
const render = () => h('div', { class: 'ui foo' }, 'Foo')
</script>
<template>
  <render />
</template>
<style>
.ui.foo {
  background-color: red;
}
</style>