<script setup lang="ts">
import { useAttrs, useSlots, computed, defineProps, h } from "vue";
import type { FieldDefinition } from '../../util/form'
import UIInput from "./input.vue";

const basicInputTypes = ["text", "checkbox", "email", "password", "number", "tel", "url", "color", "range", "date", "time", "datetime-local"];
const props = withDefaults(defineProps<FieldDefinition>(), {
  type: "text"
});
const attrs = useAttrs()
const slots = useSlots()
const isBasicInput = computed(() => basicInputTypes.includes(props.type as string));
const getOptionValue = (option: string | { label: string, value: string }) => {
  if (typeof option === 'string') {
    return option;
  }
  return option.value;
};
const getOptionLabel = (option: string | { label: string, value: string }) => {
  if (typeof option === 'string') {
    return option;
  }
  return option.label;
};

const renderInput = () => {
  if (props.component === 'select' && props.options) {
    return h(UIInput, {
      label: props.label,
    }, {
      default: ({ setValue }: { setValue: (v: unknown) => void }) => {
        return h('select', {
          name: props.name,
          onInput: (e: Event) => {
            setValue((e.target as HTMLSelectElement).value);
          },
          ...attrs
        }, props.options?.map((option) => {
          const value = getOptionValue(option);
          return h('option', {
            value,
            selected: value === props.value
          }, getOptionLabel(option))
        }))
      },
      description: () => slots.description
    })
  }
  if (isBasicInput.value) {
    return h(UIInput, {
      type: props.type as string,
      name: props.name,
      label: props.label,
      ...attrs
    });
  } else if (props.type === 'checkbox') {

    return h("div", [
      [JSON.stringify(props)]
    ]);
  } else {
    return h("div", [
      [JSON.stringify(props)]
    ]);
  }
};
</script>
<template>
  <render-input />
</template>