<script setup lang="ts" generic="T extends InputValue">
import { computed, useSlots, inject, ref, type Ref, watch } from 'vue'

export type InputValue = string | number | readonly string[] | null | undefined;

defineOptions({
  inheritAttrs: false
})

const props = withDefaults(defineProps<{
  id?: string;
  name?: string;
  type?: string;
  label?: string;
}>(), {
  type: 'text',
})

const value = defineModel<T>({
  required: false,
})

const setValue = (val: T) => {
  value.value = val
}

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  value.value = target.value as T
}

const id = props.id ?? useId()
const slots = useSlots()
const hasLabel = computed(() => !!props.label || !!slots.label)

// XXX: 2-way binding to container form model if this input is within a form and has a name and no model binding itself
const isWithinForm = inject<string>('container', '') === 'ui-form'
if (isWithinForm && !value.value) {
  const formModel = inject<Ref<Record<string, T>>>('form-model', ref({}))
  if (formModel && props.name) {
    value.value = formModel.value[props.name] // retrieve value from form model
    watch(value, (val: unknown) => {
      // XXX: if value is empty, vue's watch treats it as empty string ''
      formModel.value[props.name!] = val as T// update value in form model
    })
  }
}
</script>
<template>
  <div class="ui input">
    <label v-if="hasLabel" :for="id">
      <slot name="label">
        {{ label }}
      </slot>
    </label>
    <div class="*">
      <slot :id="id" :attrs="$attrs" :value="value" :set-value="setValue" :on-input="onInput">
        <input :id="id" v-model="value" :name="name" :type="type" v-bind="$attrs">
      </slot>
    </div>
  </div>
  <p v-if="slots?.description" class="description">
    <slot name="description" />
  </p>
</template>
<style>
.ui.input {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  label+* {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    >input:not([type="checkbox"]):not([type="radio"]):not([type="color"]):not([type="range"]),
    >select,
    >textarea {
      /* width: 100%; */
      padding: 0.5rem;
      /* 0.25rem 0.5rem; */
      border: 1px solid var(--ui-border-color);
      border-radius: var(--ui-border-radius);
    }
  }

  &+.description {
    font-size: 0.75rem;
    color: var(--ui-text-color-secondary);
  }
}

/**
 * Experimental tabular layout.
 * 
 * This will put the label and input in a same row.
 * This is useful for forms that need to be displayed inline
 * because the labels will have the same width so it aligns beautifully.
 *
 * <!> Please note that this is experimental and may not work as expected.
 * <!> On the devices with small screens, the input elements may overflow.
 */
.tabular {
  .ui.input {
    display: table-row;

    >* {
      display: table-cell;
      padding: 0.25rem 0.5rem 0.25rem 0;
      word-break: none;

      &.input-group {
        width: 100%;
      }
    }
  }
}
</style>