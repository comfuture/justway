<script setup lang="ts">
import type { Placement } from '@floating-ui/vue'
import { provide, inject } from '#imports';

const container = inject<string>('container');
provide('container', 'ui-menu');

const placement: Placement = container === 'ui-menu' ? "right-start" : "bottom-start";

const openIfParentOpen = () => {
}
</script>
<template>
  <ui-popover :placement>
    <template #trigger="{ toggle, isOpen }">
      <slot :toggle="toggle" :is-open>
        <ui-item @click="toggle">
          <slot name="label" />
          <template #trailing v-if="container === 'ui-menu'">
            <ui-icon name="chevron_right" />
          </template>
        </ui-item>
      </slot>
    </template>
    <menu role="menu" class="ui">
      <slot name="menu">
        <ui-item href="#">Item 1</ui-item>
        <ui-item href="#">Item 2</ui-item>
      </slot>
    </menu>
  </ui-popover>
</template>
<style>
menu.ui {
  /* @apply bg-[color:canvas] shadow rounded p-1; */
  min-width: 8rem;
  background-color: canvas;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 0.25rem;
  padding: 0.25rem;

  >.item,
  >*>.item {
    padding: 0.5rem;

    &:hover {
      background-color: var(--ui-hover-color);
    }
  }
}
</style>
