<script setup lang="ts" generic="T extends FormModel">
import { computed, provide } from 'vue';
import type { JSONSchema4 } from 'json-schema';
import { getFieldDefintions } from '../../util/form'

export type FormModel = Record<string, any>;

const props = defineProps<{
  schema?: JSONSchema4;
}>();

const model = defineModel<T>({
  default: () => ({}),
});

const fields = getFieldDefintions(props.schema ?? {})
const getInitialValue = (name: string) => {
  return model.value[name] ?? fields.find((field) => field.name === name)?.default
}

provide('container', 'ui-form')
provide('form-model', model)
</script>
<template>
  <form class="ui form">
    <slot>
      <ui-form-field v-for="field in fields" :key="field.name" v-bind="field" v-model="model[field.name]"
        :initial-value="getInitialValue(field.name)" v-if="props.schema" />
    </slot>
  </form>
</template>
<style>
.ui.form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  &.tabular {
    display: table;
  }
}
</style>