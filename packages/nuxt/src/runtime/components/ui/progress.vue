<script setup lang="ts">
import { computed, withDefaults, useSlots, useId } from 'vue'
// import { useId } from '#app';

const props = withDefaults(defineProps<{
  value?: number | string
  max?: number | string
  label?: string
}>(), {
  value: 0,
  max: 100,
})

const slots = useSlots()
const hasLabel = computed(() => !!props.label || !!slots.label)
const id = useId()
const percentValue = computed(() => Number(props.value) / Number(props.max))
</script>
<template>
  <label :for="id" v-if="hasLabel">
    <slot name="label">
      {{ label }}
    </slot>
  </label>
  <progress :id="id" :class="['ui progress', { labeled: false }]" :value="value" :max="max" v-bind="$attrs">
    <ui-number percent :value="percentValue" />
  </progress>
</template>
<style>
.ui.progress,
progress.ui {
  appearance: none;
  -webkit-appearance: none;

  &::-webkit-progress-bar {
    background-color: var(--ui-border-color);
    border-radius: var(--ui-border-radius);
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  &::-webkit-progress-value {
    border-radius: var(--ui-border-radius);
    background-color: var(--ui-primary);

    &::before {
      content: attr(value) '%';
      position: absolute;
      right: 0.5rem;
      color: var(--ui-text-color);
    }
  }

  &:not([value]) {
    background-image: linear-gradient(-45deg, transparent 33%, rgba(0, 0, 0, .1) 33%,
        rgba(0, 0, 0, .1) 66%, transparent 66%);
    animation: spin 1s linear infinite;
  }
}
</style>