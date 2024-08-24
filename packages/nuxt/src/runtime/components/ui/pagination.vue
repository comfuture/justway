<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from '#app';

const props = withDefaults(defineProps<{
  total: number
  page: number
  pageSize?: number
  scale?: number
}>(), {
  total: 0,
  page: 1,
  pageSize: 12,
  scale: 5
})

/*
1 [2] 3 4 5

1 2 [3] 4 5 ... 100

1 ... 2 3 [4] 5 6 ... 100

1 ... 96 97 [98] 99 100
*/

const totalPages = computed(() => Math.ceil(props.total / props.pageSize))
const firstScale = computed(() => {
  if (props.page <= props.scale / 2 - 1) return 1
  if (totalPages.value - props.page < props.scale / 2) return Math.max(1, totalPages.value - props.scale)
  return Math.max(1, props.page - Math.floor(props.scale / 2))
})

const elapseFirst = computed(() => {
  if (props.page < props.scale / 2 - 1) return false
  if (firstScale.value > 1) return true
  return false
})
const elapseLast = computed(() => {
  if (props.page > totalPages.value - Math.floor(props.scale / 2)) return false
  let lastScale = props.page + Math.ceil(props.scale / 2)
  if (lastScale < totalPages.value) return true
  return false
})

const pages = computed(() => {
  let _pages = []
  let lastScale = props.page >= 3
    ? Math.min(props.page + props.scale / 2, totalPages.value)
    : Math.min(6 - firstScale.value, totalPages.value)
  for (let i = firstScale.value; i <= lastScale; i++) {
    _pages.push(i)
  }
  return _pages;
})

const route = useRoute()

const makeRoute = (page: number) => {
  const query = { ...route.query, page }
  return {
    path: route.path,
    query
  }
}
</script>
<template>
  <div class="ui pagination">
    <template v-if="elapseFirst">
      <nuxt-link :to="makeRoute(1)" :class="{ current: 1 === props.page }">
        <kbd>1</kbd></nuxt-link>
      <ui-icon name="more_horiz" />
    </template>
    <nuxt-link v-for="page in pages" :key="page" :to="makeRoute(page)" :class="{ current: page === props.page }">
      <kbd>{{ page }}</kbd>
    </nuxt-link>
    <template v-if="elapseLast">
      <ui-icon name="more_horiz" />
      <nuxt-link :to="makeRoute(totalPages)" :class="{ current: totalPages === props.page }">
        <kbd>{{ totalPages }}</kbd>
      </nuxt-link>
    </template>
  </div>
</template>
<style>
.ui.pagination {
  display: flex;
  gap: 0.25rem;
  align-items: center;

  &>a {
    &.current {
      color: var(--ui-primary);
    }

    kbd {
      font-weight: 600;
      font-size: 0.85rem;
      background-color: var(--ui-panel-bg);
      border: 1px solid var(--ui-border-color);
      border-radius: var(--ui-border-radius);
      padding: 0.25rem 0.5rem;
    }
  }
}
</style>