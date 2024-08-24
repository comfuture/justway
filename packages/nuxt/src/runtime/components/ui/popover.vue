<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from '#app';
import { onClickOutside, useElementBounding } from '@vueuse/core';
import { useFloating, offset, flip, shift, type Placement, autoUpdate } from '@floating-ui/vue'

const props = withDefaults(defineProps<{
  placement?: Placement
  offset?: number
}>(), {
  placement: 'bottom',
  offset: 0
})

const trigger = ref<HTMLElement>() // maybe Ref<HTMLElement>
const self = ref<HTMLElement>() // Ref<HTMLDivElement>

const open = defineModel<boolean>({
  default: false
})

const showFunc = () => {
  open.value = true
}
const hideFunc = () => {
  open.value = false
}

const toggleFunc = () => {
  open.value = !open.value
}

const { floatingStyles, update } = useFloating(trigger, self, {
  placement: props.placement,
  middleware: [offset(props.offset), flip(), shift()],
  whileElementsMounted: autoUpdate
})

// show or hide popover when open changes
watch(open, () => {
  if (open.value) {
    update()
    self.value?.showPopover()
  } else {
    self.value?.hidePopover()
  }
})

// hide popover when route changes or click outside
const route = useRoute()
watch([route.fullPath], hideFunc)
onClickOutside(self, hideFunc, {
  ignore: [trigger.value]
})

defineExpose({
  show: showFunc,
  hide: hideFunc,
  toggle: toggleFunc
})
</script>
<template>
  <span ref="trigger" class="ui popover-trigger">
    <slot name="trigger" :show="showFunc" :hide="hideFunc" :toggle="toggleFunc" />
  </span>
  <Teleport to="#teleports">
    <div class="ui popover" popover="manual" :hide="hideFunc" ref="self" :style="open ? floatingStyles : {}">
      <slot />
    </div>
  </Teleport>
</template>
<style scoped>
:deep() {
  display: inline-flex;
  align-items: stretch;
}
</style>
<style>
.ui.popover {
  /* reset some [popover] agent styles */
  inset: unset;
  margin: unset;
  background-color: transparent;

  &:popover-open {
    @starting-style {
      opacity: 0;
    }

    opacity: 1;
  }

  opacity: 0;
  transition: opacity 0.125s ease-in-out;
  transition-behavior: allow-discrete;
}
</style>