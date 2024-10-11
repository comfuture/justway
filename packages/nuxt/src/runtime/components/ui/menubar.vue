<script setup lang="ts">
import { provide } from '#imports';

provide('container', 'ui-menubar');
</script>
<template>
  <nav class="ui menubar">
    <menu role="menubar">
      <slot />
    </menu>
  </nav>
</template>
<style>
.ui.menubar {
  gap: 0.5rem;

  >menu {
    display: flex;
    gap: 0.5rem;

    >.ui.item,
    >.popover-trigger>.ui.item {
      cursor: pointer;
      width: auto;
      padding: 0.25rem 0.5rem;
    }

    >:hover {
      background-color: var(--ui-hover-color);
    }
  }
}
</style>