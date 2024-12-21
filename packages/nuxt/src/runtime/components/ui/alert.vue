<script setup lang="ts">
import "@justway/ui/style/alert.css"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = withDefaults(defineProps<{
  type?: 'info' | 'success' | 'warning' | 'error'
  dismissible?: boolean
}>(), {
  type: 'info',
  dismissible: false
})

const self = ref<HTMLElement>()

const dismiss = () => {
  self.value?.offsetParent?.removeChild(self.value)
}
</script>
<template>
  <div ref="self" role="alert" class="ui" :class="[type, 'alert', { dismissible }]">
    <slot />
    <button v-if="dismissible" class="close" aria-label="Close" @click="dismiss">
      <ui-icon name="close" />
    </button>
  </div>
</template>
