<script setup lang="ts">
withDefaults(defineProps<{
  type?: 'info' | 'success' | 'warning' | 'error'
  dismissible?: boolean
}>(), {
  type: 'info',
  dismissible: false
})

const dismiss = () => {
  console.log('dismiss')
}
</script>
<template>
  <div role="alert" class="ui alert" :class="['ui', type, { dismissible }]">
    <slot />
    <button v-if="dismissible" @click="dismiss" class="close" aria-label="Close">
      <ui-icon name="close" />
    </button>
  </div>
</template>