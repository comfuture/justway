<script setup lang="ts">
import { ref, onMounted, nextTick, computed, inject, unref, type MaybeRef } from "vue";
// import color from "color";
import { useRippleEffect } from "../../composables/use-ripple-effect";
const props = withDefaults(defineProps<{
  icon?: string;
  value?: any;
  loading?: boolean;
  toggle?: boolean;
}>(), {});

const isToggleButton = ref(props.toggle)
const self = ref() // for root element
const icon = computed(() => {
  if (props.loading) return 'progress_activity'
  return props.icon
})


const grouper = inject<string>('container')
const groupValue = inject<MaybeRef<any>>('groupValue')
const reportValue = inject<(val: any) => void>('setValue')
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
  const el = self.value?.$el as HTMLElement // XXX: because of `ref` of `component` is Proxy of `component` or `HTMLElement`
  try {
    // textColor.value = color(getComputedStyle(el).backgroundColor).isDark() ? 'white' : 'black'
  } catch (error) {
    textColor.value = 'black'
  }
})

const createRippleEffect = useRippleEffect(self)
</script>
<template>
  <ui-linkable default-tag="button" class="ui button" :class="{ pushed: toggleState }" ref="self"
    @mousedown.native="createRippleEffect" @click="handleClick">
    <slot name="leading">
      <ui-icon v-if="icon" :class="{ loading }" :name="icon" />
    </slot>
    <slot>{{ value }}</slot>
  </ui-linkable>
</template>
<style>
.ui.button {
  --face-color: var(--ui-button-face, ButtonFace);
  --text-color: var(--ui-button-text, ButtonText);

  &.primary {
    --face-color: var(--ui-primary);
  }

  &.secondary {
    --face-color: var(--ui-secondary);
  }


  &.warning {
    --face-color: var(--ui-warning);
  }

  &.success {
    --face-color: var(--ui-positive);
  }

  &.danger {
    --face-color: var(--ui-negative);
  }

  --ui-border-color: #999;
  border-radius: var(--ui-border-radius);
  background-color: var(--face-color);
  color: var(--text-color);
  position: relative;
  overflow: hidden;
  display: inline-block;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  align-items: center;
  text-align: center;
  white-space: nowrap;
  /* transition: color 0.2s, background-color 0.2s,  */
  transition: box-shadow 0.1s;


  &:hover {
    box-shadow: inset 0 0 0 999px rgba(0, 0, 0, 0.1);

    @media (color-scheme: dark) {
      box-shadow: inset 0 0 0 999px rgba(255, 255, 255, 0.2);
    }
  }

  &:active {
    box-shadow: inset 0 0 0 999px rgba(0, 0, 0, 0.2);
  }

  &.pushed {
    background-color: color-mix(in lab, var(--face-color) 80%, black 20%);
    box-shadow: inset 0 0 2px 1px rgba(0, 0, 0, 0.2);
  }

  &.sm {
    padding: 0.37rem 0.5rem;
    font-size: 0.75rem;
    border-radius: 0.125rem;
  }

  &.fab {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;

    /* @apply fixed bottom-4 right-4 w-12 h-12 rounded-full aspect-square shadow-lg;
    @apply flex items-center justify-center; */
  }

  ins.ripple {
    width: 2px;
    height: 2px;
    border-radius: 50%;
    background-color: var(--ripple-color);
    position: absolute;
    /* @apply w-1 h-1 absolute rounded-full bg-[color:var(--ripple-color)]; */
    animation: ripple 0.5s linear;
  }

  i.material-symbols-outlined {
    font-size: 1.25rem;
    line-height: 1;
    margin-right: 0.5rem;

    &.loading {
      animation: spin 1s linear infinite;
    }
  }

  &.link {
    display: inline-flex;
    background-color: transparent;
    padding: 0;
    margin: 0;

    &:hover {
      text-decoration: underline;
    }
  }

  &.outline {
    border: 1px solid currentColor;
    background-color: transparent;
  }

  &.circular {
    border-radius: 50%;
  }

  &:disabled,
  &.disabled {
    background-color: var(--ui-disabled);
    color: var(--ui-disabled-text);
    cursor: not-allowed;
    text-shadow: -1px -1px 0 rgba(0, 0, 0, 0.2);
  }
}

.ui.group {
  >.ui.button {
    border-radius: 0;
    border-right: none;

    +.ui.button {
      border-left: 1px solid color-mix(in lab, var(--face-color) 80%, black 20%);
    }

    &:first-child {
      border-radius: var(--ui-border-radius) 0 0 var(--ui-border-radius);
    }

    &:last-child {
      border-radius: 0 var(--ui-border-radius) var(--ui-border-radius) 0;
    }
  }
}
</style>