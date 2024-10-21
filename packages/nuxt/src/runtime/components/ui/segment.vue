<script setup lang="ts">
import { computed, useAttrs } from 'vue';
const props = defineProps<{
  title?: string
  subtitle?: string
  noMargin?: boolean
  loading?: boolean
  // content classes
  list?: boolean
  columns?: boolean
  responsible?: boolean
  table?: boolean | Record<string, any>[]
  form?: boolean | Record<string, any>
}>();

const noMargin = computed(() => {
  return props.noMargin || false;
})

const attrs = useAttrs();
</script>
<template>
  <section class="ui segment">
    <header v-if="props.title || $slots.title || $slots.actions">
      <div class="flex gap-2 items-center">
        <slot name="title">
          <h3 class="title">{{ props.title }}</h3>
        </slot>
      </div>
      <div class="actions" v-if="$slots.actions">
        <slot name="actions" />
      </div>
    </header>
    <section :class="['content', { list, columns, responsible, table }, attrs['content-class']]">
      <slot>
        <ui-table v-if="props.table" :data="props.table" />
      </slot>
      <div class="loading" v-if="props.loading">
        <ui-icon name="progress_activity" class="animate-spin" />
      </div>
    </section>
    <footer v-if="$slots.footer">
      <slot name="footer" />
    </footer>
  </section>
</template>
<style>
.ui.segment {
  background-color: var(--ui-panel-bg);
  color: var(--ui-text-color);
  border: 1px solid var(--ui-border-color);
  border-radius: var(--ui-border-radius);
  display: flex;
  flex-direction: column;
  /* @apply bg-[color:var(--ui-bg-color)] text-[color:var(--ui-text-color)] border border-[color:var(--ui-border-color)] rounded flex flex-col; */

  @media (color-scheme: dark) {
    border: none;
  }

  >header {
    padding: 0.5rem;
    border-bottom: 1px solid var(--ui-border-color);
    border-radius: var(--ui-border-radius) var(--ui-border-radius) 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    /* @apply p-2 border-b border-[color:var(--ui-border-color)] rounded-t flex justify-between items-center;
    @apply bg-[color:var(--ui-bg-color)] text-[color:var(--ui-text-color)]; */

    .title {
      margin: 0 0;
      font-weight: 600;
      /* @apply font-semibold; */
    }

    .subtitle {
      font-size: 0.875rem;
      color: var(--ui-text-muted-color);
      /* @apply text-sm text-gray-500; */
    }
  }

  >section.content:not(.table) {
    flex: 1;
    padding: 0.5rem;
    overflow-x: auto;
    /* @apply flex-1 p-2 overflow-x-auto; */

    &.no-margin {
      padding: 0;
      /* @apply p-0; */
    }

    >.loading {
      backdrop-filter: blur(2px);
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      /* @apply backdrop-blur absolute left-0 top-0 w-full h-full inset-0 flex justify-center items-center; */
    }
  }

  &.no-margin>section.content {
    padding: 0;
    /* @apply p-0; */
  }

  >section.actions {
    display: flex;
    gap: 0.5rem;
    /* @apply flex gap-2; */
  }

  >footer {
    padding: 0.5rem;
    border-top: 1px solid var(--ui-border-color);
    border-radius: 0 0 var(--ui-border-color) var(--ui-border-color);
    /* @apply p-2 border-t border-gray-200 rounded-b; */
  }
}
</style>