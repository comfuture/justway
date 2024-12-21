<script setup lang="ts">
const props = defineProps<{
  title?: string
  centered?: boolean
  responsible?: boolean
}>()
const hasDrawer = inject<ComputedRef<boolean>>('hasDrawer')
const drawerVisible = inject<Ref<boolean>>('drawerVisible', ref(false))

const toggleDrawer = () => {
  drawerVisible.value = !drawerVisible.value
}
</script>
<template>
  <header class="ui appbar">
    <div class="container" :class="{ centered }">
      <button class="menu" @click="toggleDrawer" v-if="hasDrawer">
        <ui-icon name="menu" />
      </button>
      <slot name="title">
        {{ drawerVisible }}
        <h1 class="title">{{ title }}</h1>
      </slot>
    </div>
  </header>
</template>