<script setup lang="ts">
import { defineProps, ref, onMounted, computed, watch, nextTick } from 'vue'
import { useRoute } from '#imports'
import { useWindowSize } from '@vueuse/core';

const props = defineProps<{
  menu?: boolean
  visible?: boolean
}>()
const open = defineModel<boolean>({
  required: false,
  default: false,
})

const self = ref<HTMLElement>()

onMounted(() => {
  self.value?.addEventListener('transitionend', () => {
    if (!drawerVisible.value) {
      self.value?.setAttribute('aria-hidden', 'true')
    }
  })
})
// window 사이즈가 mobile 이하로 작아지는지를 계속해서 감지
const { width } = useWindowSize()

const drawerVisible = computed(() => {
  return width.value > 768 || props.visible
})
const drawerAttrs = computed(() => ({
  popover: drawerVisible.value ? null : 'auto',
  'aria-hidden': !drawerVisible.value,
}))
watch(open, (value) => {
  nextTick(() => {
    if (value) {
      if (!self.value?.hasAttribute('popover')) return;
      console.log('show popover')
      self.value?.showPopover()
    } else {
      if (!self.value?.hasAttribute('popover')) return;
      console.log('hide popover')
      self.value?.hidePopover()
    }
  })
})

const route = useRoute()
watch(() => route.fullPath, () => {
  open.value = false
})

onMounted(() => {
  self.value?.addEventListener('toggle', (e: ToggleEvent) => {
    open.value = e.newState === 'open'
  })
})
</script>
<template>
  <aside v-bind="drawerAttrs" class="ui drawer" ref="self">
    <section :class="['content', { list: menu }]">
      <slot />
    </section>
  </aside>
</template>
<style>
.ui.drawer {
  inset-inline-start: unset;
  inset-inline-end: unset;
  margin: unset;

  nav {
    display: flex;
    flex-direction: column;

    >.item {
      padding: 0.25rem 0.5rem;
    }
  }

  &[popover] {
    transform: translateX(-100%);
    transition: transform 0.2s ease-in-out;
    transition-behavior: allow-discrete;

    &:popover-open {
      @starting-style {
        transform: translateX(-100%);
      }

      height: 100vh;
      position: sticky;
      left: 0;
      top: 0;
      transform: translateX(0);
    }
  }
}
</style>