<script setup lang="ts">
import "@justway/ui/style/button.css";
import { ref, onMounted, computed, inject, unref, type MaybeRef } from "vue";
// import color from "color";
import { useRippleEffect } from "../../composables/use-ripple-effect";
const props = defineProps<{
  icon?: string;
  value?: unknown;
  loading?: boolean;
  toggle?: boolean;
}>();

const isToggleButton = ref(props.toggle)
const self = ref() // for root element
const icon = computed(() => {
  if (props.loading) return 'progress_activity'
  return props.icon
})


const grouper = inject<string>('container', '')
const groupValue = inject<MaybeRef<unknown>>('groupValue', null)
const reportValue = inject<(val: unknown) => void>('setValue', (val: unknown) => { })
const localToggleState = ref(false)
const toggleState = computed(() => {
  if (grouper === 'ui-group') {
    return unref(groupValue) === props.value
  }
  return localToggleState.value
})


if (grouper === 'ui-group' && props.value) {
  isToggleButton.value = true
  const v = unref(groupValue)
  if (v === props.value) {
    reportValue?.(props.value)
  }
}

const handleClick = () => {
  if (isToggleButton.value) {
    reportValue?.(props.value)
  }
}

const textColor = ref('buttontext')
onMounted(() => {
  // const el = self.value?.$el as HTMLElement // XXX: because of `ref` of `component` is Proxy of `component` or `HTMLElement`
  try {
    // textColor.value = color(getComputedStyle(el).backgroundColor).isDark() ? 'white' : 'black'
  } catch (error) {
    textColor.value = 'black'
  }
})

const createRippleEffect = useRippleEffect(self)
</script>
<template>
  <ui-linkable ref="self" role="button" default-tag="button" class="ui button" :aria-pressed="toggleState"
    @mousedown="createRippleEffect" @click="handleClick">
    <slot name="leading">
      <ui-icon v-if="icon" :class="{ loading }" :name="icon" />
    </slot>
    <slot>{{ value }}</slot>
  </ui-linkable>
</template>
