<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps<{
  title?: string
  centered?: boolean
  responsible?: boolean
}>()

const drawerVisible = ref(false)
const toggleDrawer = () => {
  drawerVisible.value = !drawerVisible.value
}

const slots = useSlots()
const hasDrawer = computed(() => slots.drawer !== undefined)
provide('hasDrawer', hasDrawer)
provide('drawerVisible', drawerVisible)
</script>

<template>
  <section class="ui scaffold">
    <slot name="appbar" :toggle-drawer="toggleDrawer">
      <ui-appbar :title="title" :centered="centered" />
    </slot>
    <slot name="aside">
      {{ drawerVisible }}
      <ui-drawer class="w-64 bg-[color:var(--ui-panel-bg)]" v-model="drawerVisible" v-if="$slots.drawer">
        <slot name="drawer" />
      </ui-drawer>
    </slot>
    <section class="*" :class="{ centered }">
      <slot />
    </section>
  </section>
</template>

<style>
.ui.scaffold {
  background-color: var(--ui-background-color);
  width: 100%;

  display: grid;
  grid-template:
    "appbar appbar" fit-content
    "aside main" minmax(fit-content, auto) / 1fr;

  .centered {
    /* justify-content: center;
    align-items: center; */
    /* margin: 0 auto; */
  }

  >.\* {
    max-width: var(--ui-container-width, 100%);
    background-color: var(--ui-background-color);
  }

  >header.appbar {
    background-color: var(--ui-appbar-bg, #222);
    color: var(--ui-appbar-text, #fff);
    position: sticky;
    top: 0;
    z-index: 100;

    .container {
      /* @apply flex items-center gap-4 p-2 */
      max-width: var(--ui-container-width, 100%);
      display: flex;
      gap: 0.25rem;
      align-items: center;
      padding: 0.25rem;
    }

    button.menu {
      background-color: transparent;
      color: var(--ui-appbar-text, #fff);
      border: none;
    }

    h1 {
      font-size: 1.25rem;
      font-weight: 700;
    }
  }
}
</style>