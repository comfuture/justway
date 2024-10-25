<script setup lang="ts">
import type { RouteLocation, RouteLocationRaw } from '#vue-router';
import { provide, inject, useAttrs } from '#imports';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = withDefaults(defineProps<{
  tag?: string,
  href?: string,
  to?: string | RouteLocation | RouteLocationRaw
  icon?: string,
}>(), {
  tag: 'div',
});

provide('container', 'ui-item');
const attrs = { ...useAttrs() }

// additional attributes
const container = inject<string>('container', '');
if (container === 'ui-menubar') {
  attrs.role = 'menuitem';
}
</script>
<template>
  <ui-linkable :default-tag="tag" class="ui item" :href="href" :to="to" v-bind="attrs">
    <slot name="leading">
      <ui-icon :name="icon!" v-if="icon" />
    </slot>
    <div class="*">
      <slot />
    </div>
    <slot name="trailing" />
  </ui-linkable>
</template>
<style>
.ui.item {
  display: flex;
  gap: 0.5rem;
  width: 100%;
  align-items: center;

  >.\* {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    >.title,
    >h1,
    >h2,
    >h3 {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;
      white-space: nowrap;
      text-overflow: ellipsis;
      margin: 0;
    }

    h1 {
      font-size: 1.25rem;
    }

    h2 {
      font-size: 1.125rem;
    }

    h3 {
      font-size: 1rem;
    }

    >.description {
      /* @apply text-sm text-gray-500 truncate; */
      font-size: 0.75rem;
      color: #6b7280;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}

.tabular .ui.item {
  display: table-row;

  >* {
    display: table-cell;
    white-space: nowrap;
    padding: 0.5rem;

    &.content {
      width: 100%;
    }
  }
}
</style>