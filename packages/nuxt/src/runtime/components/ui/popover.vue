<script setup lang="ts">
import { ref, watch, getCurrentInstance, onMounted, useTemplateRef } from 'vue'
import { useRoute } from 'vue-router';
import { onClickOutside, useElementBounding } from '@vueuse/core';
import { useFloating, offset, flip, shift, type Placement, autoUpdate } from '@floating-ui/vue'

const props = withDefaults(defineProps<{
  placement?: Placement
  offset?: number
  open?: boolean
}>(), {
  placement: 'bottom',
  offset: 0
})

const instance = getCurrentInstance()

const trigger = useTemplateRef<HTMLElement>('trigger') // maybe Ref<HTMLElement>
const self = useTemplateRef<HTMLElement>('self') // Ref<HTMLDivElement>

onMounted(() => {
  if (!trigger.value) {
    console.warn('Popover: trigger element is not found')
  }
})

// onMounted(() => {
//   const el = instance?.subTree?.children?.[0].el as Element
//   trigger.value = el as HTMLElement
// })

const open = defineModel<boolean>({
  default: false
})
open.value = props.open

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
}, { immediate: true })

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
  <!-- <slot name="trigger" :show="showFunc" :hide="hideFunc" :toggle="toggleFunc" /> -->
  <span ref="trigger" class="ui popover-trigger" v-if="$slots.trigger">
    <slot name="trigger" :is-open="open" :show="showFunc" :hide="hideFunc" :toggle="toggleFunc" />
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